# Musica originale generata da zero (nessun brano di terzi): pad morbido + arpeggio leggero, 86 s.
import numpy as np, wave
sr=44100; dur=86; t=np.arange(int(sr*dur))/sr
def note(f): return 440*2**((f-69)/12)
prog=[[57,60,64,67],[53,57,60,64],[48,52,55,60],[55,59,62,67]]  # Am7 Fmaj7 C G
bar=4.0
out=np.zeros_like(t)
for i in range(int(dur/bar)+1):
    ch=prog[i%4]; s=int(i*bar*sr); e=min(len(t),int((i+1)*bar*sr+sr))
    tt=np.arange(e-s)/sr
    env=np.minimum(1,tt/1.2)*np.exp(-np.maximum(0,tt-bar)*2.5)
    for m in ch:
        f=note(m)
        out[s:e]+=0.05*env*(np.sin(2*np.pi*f*tt)+0.3*np.sin(2*np.pi*2*f*tt+0.4)+0.12*np.sin(2*np.pi*f*1.003*tt))
    for k in range(8):  # arpeggio
        ps=s+int(k*bar/8*sr); m=ch[(k*3)%4]+12; f=note(m)
        L=int(0.9*sr); pe=min(len(t),ps+L); tt2=np.arange(pe-ps)/sr
        out[ps:pe]+=0.045*np.exp(-tt2*5)*np.sin(2*np.pi*f*tt2)*(1 if i>0 else min(1,k/8))
    # basso
    f=note(ch[0]-12); out[s:e]+=0.06*env*np.sin(2*np.pi*f*tt)
fade=np.ones_like(t); fi=int(2*sr); fo=int(4*sr); fade[:fi]=np.linspace(0,1,fi); fade[-fo:]=np.linspace(1,0,fo)
out*=fade
# leggero riverbero (feedback delay)
d=int(0.23*sr); y=out.copy()
for k in range(1,6): y[d*k:]+=out[:-d*k]*(0.35**k)
y/=np.max(np.abs(y))*1.15
st=np.stack([y, np.roll(y,int(0.012*sr))],1)
w=wave.open("music.wav","wb"); w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr); w.writeframes((st*32767).astype(np.int16).tobytes()); w.close()
