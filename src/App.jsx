import { useState, useRef } from "react";

// ── CONFIGURAÇÃO DO PATROCINADOR ─────────────────────────────────
const PATROCINADOR = "Archipelago";
const SPONSOR_LOGO_URL = "https://archipelagoaec.com/hubfs/Full%20Logo%20Web%20Light.png";
// Para trocar de patrocinador, só mudar as duas linhas acima ☝️

const CATEGORIAS = ["Single masculino","Dupla masculina","Dupla feminina","Dupla mista","Quarteto"];

const GROUP_COLORS = [
  { glow:"#3b82f6", badge:"#3b82f6" },
  { glow:"#10b981", badge:"#10b981" },
  { glow:"#f43f5e", badge:"#f43f5e" },
  { glow:"#f59e0b", badge:"#f59e0b" },
];

function calcGroups(n) {
  const map = {4:[[4]],5:[[5]],6:[[3,3]],7:[[4,3]],8:[[4,4]],9:[[3,3,3]],10:[[4,3,3]],11:[[4,4,3]],12:[[4,4,4]]};
  return (map[n] || [[n]])[0];
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length-1; i > 0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}

const css = `
* { box-sizing:border-box; margin:0; padding:0; }
body { background:#0a0f1e; }
@keyframes suspense {
  0%   { opacity:0; transform:scale(0.4) translateY(30px); filter:blur(12px); }
  40%  { opacity:1; transform:scale(1.08) translateY(0); filter:blur(0); }
  70%  { transform:scale(1.0); }
  100% { transform:scale(1.05); }
}
@keyframes fly-out {
  0%   { opacity:1; transform:scale(1.05); }
  100% { opacity:0; transform:scale(0.5) translateY(-40px); }
}
@keyframes land {
  0%   { opacity:0; transform:scale(0.5) translateY(-20px); }
  60%  { transform:scale(1.12) translateY(0); }
  100% { opacity:1; transform:scale(1); }
}
@keyframes sponsor-in {
  0%   { opacity:0; transform:scale(0.7) translateY(20px); filter:blur(8px); }
  100% { opacity:1; transform:scale(1) translateY(0); filter:blur(0); }
}
@keyframes sponsor-out {
  0%   { opacity:1; transform:scale(1); }
  100% { opacity:0; transform:scale(1.1); filter:blur(6px); }
}
@keyframes stripe-slide {
  0%   { transform:translateX(-100%); }
  100% { transform:translateX(400%); }
}
@keyframes pulse-glow {
  0%,100% { box-shadow:0 0 20px #ffffff44; }
  50%      { box-shadow:0 0 50px #ffffffaa, 0 0 80px #ffffff44; }
}
.anim-suspense   { animation:suspense   0.7s cubic-bezier(.34,1.56,.64,1) forwards; }
.anim-fly-out    { animation:fly-out    0.4s ease-in forwards; }
.anim-land       { animation:land       0.5s cubic-bezier(.34,1.56,.64,1) forwards; }
.anim-sponsor-in { animation:sponsor-in  0.6s cubic-bezier(.34,1.56,.64,1) forwards; }
.anim-sponsor-out{ animation:sponsor-out 0.4s ease-in forwards; }
.anim-pulse-glow { animation:pulse-glow 1.2s ease-in-out infinite; }
.stripe {
  position:absolute; top:0; left:0; width:30%; height:100%;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent);
  animation:stripe-slide 1.6s ease-in-out infinite;
}
`;

const s = {
  page:        { background:"#0a0f1e", minHeight:"100vh", fontFamily:"'Inter',sans-serif", color:"white" },
  center:      { display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"100vh", padding:"0 24px", gap:24 },
  card:        { background:"#111827", borderRadius:16, padding:16, display:"flex", flexDirection:"column" },
  btnGreen:    { width:"100%", padding:"14px 0", borderRadius:16, background:"#10b981", color:"black", fontWeight:900, fontSize:18, border:"none", cursor:"pointer", fontFamily:"inherit" },
  btnWhite:    { flex:1, padding:"14px 0", borderRadius:16, background:"white", color:"black", fontWeight:900, fontSize:18, border:"none", cursor:"pointer", fontFamily:"inherit" },
  btnGray:     { padding:"12px 20px", borderRadius:12, background:"transparent", color:"#94a3b8", fontWeight:600, fontSize:14, border:"2px solid #475569", cursor:"pointer", fontFamily:"inherit" },
  btnDisabled: { flex:1, padding:"14px 0", borderRadius:16, background:"#1e293b", color:"#475569", fontWeight:900, fontSize:18, border:"none", cursor:"not-allowed", fontFamily:"inherit" },
  tag: (color) => ({ padding:"4px 12px", borderRadius:999, fontWeight:700, fontSize:13, color:"white", background:color }),
};

// ── Sponsor badge (header) ───────────────────────────────────────
function SponsorBadge() {
  return (
    <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"6px 14px"}}>
      <span style={{color:"#94a3b8",fontSize:10,letterSpacing:2,textTransform:"uppercase"}}>patrocinado por</span>
      <img src={SPONSOR_LOGO_URL} alt={PATROCINADOR} style={{height:20,objectFit:"contain",filter:"brightness(0) invert(1)"}} />
    </div>
  );
}

// ── Sponsor flash (antes de cada revelação) ──────────────────────
function SponsorReveal({ animState }) {
  return (
    <div className={animState==="in"?"anim-sponsor-in":"anim-sponsor-out"}
      style={{position:"relative",overflow:"hidden",width:340,padding:"32px 40px",borderRadius:20,textAlign:"center",background:"#000",border:"2px solid rgba(255,255,255,0.15)"}}>
      <div className="stripe"/>
      <div className="anim-pulse-glow" style={{display:"inline-flex",alignItems:"center",justifyContent:"center",padding:"12px 20px",borderRadius:12,background:"#111",marginBottom:16}}>
        <img src={SPONSOR_LOGO_URL} alt={PATROCINADOR} style={{height:32,objectFit:"contain",filter:"brightness(0) invert(1)"}}/>
      </div>
      <p style={{color:"rgba(255,255,255,0.45)",fontSize:10,letterSpacing:4,textTransform:"uppercase",marginBottom:6}}>sorteio apresentado por</p>
      <p style={{fontSize:26,fontWeight:900,letterSpacing:3,textTransform:"uppercase",color:"white"}}>{PATROCINADOR}</p>
    </div>
  );
}

// ── STEP 1: Categoria + nº de times ─────────────────────────────
function StepCategoria({ onNext }) {
  const [cat, setCat] = useState(0);
  const [num, setNum] = useState(null);
  const sizes = num ? calcGroups(num) : [];
  const tagColors = ["#3b82f6","#10b981","#f43f5e","#f59e0b"];

  return (
    <div style={s.center}>
      <div style={{textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
        <div style={{fontSize:48}}>🏆</div>
        <h1 style={{fontSize:34,fontWeight:900,letterSpacing:-1}}>Sorteio de Grupos</h1>
        <p style={{color:"#94a3b8",fontSize:16}}>Copa Imperial 60+</p>
        <SponsorBadge/>
      </div>

      <div style={{width:"100%",maxWidth:380,display:"flex",flexDirection:"column",gap:20}}>
        <div>
          <label style={{color:"#94a3b8",fontSize:11,letterSpacing:3,textTransform:"uppercase",display:"block",marginBottom:8}}>Categoria</label>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {CATEGORIAS.map((c,i) => (
              <button key={i} onClick={()=>setCat(i)}
                style={{padding:"12px 20px",borderRadius:12,textAlign:"left",fontWeight:600,fontSize:15,border:`2px solid ${cat===i?"#34d399":"#334155"}`,background:cat===i?"rgba(16,185,129,0.15)":"rgba(30,41,59,0.5)",color:cat===i?"white":"#cbd5e1",cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s"}}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{color:"#94a3b8",fontSize:11,letterSpacing:3,textTransform:"uppercase",display:"block",marginBottom:8}}>Número de times</label>
          <div style={{display:"grid",gridTemplateColumns:"repeat(9,1fr)",gap:4}}>
            {[4,5,6,7,8,9,10,11,12].map(n => (
              <button key={n} onClick={()=>setNum(n)}
                style={{padding:"8px 0",borderRadius:8,fontWeight:700,fontSize:13,border:`2px solid ${num===n?"#34d399":"#334155"}`,background:num===n?"rgba(16,185,129,0.15)":"rgba(30,41,59,0.5)",color:num===n?"white":"#cbd5e1",cursor:"pointer",fontFamily:"inherit"}}>
                {n}
              </button>
            ))}
          </div>
        </div>

        {num && (
          <div style={{background:"rgba(30,41,59,0.6)",borderRadius:12,padding:16,border:"1px solid #334155"}}>
            <p style={{color:"#94a3b8",fontSize:11,letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>Grupos calculados</p>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {sizes.map((sz,i) => (
                <span key={i} style={s.tag(tagColors[i%4])}>Grupo {String.fromCharCode(65+i)}: {sz} times</span>
              ))}
            </div>
          </div>
        )}

        <button disabled={!num} onClick={()=>onNext(cat,num)}
          style={{...s.btnGreen,opacity:num?1:0.4,cursor:num?"pointer":"not-allowed",marginTop:8}}>
          Próximo →
        </button>
      </div>
    </div>
  );
}

// ── STEP 2: Nomes dos times ──────────────────────────────────────
function StepTimes({ catNome, numTimes, onNext, onBack }) {
  const [times, setTimes] = useState(Array(numTimes).fill(""));
  const refs = useRef([]);
  const update = (i,v) => setTimes(t=>{ const n=[...t]; n[i]=v; return n; });
  const allFilled = times.every(t=>t.trim()!=="");

  return (
    <div style={{...s.page,display:"flex",flexDirection:"column",padding:"24px"}}>
      <div style={{marginBottom:24}}>
        <button onClick={onBack} style={{...s.btnGray,marginBottom:16}}>← Voltar</button>
        <p style={{color:"#94a3b8",fontSize:11,letterSpacing:3,textTransform:"uppercase"}}>Copa Imperial 60+</p>
        <h2 style={{fontSize:28,fontWeight:900,marginTop:4}}>{catNome}</h2>
        <p style={{color:"#94a3b8",marginTop:4}}>{numTimes} times · {calcGroups(numTimes).length} grupo{calcGroups(numTimes).length>1?"s":""}</p>
      </div>
      <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:10,maxWidth:400,width:"100%",margin:"0 auto"}}>
        {times.map((t,i) => (
          <div key={i} style={{display:"flex",alignItems:"center",gap:12}}>
            <span style={{width:28,height:28,borderRadius:"50%",background:"#1e293b",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#94a3b8",flexShrink:0}}>{i+1}</span>
            <input ref={el=>refs.current[i]=el} value={t}
              onChange={e=>update(i,e.target.value)}
              onKeyDown={e=>{ if(e.key==="Enter"&&refs.current[i+1]) refs.current[i+1].focus(); }}
              placeholder={`Nome do time ${i+1}`}
              style={{background:"#1e293b",border:"2px solid #334155",borderRadius:12,padding:"12px 16px",color:"white",fontWeight:600,fontSize:15,outline:"none",flex:1,fontFamily:"inherit"}}/>
          </div>
        ))}
      </div>
      <div style={{paddingTop:20,maxWidth:400,width:"100%",margin:"0 auto"}}>
        <button disabled={!allFilled} onClick={()=>onNext(times.map(t=>t.trim()))}
          style={{...s.btnGreen,opacity:allFilled?1:0.4,cursor:allFilled?"pointer":"not-allowed"}}>
          Iniciar Sorteio 🎲
        </button>
      </div>
    </div>
  );
}

// ── STEP 3: Sorteio animado ──────────────────────────────────────
function StepSorteio({ catNome, times, onBack }) {
  const sizes = calcGroups(times.length);
  const initGroups = () => sizes.map((sz,i) => ({
    name: String.fromCharCode(65+i),
    color: GROUP_COLORS[i%4].glow,
    badge: GROUP_COLORS[i%4].badge,
    slots: Array(sz).fill(null),
  }));

  const [groups, setGroups]           = useState(initGroups);
  const [queue, setQueue]             = useState(()=>shuffle(times));
  const [spotlight, setSpotlight]     = useState(null);
  const [sponsorAnim, setSponsorAnim] = useState(null);
  const [highlightGroup, setHighlight]= useState(null);
  const [drawing, setDrawing]         = useState(false);
  const [landingSlot, setLanding]     = useState(null);
  const tRefs = useRef([]);
  const after = (ms,fn) => { const id=setTimeout(fn,ms); tRefs.current.push(id); };

  function nextTeam() {
    if (drawing||queue.length===0) return;
    setDrawing(true);
    const team = queue[0];
    let tG=-1, tS=-1;
    outer: for (let g=0;g<groups.length;g++)
      for (let s=0;s<groups[g].slots.length;s++)
        if (groups[g].slots[s]===null){tG=g;tS=s;break outer;}

    // 1. Sponsor flash
    setSponsorAnim("in");
    after(1400, ()=>{
      setSponsorAnim("out");
      after(400, ()=>{
        setSponsorAnim(null);
        // 2. Team reveal
        setSpotlight({ name:team, targetGroup:tG, animState:"in" });
        after(1800, ()=>{
          setSpotlight(sp=>sp?{...sp,animState:"out"}:sp);
          setHighlight(tG);
          after(450, ()=>{
            setSpotlight(null); setHighlight(null);
            setLanding({g:tG,s:tS});
            setGroups(prev=>{ const ng=prev.map(g=>({...g,slots:[...g.slots]})); ng[tG].slots[tS]=team; return ng; });
            setQueue(q=>q.slice(1));
            after(600,()=>{ setLanding(null); setDrawing(false); });
          });
        });
      });
    });
  }

  const remaining = queue.length;
  const allDone = remaining===0 && !drawing;

  return (
    <div style={{...s.page,display:"flex",flexDirection:"column",alignItems:"center"}}>
      <div style={{width:"100%",maxWidth:900,display:"flex",flexDirection:"column",flex:1}}>

        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"18px 24px 8px",flexWrap:"wrap",gap:8}}>
          <div>
            <p style={{color:"#94a3b8",fontSize:10,letterSpacing:3,textTransform:"uppercase"}}>Copa Imperial 60+</p>
            <h2 style={{fontSize:22,fontWeight:900}}>{catNome}</h2>
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
            <SponsorBadge/>
            {remaining>0 && <p style={{color:"#94a3b8",fontSize:12}}>{remaining} restante{remaining!==1?"s":""}</p>}
            {allDone && <p style={{color:"#34d399",fontWeight:700,fontSize:12}}>✓ Concluído!</p>}
          </div>
        </div>

        {/* Spotlight */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:200,padding:"16px 0",position:"relative",zIndex:10}}>
          {sponsorAnim && <SponsorReveal animState={sponsorAnim}/>}

          {!sponsorAnim && spotlight && (
            <div className={spotlight.animState==="in"?"anim-suspense":"anim-fly-out"}
              style={{padding:"20px 40px",borderRadius:16,textAlign:"center",background:`linear-gradient(135deg,${groups[spotlight.targetGroup]?.color}33,${groups[spotlight.targetGroup]?.color}11)`,border:`2px solid ${groups[spotlight.targetGroup]?.color}`,boxShadow:`0 0 40px ${groups[spotlight.targetGroup]?.color}88`}}>
              <p style={{color:"rgba(255,255,255,0.35)",fontSize:9,letterSpacing:3,textTransform:"uppercase",marginBottom:2}}>apresentado por {PATROCINADOR}</p>
              <p style={{color:"#94a3b8",fontSize:10,letterSpacing:3,textTransform:"uppercase",marginBottom:6}}>próximo time</p>
              <p style={{fontSize:30,fontWeight:900}}>{spotlight.name}</p>
              <p style={{fontSize:13,marginTop:6,fontWeight:600,color:groups[spotlight.targetGroup]?.color}}>→ Grupo {groups[spotlight.targetGroup]?.name}</p>
            </div>
          )}

          {!sponsorAnim && !spotlight && allDone && (
            <div style={{textAlign:"center"}}>
              <p style={{fontSize:44,marginBottom:8}}>🎉</p>
              <p style={{fontSize:22,fontWeight:900,color:"#34d399"}}>Grupos formados!</p>
              <p style={{color:"#475569",fontSize:12,marginTop:6}}>Copa Imperial 60+ × {PATROCINADOR}</p>
            </div>
          )}

          {!sponsorAnim && !spotlight && !allDone && !drawing && (
            <p style={{color:"#334155",fontSize:12,letterSpacing:3,textTransform:"uppercase"}}>Pronto para sortear</p>
          )}
        </div>

        {/* Groups */}
        <div style={{flex:1,padding:"0 14px 14px"}}>
          <div style={{display:"grid",gridTemplateColumns:`repeat(${groups.length},1fr)`,gap:10,height:"100%"}}>
            {groups.map((g,gi) => (
              <div key={gi} style={{...s.card,border:`2px solid ${highlightGroup===gi?g.color:"#1e293b"}`,background:highlightGroup===gi?`${g.color}18`:"#111827",boxShadow:highlightGroup===gi?`0 0 30px ${g.color}55`:"none",transform:highlightGroup===gi?"scale(1.03)":"scale(1)",transition:"all 0.3s"}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                  <span style={{width:30,height:30,borderRadius:"50%",background:g.badge,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:12,flexShrink:0}}>{g.name}</span>
                  <span style={{fontWeight:700,color:"#cbd5e1",fontSize:12}}>Grupo {g.name}</span>
                  <span style={{marginLeft:"auto",fontSize:10,color:"#475569"}}>{g.slots.filter(Boolean).length}/{g.slots.length}</span>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:6,flex:1}}>
                  {g.slots.map((slot,si) => (
                    <div key={si}
                      className={slot&&landingSlot?.g===gi&&landingSlot?.s===si?"anim-land":""}
                      style={{borderRadius:10,padding:"8px 10px",fontSize:12,fontWeight:600,background:slot?g.color:"transparent",border:slot?"none":"2px dashed #1e293b",color:slot?"white":"#334155",transition:"background 0.3s"}}>
                      {slot||"—"}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{padding:"0 14px 24px",display:"flex",gap:10}}>
          <button onClick={onBack} style={s.btnGray}>← Voltar</button>
          {!allDone ? (
            <button onClick={nextTeam} disabled={drawing||remaining===0}
              style={drawing||remaining===0?s.btnDisabled:s.btnWhite}>
              {drawing?"Sorteando...":"Sortear próximo →"}
            </button>
          ) : (
            <button onClick={()=>alert("Sorteio confirmado!")}
              style={{...s.btnGreen,flex:1,cursor:"pointer"}}>
              ✓ Confirmar Sorteio
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

// ── ROOT ─────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep]         = useState("categoria");
  const [catIdx, setCatIdx]     = useState(0);
  const [numTimes, setNumTimes] = useState(null);
  const [times, setTimes]       = useState([]);

  return (
    <>
      <style>{css}</style>
      <div style={s.page}>
        {step==="categoria" && <StepCategoria onNext={(ci,n)=>{ setCatIdx(ci); setNumTimes(n); setStep("times"); }}/>}
        {step==="times"     && <StepTimes catNome={CATEGORIAS[catIdx]} numTimes={numTimes} onNext={ts=>{ setTimes(ts); setStep("sorteio"); }} onBack={()=>setStep("categoria")}/>}
        {step==="sorteio"   && <StepSorteio catNome={CATEGORIAS[catIdx]} times={times} onBack={()=>setStep("times")}/>}
      </div>
    </>
  );
}
