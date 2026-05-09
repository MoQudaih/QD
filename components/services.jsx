const { useState, useEffect } = React;
const { Reveal, Eyebrow, Tag, ChatbotWindow, DashboardMini, BrowserMini, CodeBlock } = window.__QD;

const SectionLetter = ({ letter }) => {
  const [t, setT] = useState(0);
  useEffect(() => {
    let raf; const start = performance.now();
    const loop = now => { setT((now-start)/1000); raf=requestAnimationFrame(loop); };
    raf=requestAnimationFrame(loop); return () => cancelAnimationFrame(raf);
  },[]);
  const ry = Math.sin(t*0.35)*8, rx = Math.cos(t*0.28)*3;
  return (
    <Reveal lift={48} duration={1000}>
      <div style={{ fontFamily:'var(--font-display)',fontWeight:700,fontSize:'clamp(160px,22vw,320px)',letterSpacing:'-0.06em',lineHeight:0.85,color:'var(--acid)',textShadow:'8px 8px 0 var(--obsidian-2),12px 12px 0 var(--obsidian)',transform:`rotateY(${ry}deg) rotateX(${rx}deg)`,transformStyle:'preserve-3d',perspective:1200,willChange:'transform',userSelect:'none' }}>{letter}</div>
    </Reveal>
  );
};
window.__QD.SectionLetter = SectionLetter;

const Services = () => (
  <section id="services" className="qd-section" data-bridge="obsidian-2"
    style={{ position:'relative',background:'var(--obsidian)',padding:'160px 40px 200px',borderTop:'1px solid var(--border-1)',zIndex:5,overflow:'hidden' }}>
    <div style={{ position:'absolute',inset:0,opacity:0.4,pointerEvents:'none',backgroundImage:'linear-gradient(rgba(244,241,234,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(244,241,234,0.03) 1px,transparent 1px)',backgroundSize:'64px 64px' }} />
    <div style={{ maxWidth:1280,margin:'0 auto',position:'relative' }}>
      <div className="qd-services-head qd-mobile-stack" style={{ display:'grid',gridTemplateColumns:'1.2fr 1fr',gap:60,alignItems:'flex-end',marginBottom:64 }}>
        <Reveal lift={32}>
          <Eyebrow color="var(--acid)">// 03 · WHAT WE BUILD</Eyebrow>
          <h2 style={{ fontFamily:'var(--font-display)',fontWeight:600,fontSize:'clamp(56px,8vw,120px)',letterSpacing:'-0.04em',lineHeight:0.92,margin:'12px 0 24px',color:'var(--bone)' }}>
            Four things.<br/><em style={{ fontFamily:'var(--font-serif)',fontWeight:400,color:'var(--acid)' }}>Done right.</em>
          </h2>
          <p style={{ fontFamily:'var(--font-body)',fontSize:18,color:'var(--fg2)',maxWidth:520,lineHeight:1.5 }}>We don't do everything. We do these. If you need something else, ask — chances are it's a custom system.</p>
        </Reveal>
        <div style={{ textAlign:'right' }}><div className="qd-section-letter qd-mobile-no-rotate"><SectionLetter letter="Q" /></div></div>
      </div>

      <div className="qd-services-main qd-mobile-stack" style={{ display:'grid',gridTemplateColumns:'1.3fr 1fr',gap:16,marginBottom:16 }}>
        <Reveal lift={40} duration={900}>
          <div className="qd-lift qd-services-card" style={{ background:'var(--obsidian-3)',border:'1px solid var(--border-1)',borderRadius:16,padding:32,minHeight:480,display:'flex',flexDirection:'column',gap:20,boxShadow:'0 4px 24px rgba(0,0,0,0.4),inset 0 1px 0 rgba(244,241,234,0.06)' }}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start' }}>
              <span className="qd-eyebrow" style={{ color:'var(--acid)' }}>// 01 · FLAGSHIP</span>
              <span style={{ color:'var(--acid)',fontSize:20 }}>◈</span>
            </div>
            <div style={{ fontFamily:'var(--font-display)',fontWeight:700,fontSize:'clamp(48px,6vw,88px)',letterSpacing:'-0.04em',lineHeight:0.9,marginTop:12,color:'var(--bone)' }}>Chatbots<br/><span style={{ color:'var(--acid)' }}>that close.</span></div>
            <div style={{ fontFamily:'var(--font-body)',fontSize:16,color:'var(--fg2)',maxWidth:420,lineHeight:1.5 }}>Trained on your business. On-brand voice. Closes leads at 2am while your competitors sleep.</div>
            <ChatbotWindow />
            <div style={{ display:'flex',gap:6,flexWrap:'wrap',marginTop:'auto' }}>
              {['GPT-4','Claude','Custom RAG','Stripe','WhatsApp'].map(t=><Tag key={t}>{t}</Tag>)}
            </div>
          </div>
        </Reveal>
        <div style={{ display:'flex',flexDirection:'column',gap:16 }}>
          {[
            { n:'02', h:'Websites', sub:'that convert.', d:'Fast. On-brand. Built to your KPIs.', visual:<BrowserMini /> },
            { n:'03', h:'Tracking', sub:'that holds.',   d:'One dashboard. Real-time. No spreadsheets.', visual:<DashboardMini /> },
          ].map((s,i) => (
            <Reveal key={i} delay={(i+1)*120} lift={40} duration={900}>
              <div className="qd-lift qd-services-subcard qd-mobile-stack" style={{ background:'var(--obsidian-3)',border:'1px solid var(--border-1)',borderRadius:16,padding:24,display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,alignItems:'center',minHeight:232 }}>
                <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
                  <span className="qd-eyebrow" style={{ color:'var(--acid)' }}>// {s.n}</span>
                  <div style={{ fontFamily:'var(--font-display)',fontWeight:600,fontSize:32,letterSpacing:'-0.02em',lineHeight:0.95,color:'var(--bone)' }}>{s.h}<br/><span style={{ color:'var(--acid)' }}>{s.sub}</span></div>
                  <div style={{ fontFamily:'var(--font-body)',fontSize:13,color:'var(--fg2)',lineHeight:1.5 }}>{s.d}</div>
                </div>
                {s.visual}
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <Reveal delay={120} lift={40} duration={900}>
        <div className="qd-lift qd-services-custom qd-mobile-stack" style={{ background:'var(--obsidian-3)',border:'1px solid var(--border-1)',borderRadius:16,padding:32,display:'grid',gridTemplateColumns:'1fr 1fr',gap:32,alignItems:'center',minHeight:240 }}>
          <div style={{ display:'flex',flexDirection:'column',gap:14 }}>
            <span className="qd-eyebrow" style={{ color:'var(--acid)' }}>// 04 · CUSTOM</span>
            <div style={{ fontFamily:'var(--font-display)',fontWeight:700,fontSize:'clamp(36px,5vw,56px)',letterSpacing:'-0.04em',lineHeight:0.95,color:'var(--bone)' }}>You describe it.<br/><span style={{ color:'var(--acid)' }}>We architect, ship, maintain.</span></div>
            <div style={{ fontFamily:'var(--font-body)',fontSize:15,color:'var(--fg2)',maxWidth:420,lineHeight:1.5 }}>Anything from internal tools to full SaaS platforms. Quote in 48 hours. Live in two weeks.</div>
            <div style={{ display:'flex',gap:6,flexWrap:'wrap',marginTop:8 }}>
              {['Postgres','Next.js','Realtime','Stripe','Auth','Mobile'].map(t=><Tag key={t}>{t}</Tag>)}
            </div>
          </div>
          <CodeBlock />
        </div>
      </Reveal>
    </div>
  </section>
);
window.__QD = { ...window.__QD, Services };
