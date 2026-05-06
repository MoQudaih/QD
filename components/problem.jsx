const { useState, useEffect, useRef } = React;
const { Eyebrow, useInView, useMouseTilt, useScrollProgress } = window.__QD;

const StrikeWord = ({ children, delay=0 }) => {
  const ref = useRef(null);
  const seen = useInView(ref);
  return (
    <span ref={ref} style={{ position:'relative',display:'inline-block',color:'var(--fg3)' }}>
      {children}
      <span style={{ position:'absolute',left:0,top:'54%',height:6,background:'var(--acid)',width:seen?'100%':'0%',transition:`width 700ms cubic-bezier(0.65,0,0.35,1) ${delay}ms`,boxShadow:'0 0 12px rgba(166,240,79,0.5)',display:'block' }} />
    </span>
  );
};

const ConnectorArrow = ({ start }) => (
  <svg width="64" height="24" viewBox="0 0 64 24" style={{ overflow:'visible' }}>
    <defs>
      <linearGradient id="qd-arrow-grad" x1="0" x2="1">
        <stop offset="0%" stopColor="var(--fg3)" />
        <stop offset="100%" stopColor="var(--acid)" />
      </linearGradient>
    </defs>
    <line x1="0" y1="12" x2="54" y2="12" stroke="url(#qd-arrow-grad)" strokeWidth="2"
      strokeDasharray="60" strokeDashoffset={start?0:60}
      style={{ transition:'stroke-dashoffset 900ms cubic-bezier(0.65,0,0.35,1) 200ms' }} />
    <polyline points="48,6 56,12 48,18" fill="none" stroke="var(--acid)" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      style={{ opacity:start?1:0,transform:start?'translateX(0)':'translateX(-12px)',transition:'opacity 400ms ease 900ms,transform 600ms cubic-bezier(0.34,1.56,0.64,1) 900ms',filter:'drop-shadow(0 0 6px var(--acid))' }} />
    <circle cx="0" cy="12" r="3" fill="var(--acid)"
      style={{ opacity:start?0.9:0,transition:'opacity 200ms ease 1100ms',animation:start?'qd-dot-glide 1.6s ease-in-out 1200ms infinite':'none',filter:'drop-shadow(0 0 6px var(--acid))' }} />
  </svg>
);

const PainRow = ({ p, index }) => {
  const ref = useRef(null);
  const seen = useInView(ref, 0.3);
  const mouse = useMouseTilt(ref);
  const [hover, setHover] = useState(false);
  const tiltX = hover ? -mouse.y*4 : 0;
  const tiltY = hover ?  mouse.x*6 : 0;
  return (
    <div ref={ref} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display:'grid',gridTemplateColumns:'80px 1fr 80px 1fr',gap:32,padding:'44px 32px',alignItems:'center',position:'relative',
        opacity:seen?1:0,
        transform:seen?`perspective(1400px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`:'perspective(1400px) rotateX(20deg) translateY(60px) translateZ(-120px)',
        transformStyle:'preserve-3d',
        transition:`opacity 900ms cubic-bezier(0.22,1,0.36,1) ${index*140}ms,transform ${hover?180:900}ms cubic-bezier(0.22,1,0.36,1) ${hover?0:index*140}ms`,
        background:hover?'linear-gradient(90deg,rgba(166,240,79,0.06),transparent 70%)':'transparent',
        borderTop:index===0?'1px solid var(--border-1)':'none',borderBottom:'1px solid var(--border-1)',
        boxShadow:hover?'0 24px 48px rgba(0,0,0,0.4),inset 0 0 0 1px rgba(166,240,79,0.2)':'none' }}>
      <div style={{ position:'absolute',left:0,top:0,bottom:0,width:3,background:'var(--acid)',boxShadow:'0 0 16px var(--acid)',transform:hover?'scaleY(1)':'scaleY(0)',transformOrigin:'top',transition:'transform 400ms cubic-bezier(0.65,0,0.35,1)' }} />
      <div style={{ fontFamily:'var(--font-display)',fontSize:72,fontWeight:700,lineHeight:1,color:'transparent',WebkitTextStroke:hover?'1.5px var(--acid)':'1px var(--fg3)',letterSpacing:'-0.04em',transform:hover?'translateZ(60px) scale(1.12)':'translateZ(20px) scale(1)',transition:'transform 500ms cubic-bezier(0.34,1.56,0.64,1),-webkit-text-stroke 300ms ease',textShadow:hover?'0 0 32px rgba(166,240,79,0.5)':'none' }}>{p.n}</div>
      <div style={{ fontFamily:'var(--font-display)',fontSize:24,lineHeight:1.3,fontWeight:500,color:hover?'var(--fg1)':'var(--fg2)',letterSpacing:'-0.01em',transform:hover?'translateZ(40px)':'translateZ(10px)',transition:'color 280ms ease,transform 500ms cubic-bezier(0.34,1.56,0.64,1)' }}>{p.pain}</div>
      <div style={{ display:'grid',placeItems:'center',transform:hover?'translateZ(50px) scale(1.2)':'translateZ(20px) scale(1)',transition:'transform 500ms cubic-bezier(0.34,1.56,0.64,1)' }}><ConnectorArrow start={seen} /></div>
      <div style={{ fontFamily:'var(--font-display)',fontSize:24,lineHeight:1.3,fontWeight:500,color:'var(--fg1)',letterSpacing:'-0.01em',opacity:seen?1:0,transform:seen?(hover?'translateZ(40px) translateX(0)':'translateZ(10px)'):'translateZ(0) translateX(20px)',transition:`opacity 600ms ease ${index*140+900}ms,transform 500ms cubic-bezier(0.34,1.56,0.64,1)` }}>{p.fix}</div>
    </div>
  );
};

const Problem = () => {
  const pains = [
    { n:'01', pain:'Hours lost copy-pasting between tools.',    fix:'One automation. 60-second sync.' },
    { n:'02', pain:'A 6-month dev quote for a 2-week problem.', fix:'Same scope. 14 days. Fixed price.' },
    { n:'03', pain:'SaaS that almost fits — at AED per seat.',  fix:'Custom. Owned. No seat tax.' },
  ];
  const sectionRef = useRef(null);
  const sp = useScrollProgress(sectionRef);
  const headRef = useRef(null);
  const headSeen = useInView(headRef, 0.3);
  const reframeRef = useRef(null);
  const reframeSeen = useInView(reframeRef, 0.4);
  const reframeBox = useRef(null);
  const pillMouse = useMouseTilt(reframeBox);

  return (
    <section ref={sectionRef} className="qd-section" data-bridge="obsidian-2"
      style={{ position:'relative',background:'var(--obsidian)',padding:'160px 40px 180px',borderTop:'1px solid var(--border-1)',zIndex:5,overflow:'hidden',perspective:2000 }}>
      <div style={{ position:'absolute',inset:0,backgroundImage:'linear-gradient(var(--border-1) 1px,transparent 1px),linear-gradient(90deg,var(--border-1) 1px,transparent 1px)',backgroundSize:'64px 64px',opacity:0.4,pointerEvents:'none',transform:`translateY(${sp*30}px)`,transition:'transform 80ms linear' }} />
      <div style={{ position:'absolute',top:-200,left:'7%',width:'clamp(120px,14vw,220px)',height:'140%',transform:`rotate(-12deg) translateY(${sp*-60}px)`,background:'linear-gradient(180deg,rgba(166,240,79,0.18) 0%,rgba(166,240,79,0.08) 30%,rgba(166,240,79,0) 80%)',filter:'blur(2px)',pointerEvents:'none' }} />
      <div style={{ position:'absolute',top:-200,left:'7%',width:4,height:'140%',transform:`rotate(-12deg) translateY(${sp*-80}px)`,background:'linear-gradient(180deg,rgba(166,240,79,0.5) 0%,rgba(166,240,79,0.2) 40%,rgba(166,240,79,0) 75%)',boxShadow:'0 0 24px rgba(166,240,79,0.3)',pointerEvents:'none' }} />
      <div style={{ position:'absolute',top:'30%',right:'12%',width:8,height:8,borderRadius:'50%',background:'var(--acid)',opacity:0.7,boxShadow:'0 0 24px var(--acid)',transform:`translateY(${sp*80}px)`,animation:'qd-orbit 8s ease-in-out infinite' }} />
      <div style={{ position:'absolute',bottom:'18%',right:'6%',width:5,height:5,borderRadius:'50%',background:'#ff6b6b',opacity:0.5,boxShadow:'0 0 18px #ff6b6b',transform:`translateY(${sp*120}px)`,animation:'qd-orbit-2 11s ease-in-out infinite' }} />

      <div style={{ maxWidth:1280,margin:'0 auto',position:'relative',transformStyle:'preserve-3d' }}>
        <div ref={headRef} style={{ marginBottom:80,maxWidth:920,perspective:1200 }}>
          <div style={{ opacity:headSeen?1:0,transform:headSeen?'translateY(0)':'translateY(20px)',transition:'opacity 600ms ease,transform 600ms cubic-bezier(0.22,1,0.36,1)' }}>
            <Eyebrow color="var(--acid)">// 02 · SOUND FAMILIAR?</Eyebrow>
          </div>
          <h2 style={{ marginTop:16,fontFamily:'var(--font-display)',fontSize:'clamp(40px,5.5vw,76px)',lineHeight:1,letterSpacing:'-0.03em',fontWeight:600,color:'var(--bone)' }}>
            <span style={{ display:'inline-block',opacity:headSeen?1:0,transform:headSeen?'perspective(800px) rotateX(0deg)':'perspective(800px) rotateX(-50deg) translateY(40px)',transformOrigin:'bottom',transition:'opacity 800ms ease 100ms,transform 900ms cubic-bezier(0.22,1,0.36,1) 100ms' }}>You don't need </span>
            <span style={{ display:'inline-block',opacity:headSeen?1:0,transform:headSeen?'perspective(800px) rotateX(0deg)':'perspective(800px) rotateX(-50deg) translateY(40px)',transformOrigin:'bottom',transition:'opacity 800ms ease 280ms,transform 900ms cubic-bezier(0.22,1,0.36,1) 280ms' }}><StrikeWord delay={1100}>more software.</StrikeWord></span>
            <br />
            <span style={{ display:'inline-block',marginTop:8,opacity:headSeen?1:0,transform:headSeen?'perspective(800px) rotateX(0deg)':'perspective(800px) rotateX(-50deg) translateY(40px)',transformOrigin:'bottom',transition:'opacity 800ms ease 1500ms,transform 900ms cubic-bezier(0.22,1,0.36,1) 1500ms' }}>
              You need <span style={{ color:'var(--acid)',display:'inline-block',animation:headSeen?'qd-glow-pulse 2.4s ease-in-out 2200ms infinite':'none' }}>less friction.</span>
            </span>
          </h2>
        </div>

        <div style={{ borderTop:'1px solid var(--border-1)',perspective:1600,transformStyle:'preserve-3d' }}>
          {pains.map((p,i) => <PainRow key={p.n} p={p} index={i} />)}
        </div>

        <div ref={reframeRef} style={{ marginTop:96,textAlign:'center',opacity:reframeSeen?1:0,transform:reframeSeen?'translateY(0)':'translateY(30px)',transition:'opacity 800ms ease,transform 800ms cubic-bezier(0.22,1,0.36,1)' }}>
          <div ref={reframeBox} style={{ fontFamily:'var(--font-display)',fontSize:'clamp(24px,2.6vw,36px)',lineHeight:1.3,fontWeight:500,letterSpacing:'-0.02em',maxWidth:880,margin:'0 auto',display:'inline-block',padding:'12px 8px',transformStyle:'preserve-3d',transform:`perspective(1000px) rotateX(${pillMouse.y*-3}deg) rotateY(${pillMouse.x*4}deg)`,transition:'transform 200ms ease-out',color:'var(--bone)' }}>
            We close that gap in{' '}
            <span style={{ color:'var(--obsidian)',background:'var(--acid)',padding:'2px 14px',display:'inline-block',borderRadius:4,transform:reframeSeen?`translate(${pillMouse.x*8}px,${pillMouse.y*6}px) scale(1) rotate(${pillMouse.x*2}deg)`:'translate(0,0) scale(0)',transition:reframeSeen?'transform 200ms ease-out':'transform 700ms cubic-bezier(0.34,1.56,0.64,1) 700ms',boxShadow:'0 8px 24px rgba(166,240,79,0.3)' }}>14 days.</span>
          </div>
        </div>
      </div>
    </section>
  );
};
window.__QD = { ...window.__QD, Problem };
