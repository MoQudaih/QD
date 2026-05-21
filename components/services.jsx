const { useState, useEffect } = React;
const { Reveal, Eyebrow, Tag, ChatbotWindow, DashboardMini, BrowserMini, CodeBlock, useViewportFlag, usePrefersReducedMotion } = window.__QD;

const servicesCopy = {
  en: {
    eyebrow: '// 03 · WHAT WE BUILD',
    titleA: 'Everything your business needs online.',
    titleB: 'Built properly.',
    intro: 'Websites, branding, automations, bookings, dashboards, and growth tools built into one premium digital presence.',
    cards: [
      {
        id: '01',
        label: 'FLAGSHIP',
        title: 'Customer systems',
        accent: 'that respond instantly.',
        body: 'AI chat, WhatsApp flows, lead capture, and automated replies built around your business, not a generic bot.',
        tags: ['AI Chat', 'WhatsApp', 'Lead Capture', 'FAQs', 'Automation'],
        visual: <ChatbotWindow />
      },
      {
        id: '02',
        title: 'Websites',
        accent: 'that convert.',
        body: 'Premium, responsive, and built to make customers trust you faster.',
        tags: ['Responsive', 'High Trust', 'Conversion', 'Premium UI'],
        visual: <BrowserMini />
      },
      {
        id: '03',
        title: 'Operations',
        accent: 'you can monitor.',
        body: 'Orders, bookings, inventory, leads, and performance visible from one clean dashboard.',
        tags: ['Bookings', 'Inventory', 'Leads', 'Analytics'],
        visual: <DashboardMini />
      },
      {
        id: '04',
        label: 'CUSTOM',
        title: 'You describe it.',
        accent: 'We architect, ship, maintain.',
        body: 'From booking systems and portals to payments, dashboards, and custom workflows, we design, build, and support the full stack.',
        tags: ['Booking', 'Payments', 'CRM', 'Dashboards', 'Portals', 'Support'],
        visual: <CodeBlock />
      }
    ]
  },
  ar: {
    eyebrow: '// 03 · ماذا نبني',
    titleA: 'كل ما يحتاجه نشاطك',
    titleB: 'بُني بشكل صحيح.',
    intro: 'مواقع وهوية رقمية وأتمتة وحجوزات ولوحات متابعة وأدوات نمو، ضمن حضور رقمي واحد بمستوى فاخر.',
    cards: [
      {
        id: '01',
        label: 'أساسي',
        title: 'أنظمة العملاء',
        accent: 'التي ترد فوراً.',
        body: 'شات ذكي وتدفقات واتساب والتقاط عملاء محتملين وردود آلية مبنية حول نشاطك، لا حول قالب عام.',
        tags: ['ذكاء اصطناعي', 'واتساب', 'التقاط العملاء', 'الأسئلة الشائعة', 'أتمتة'],
        visual: <ChatbotWindow />
      },
      {
        id: '02',
        title: 'مواقع',
        accent: 'تُحوّل الزائر.',
        body: 'مواقع فاخرة ومتجاوبة، مبنية لتمنح العملاء ثقة أسرع في علامتك.',
        tags: ['متجاوب', 'ثقة عالية', 'تحويل', 'واجهة فاخرة'],
        visual: <BrowserMini />
      },
      {
        id: '03',
        title: 'تشغيل',
        accent: 'يمكنك متابعته.',
        body: 'طلبات وحجوزات ومخزون وعملاء محتملون وأداء، كلها ظاهرة في لوحة واحدة نظيفة.',
        tags: ['حجوزات', 'مخزون', 'عملاء', 'تحليلات'],
        visual: <DashboardMini />
      },
      {
        id: '04',
        label: 'مخصص',
        title: 'أنت تصف الفكرة.',
        accent: 'ونحن نصمم وننفذ وندير.',
        body: 'من أنظمة الحجز والبوابات إلى المدفوعات واللوحات وسير العمل المخصص، نحن نصمم ونبني وندعم المنظومة كاملة.',
        tags: ['حجز', 'مدفوعات', 'CRM', 'لوحات', 'بوابات', 'دعم'],
        visual: <CodeBlock />
      }
    ]
  }
};

const SectionLetter = ({ letter }) => {
  const [t, setT] = useState(0);
  const isMobile = useViewportFlag(768);
  const prefersReducedMotion = usePrefersReducedMotion();
  useEffect(() => {
    if (isMobile || prefersReducedMotion) return;
    let raf; const start = performance.now();
    const loop = now => { setT((now-start)/1000); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop); return () => cancelAnimationFrame(raf);
  }, [isMobile, prefersReducedMotion]);
  const ry = Math.sin(t * 0.35) * 8;
  const rx = Math.cos(t * 0.28) * 3;
  return (
    <Reveal lift={48} duration={1000}>
      <div style={{ fontFamily:'var(--font-display)',fontWeight:700,fontSize:'clamp(160px,22vw,320px)',letterSpacing:'-0.06em',lineHeight:0.85,color:'var(--acid)',textShadow:isMobile?'4px 4px 0 var(--obsidian-2)':'8px 8px 0 var(--obsidian-2),12px 12px 0 var(--obsidian)',transform:isMobile?'none':`rotateY(${ry}deg) rotateX(${rx}deg)`,transformStyle:'preserve-3d',perspective:1200,willChange:isMobile?'auto':'transform',userSelect:'none' }}>{letter}</div>
    </Reveal>
  );
};
window.__QD.SectionLetter = SectionLetter;

const Services = ({ language = 'en' }) => {
  const copy = servicesCopy[language] || servicesCopy.en;
  const isMobile = useViewportFlag(760);
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section id="services" className="qd-section" data-bridge="obsidian-2"
      style={{ position:'relative',background:'var(--obsidian)',padding:'160px 40px 200px',borderTop:'1px solid var(--border-1)',zIndex:5,overflow:'hidden' }}>
      <div style={{ position:'absolute',inset:0,pointerEvents:'none',background:'radial-gradient(circle at 14% 18%, rgba(166,240,79,0.15), transparent 24%), radial-gradient(circle at 86% 20%, rgba(166,240,79,0.08), transparent 22%), radial-gradient(circle at 72% 78%, rgba(166,240,79,0.09), transparent 18%), linear-gradient(180deg, #0b0c0e 0%, #090a0c 46%, #0d1013 100%)' }} />
      <div style={{ position:'absolute',inset:0,opacity:0.38,pointerEvents:'none',backgroundImage:'linear-gradient(rgba(244,241,234,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(244,241,234,0.025) 1px,transparent 1px)',backgroundSize:isMobile ? '38px 38px' : '58px 58px',maskImage:'linear-gradient(180deg, rgba(0,0,0,0.9), rgba(0,0,0,0.55))' }} />
      <div style={{ position:'absolute',inset:'10% auto auto 52%',width:isMobile ? 260 : 520,height:isMobile ? 260 : 520,border:'1px solid rgba(166,240,79,0.08)',borderRadius:'50%',transform:'translateX(-50%)',pointerEvents:'none' }} />
      <div style={{ position:'absolute',inset:'22% auto auto 58%',width:isMobile ? 180 : 340,height:isMobile ? 180 : 340,border:'1px solid rgba(166,240,79,0.06)',borderRadius:'50%',transform:'translateX(-50%)',pointerEvents:'none' }} />
      <div style={{ position:'absolute',left:isMobile ? '-8%' : '48%',top:isMobile ? 120 : 40,fontFamily:'var(--font-display)',fontSize:isMobile ? 'clamp(180px,42vw,260px)' : 'clamp(380px,38vw,620px)',fontWeight:700,letterSpacing:'-0.08em',lineHeight:0.82,color:'transparent',WebkitTextStroke:'1px rgba(166,240,79,0.075)',opacity:0.6,transform:'rotate(-6deg)',pointerEvents:'none',userSelect:'none' }}>QD</div>
      <div style={{ position:'absolute',right:isMobile ? '-18%' : '-4%',bottom:isMobile ? 160 : 70,width:isMobile ? 260 : 420,height:isMobile ? 260 : 420,border:'1px solid rgba(166,240,79,0.07)',borderRadius:'32px',transform:'rotate(18deg)',pointerEvents:'none' }} />
      <div style={{ position:'absolute',left:isMobile ? '-12%' : '8%',bottom:isMobile ? 110 : 40,width:isMobile ? 180 : 280,height:isMobile ? 180 : 280,background:'radial-gradient(circle, rgba(166,240,79,0.16), rgba(166,240,79,0.04) 42%, transparent 72%)',filter:'blur(24px)',pointerEvents:'none' }} />
      <div style={{ position:'absolute',right:isMobile ? '-10%' : '14%',top:isMobile ? 220 : 180,width:isMobile ? 180 : 260,height:isMobile ? 180 : 260,background:'radial-gradient(circle, rgba(166,240,79,0.12), transparent 70%)',filter:'blur(30px)',pointerEvents:'none' }} />
      <div style={{ position:'absolute',inset:'0 0 auto 0',height:isMobile ? 220 : 320,background:'linear-gradient(180deg, rgba(166,240,79,0.06), transparent 72%)',opacity:0.6,pointerEvents:'none' }} />
      {!prefersReducedMotion && (
        <div style={{ position:'absolute',top:'-12%',bottom:'-12%',left:'56%',width:isMobile ? 80 : 140,background:'linear-gradient(180deg, transparent, rgba(166,240,79,0.08), transparent)',filter:'blur(18px)',transform:'rotate(8deg)',pointerEvents:'none',animation:'qd-orbit 10s ease-in-out infinite' }} />
      )}
      <div style={{ maxWidth:1280,margin:'0 auto',position:'relative' }}>
        <div className="qd-services-head" style={{ marginBottom:56 }}>
          <Reveal lift={32}>
            <Eyebrow color="var(--acid)">{copy.eyebrow}</Eyebrow>
            <h2 style={{ fontFamily:'var(--font-display)',fontWeight:600,fontSize:'clamp(46px,6.8vw,96px)',letterSpacing:'-0.04em',lineHeight:0.89,margin:'12px 0 22px',color:'var(--bone)',maxWidth:'11ch' }}>
              {copy.titleA}<br/><em style={{ fontFamily:'var(--font-serif)',fontWeight:400,color:'var(--acid)' }}>{copy.titleB}</em>
            </h2>
            <p className="qd-services-intro" style={{ fontFamily:'var(--font-body)',fontSize:18,color:'var(--fg2)',lineHeight:1.5 }}>{copy.intro}</p>
          </Reveal>
        </div>

        <div className="qd-services-grid">
          {copy.cards.map((card, index) => (
            <Reveal key={card.id} delay={index * 100} lift={40} duration={900}>
              <article className="qd-lift qd-service-card">
                <div className="qd-service-card-head">
                  <span className="qd-eyebrow" style={{ color:'var(--acid)' }}>
                    // {card.id}{card.label ? ` · ${card.label}` : ''}
                  </span>
                </div>

                <div className="qd-service-card-body">
                  <h3 className="qd-service-card-title">
                    {card.title}<br /><span>{card.accent}</span>
                  </h3>
                  <p className="qd-service-card-copy">{card.body}</p>
                </div>

                <div className="qd-service-card-visual">
                  <div className="qd-service-card-visual-inner">
                    {card.visual}
                  </div>
                </div>

                <div className="qd-service-card-tags">
                  {card.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

window.__QD = { ...window.__QD, Services };
