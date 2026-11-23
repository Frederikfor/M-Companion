# Writes synthetic microphone takes (strummed guitar, backing bleed, sparse, silence) as 44.1 kHz WAV.
# Usage: python3 tools/mic-lab/gen.py <out_dir>   (needs numpy)
import numpy as np, wave, os, sys
OUT=sys.argv[1] if len(sys.argv)>1 else '.'
os.makedirs(OUT, exist_ok=True)
SR=44100; rng=np.random.default_rng(1)
def strum(dur=0.35, amp=1.0, f0=110):
    n=int(SR*dur); t=np.arange(n)/SR
    env=np.exp(-t*9)
    s=np.zeros(n)
    for k,f in enumerate([f0,f0*1.5,f0*2,f0*2.52,f0*3,f0*4]):
        d=int(SR*0.004*k)  # strum spread
        tt=t[:n-d]
        s[d:]+= np.sin(2*np.pi*f*tt)*np.exp(-tt*6)*0.3
    noise=rng.standard_normal(n)*np.exp(-t*60)*0.4
    return (s+noise)*env*amp
def shk(amp=1.0):
    n=int(SR*0.08); t=np.arange(n)/SR
    x=rng.standard_normal(n); x=np.diff(np.concatenate([[0],x]))  # highpass-ish
    return x*np.exp(-t*50)*amp*0.5
def track(events, dur):
    out=np.zeros(int(SR*dur)+SR)
    for t0,snd in events:
        i=int(t0*SR); out[i:i+len(snd)]+=snd[:len(out)-i]
    return out[:int(SR*dur)]
def times(bpm_fn, dur, sub=2):
    t=0.0; res=[]; k=0
    while t<dur:
        res.append((t,k)); t+=60/bpm_fn(t)/sub; k+=1
    return res
def guitar(bpm_fn, dur, sub=2, amp=1.0, every=1):
    return track([(t, strum(amp=amp*(1 if k%sub==0 else 0.6))) for t,k in times(bpm_fn,dur,sub) if k%every==0], dur)
def save(name,x):
    x=x/np.max(np.abs(x))*0.8
    w=wave.open(os.path.join(OUT,name),'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((x*32767).astype(np.int16).tobytes()); w.close()
D=60
save('g72.wav', guitar(lambda t:72, D))
save('g76.wav', guitar(lambda t:76, D))
save('g72to80.wav', guitar(lambda t:72+8*min(t,40)/40, D))
bleed = track([(t,shk(1.0)) for t,k in times(lambda t:72,D,4)],D) + guitar(lambda t:76,D,amp=0.5)
save('bleed.wav', bleed)
save('half76.wav', guitar(lambda t:76, D, sub=2, every=4))  # strum only on beats 1,3
save('silence.wav', rng.standard_normal(SR*D)*0.01)
