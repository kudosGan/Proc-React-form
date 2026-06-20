import { useState, useEffect } from 'react'

const TIPS = [
  "New requests waiting for assignment!",
  "Check your team's workload balance.",
  "Any items ready for approval today?",
  "Don't forget high-priority requests.",
  "Your zone is looking active — keep it up!",
  "Time to review pending signatures.",
  "Great work managing the queue!",
]

const CYCLE     = ['idle', 'think', 'idle', 'talk', 'idle', 'sleep']
const DURATIONS = { idle:8000, think:5000, talk:6000, sleep:7500 }

const CSS = `
  @keyframes mdWagTail  { 0%,100%{transform:rotate(-24deg)} 50%{transform:rotate(24deg)} }
  @keyframes mdWagFast  { 0%,100%{transform:rotate(-40deg)} 50%{transform:rotate(40deg)} }
  @keyframes mdWagSlow  { 0%,100%{transform:rotate(-9deg)}  50%{transform:rotate(9deg)}  }
  @keyframes mdEarSwing { 0%,100%{transform:rotate(0deg)}   48%{transform:rotate(-7deg)} 80%{transform:rotate(4deg)} }
  @keyframes mdBob      { 0%,100%{transform:translateY(0px)}  50%{transform:translateY(-6px)} }
  @keyframes mdThink    { 0%,100%{transform:rotate(0deg) translateY(0px)} 45%{transform:rotate(-11deg) translateY(-4px)} }
  @keyframes mdTalk     {
    0%,100%{transform:rotate(-4deg) translateY(0px)   scale(1)   }
    25%    {transform:rotate( 4deg) translateY(-8px)  scale(1.04)}
    50%    {transform:rotate(-2deg) translateY(-10px) scale(1.05)}
    75%    {transform:rotate( 2deg) translateY(-5px)  scale(1.02)}
  }
  @keyframes mdSleep    { 0%,100%{transform:translateY(0px) scaleY(1)}   50%{transform:translateY(3px) scaleY(0.96)} }
  @keyframes mdTongue   { 0%,100%{transform:rotate(0deg) scaleX(1)}     50%{transform:rotate(10deg) scaleX(1.12)} }
  @keyframes mdZzz1     { 0%{opacity:0;transform:translate(0,0) scale(.6)} 30%{opacity:1} 100%{opacity:0;transform:translate(7px,-20px) scale(.9)} }
  @keyframes mdZzz2     { 0%{opacity:0;transform:translate(0,0) scale(.7)} 30%{opacity:1} 100%{opacity:0;transform:translate(11px,-28px) scale(1.1)} }
  @keyframes mdZzz3     { 0%{opacity:0;transform:translate(0,0) scale(.8)} 30%{opacity:1} 100%{opacity:0;transform:translate(15px,-36px) scale(1.3)} }
  @keyframes mdBubblePop{ 0%{transform:scale(.7);opacity:0} 55%{transform:scale(1.05);opacity:1} 100%{transform:scale(1);opacity:1} }
  @keyframes mdDot      { 0%,80%,100%{opacity:.15;transform:translateY(0)} 40%{opacity:1;transform:translateY(-3px)} }
  @keyframes mdFadeIn   { from{opacity:0;transform:translateY(10px) scale(.9)} to{opacity:1;transform:translateY(0) scale(1)} }
`

export default function MurphyDog() {
  const [visible,  setVisible]  = useState(true)
  const [cycleIdx, setCycleIdx] = useState(0)
  const [tipIdx,   setTipIdx]   = useState(0)
  const [blink,    setBlink]    = useState(false)

  const state = CYCLE[cycleIdx % CYCLE.length]

  useEffect(() => {
    const id = 'murphy-dog-css'
    if (!document.getElementById(id)) {
      const s = document.createElement('style')
      s.id = id; s.textContent = CSS
      document.head.appendChild(s)
    }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => {
      if (state === 'talk') setTipIdx(p => (p + 1) % TIPS.length)
      setCycleIdx(p => p + 1)
    }, DURATIONS[state] || 6000)
    return () => clearTimeout(t)
  }, [cycleIdx, state])

  // blink every ~4 s
  useEffect(() => {
    const go = () => { setBlink(true); setTimeout(() => setBlink(false), 130) }
    const iv = setInterval(go, 4300)
    return () => clearInterval(iv)
  }, [])

  const bodyAnim = state === 'sleep' ? 'mdSleep 3.8s ease-in-out infinite'
                 : state === 'think' ? 'mdThink 2.4s ease-in-out infinite'
                 : state === 'talk'  ? 'mdTalk  0.58s ease-in-out infinite'
                 :                     'mdBob   2s ease-in-out infinite'

  const tailAnim = state === 'sleep' ? 'none'
                 : state === 'talk'  ? 'mdWagFast 0.36s ease-in-out infinite'
                 : state === 'think' ? 'mdWagSlow 2.2s ease-in-out infinite'
                 :                     'mdWagTail 0.78s ease-in-out infinite'

  const eyesClosed = blink || state === 'sleep'

  // ── hidden ──────────────────────────────────────────────
  if (!visible) return (
    <div style={{ position:'fixed', bottom:88, right:18, zIndex:2000 }}>
      <button onClick={() => setVisible(true)} title="Show Murphy"
        style={{ width:42, height:42, borderRadius:'50%', border:'2px solid #D4891A',
          background:'#fff8f0', cursor:'pointer', fontSize:21,
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:'0 3px 14px rgba(212,137,26,.28)', transition:'transform .2s' }}
        onMouseEnter={e => e.currentTarget.style.transform='scale(1.15)'}
        onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>
        🐾
      </button>
      <div style={{ fontSize:8, textAlign:'center', color:'#D4891A', fontFamily:'Arial',
        marginTop:2, fontWeight:700, letterSpacing:.5 }}>MURPHY</div>
    </div>
  )

  // ── bubbles ─────────────────────────────────────────────
  const TalkBubble = () => (
    <div style={{ position:'absolute', bottom:152, right:4, maxWidth:175, background:'#fff',
      border:'2px solid #D4891A', borderRadius:'14px 14px 4px 14px', padding:'9px 13px',
      boxShadow:'0 4px 18px rgba(212,137,26,.22)', animation:'mdBubblePop .35s ease-out',
      zIndex:2001, fontFamily:'Arial' }}>
      <div style={{ fontSize:9, fontWeight:700, color:'#D4891A', marginBottom:4,
        textTransform:'uppercase', letterSpacing:.5 }}>Murphy says</div>
      <div style={{ fontSize:11, color:'#5a3a0a', lineHeight:1.5 }}>{TIPS[tipIdx]}</div>
      <div style={{ position:'absolute', bottom:-9, right:22, width:0, height:0,
        borderLeft:'9px solid transparent', borderTop:'9px solid #D4891A' }}/>
      <div style={{ position:'absolute', bottom:-6, right:24, width:0, height:0,
        borderLeft:'7px solid transparent', borderTop:'7px solid #fff' }}/>
    </div>
  )

  const ThinkBubble = () => (
    <div style={{ position:'absolute', bottom:150, right:12, animation:'mdBubblePop .35s ease-out', zIndex:2001 }}>
      <div style={{ background:'#f0f4ff', border:'1.5px solid #bcc8e8', borderRadius:14,
        padding:'8px 16px', display:'flex', gap:5, alignItems:'center',
        boxShadow:'0 3px 10px rgba(0,0,0,.08)' }}>
        {[0,.38,.76].map((d,i) => (
          <span key={i} style={{ display:'inline-block', width:7, height:7, borderRadius:'50%',
            background:'#8899cc', animation:`mdDot 1.3s ease-in-out ${d}s infinite` }}/>
        ))}
      </div>
      <div style={{ display:'flex', justifyContent:'flex-end', gap:3, paddingRight:16, marginTop:3 }}>
        <div style={{ width:5, height:5, borderRadius:'50%', background:'#bcc8e8' }}/>
        <div style={{ width:3, height:3, borderRadius:'50%', background:'#bcc8e8', marginTop:2 }}/>
      </div>
    </div>
  )

  const Zzz = () => (
    <div style={{ position:'absolute', bottom:148, right:6, pointerEvents:'none', zIndex:2001 }}>
      <span style={{ position:'absolute', right:18, bottom:0, fontSize:11, fontWeight:700,
        color:'#88a8bb', animation:'mdZzz1 2.3s ease-in-out infinite' }}>z</span>
      <span style={{ position:'absolute', right:10, bottom:0, fontSize:14, fontWeight:700,
        color:'#88a8bb', animation:'mdZzz2 2.3s ease-in-out .78s infinite' }}>z</span>
      <span style={{ position:'absolute', right:2,  bottom:0, fontSize:18, fontWeight:700,
        color:'#88a8bb', animation:'mdZzz3 2.3s ease-in-out 1.56s infinite' }}>z</span>
    </div>
  )

  // ─────────────────────────────────────────────────────────
  // SVG DOG  —  viewBox 0 0 180 235
  // Closely matches the reference PNG: large round head, big
  // expressive eyes with prominent shine, large floppy left
  // ear, big nose, open mouth with tongue, red collar + tag,
  // compact sitting body, curled tail.
  // ─────────────────────────────────────────────────────────
  return (
    <div style={{ position:'fixed', bottom:72, right:12, zIndex:2000,
      userSelect:'none', animation:'mdFadeIn .4s ease-out' }}>

      {state === 'talk'  && <TalkBubble />}
      {state === 'think' && <ThinkBubble />}
      {state === 'sleep' && <Zzz />}

      {/* × hide */}
      <button onClick={() => setVisible(false)} title="Hide Murphy"
        style={{ position:'absolute', top:-6, right:-6, zIndex:2002, width:20, height:20,
          borderRadius:'50%', background:'#fff', border:'1.5px solid #ddd', cursor:'pointer',
          fontSize:12, color:'#bbb', display:'flex', alignItems:'center', justifyContent:'center',
          lineHeight:1, padding:0, boxShadow:'0 1px 5px rgba(0,0,0,.12)',
          transition:'border-color .15s, color .15s' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor='#c0392b'; e.currentTarget.style.color='#c0392b' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor='#ddd';    e.currentTarget.style.color='#bbb' }}>
        ×
      </button>

      {/* ── THE ANIMATED DOG ── */}
      <svg viewBox="0 0 180 235" width="112" height="146" overflow="visible"
        style={{ display:'block', animation: bodyAnim,
          filter:'drop-shadow(0 6px 14px rgba(0,0,0,.18))',
          transformOrigin:'center bottom' }}>

        {/* ── TAIL  pivot at body-right (134,170) ── */}
        <g transform="translate(134,170)">
          <g style={{ animation: tailAnim, transformOrigin:'0px 0px' }}>
            <path d="M0,0 Q26,-18 22,-50 Q18,-74 38,-80 Q54,-84 50,-66"
              stroke="#C07010" strokeWidth="13" fill="none" strokeLinecap="round"/>
            <circle cx="48" cy="-68" r="11" fill="#D4891A"/>
            <ellipse cx="54" cy="-62" rx="7" ry="5" fill="#E8A840" opacity=".65"
              transform="rotate(-30,54,-62)"/>
          </g>
        </g>

        {/* ── BODY — compact rounded sitting blob ── */}
        <ellipse cx="90" cy="188" rx="54" ry="46" fill="#D4891A"/>
        {/* belly lighter area */}
        <ellipse cx="90" cy="198" rx="34" ry="30" fill="#F0C060" opacity=".55"/>
        {/* body top shadow */}
        <ellipse cx="90" cy="154" rx="26" ry="10" fill="#B8680A" opacity=".22"/>

        {/* ── CHEST FUR TUFTS ── */}
        <g fill="#E8B040" opacity=".9">
          <path d="M54,162 L49,151 L57,146 L63,154 L60,163"/>
          <path d="M68,158 L64,147 L72,142 L79,151 L75,160"/>
          <path d="M82,156 L79,145 L88,140 L95,149 L91,158"/>
          <path d="M96,158 L93,147 L101,142 L108,151 L104,160"/>
          <path d="M110,162 L108,151 L116,146 L121,155 L117,164"/>
        </g>

        {/* ── LEFT FLOPPY EAR — hangs from left of head ── */}
        <g transform="translate(24,52)">
          <g style={{ animation:'mdEarSwing 4.2s ease-in-out infinite', transformOrigin:'12px 0px' }}>
            {/* outer ear — dark golden */}
            <ellipse cx="12" cy="36" rx="26" ry="46" fill="#B8680A"
              transform="rotate(-10,12,36)"/>
            {/* inner ear — warm pinkish */}
            <ellipse cx="10" cy="36" rx="17" ry="34" fill="#C87860" opacity=".62"
              transform="rotate(-10,10,36)"/>
            {/* ear edge highlight */}
            <ellipse cx="0" cy="42" rx="5" ry="16" fill="#A05808" opacity=".35"
              transform="rotate(-10,0,42)"/>
          </g>
        </g>

        {/* ── RIGHT EAR — smaller, peeks up-right ── */}
        <g transform="translate(142,34)">
          <ellipse cx="6" cy="22" rx="18" ry="32" fill="#C07010"
            transform="rotate(12,6,22)"/>
          <ellipse cx="8" cy="22" rx="11" ry="21" fill="#C87860" opacity=".48"
            transform="rotate(12,8,22)"/>
        </g>

        {/* ── HEAD — large round, dominant feature ── */}
        <circle cx="90" cy="82" r="63" fill="#D4891A"/>

        {/* head top — slightly darker cap */}
        <ellipse cx="90" cy="46" rx="40" ry="24" fill="#B8680A" opacity=".32"/>

        {/* forehead warm lighter spot */}
        <ellipse cx="90" cy="60" rx="30" ry="22" fill="#E8A840" opacity=".48"/>

        {/* ── FOREHEAD FUR TUFTS ── */}
        <g fill="#D4891A">
          <path d="M78,22 L74,13 L80,7  L86,14 L84,22"/>
          <path d="M88,20 L85,10 L92,4  L99,11 L96,20"/>
          <path d="M99,23 L96,13 L103,8 L109,15 L106,23"/>
        </g>

        {/* ── LEFT CHEEK FUR ── */}
        <g fill="#D4891A">
          <path d="M30,94  L21,90 L20,99  L25,105 L32,102"/>
          <path d="M28,110 L19,107 L19,116 L23,122 L31,119"/>
        </g>
        {/* ── RIGHT CHEEK FUR ── */}
        <g fill="#D4891A">
          <path d="M150,94  L159,90 L160,99  L155,105 L148,102"/>
          <path d="M152,110 L161,107 L161,116 L157,122 L149,119"/>
        </g>

        {/* ── LEFT EYE ── */}
        {/* white sclera */}
        <ellipse cx="65" cy="79" rx="21" ry="23" fill="white"/>
        {/* iris */}
        <circle  cx="67" cy="84" r="16"  fill="#7A4818"/>
        {/* pupil */}
        <circle  cx="67" cy="84" r="9.5" fill="#1a0800"/>
        {/* large shine — upper-left, prominent like reference PNG */}
        <circle  cx="59" cy="76" r="7"   fill="white"/>
        {/* small secondary shine */}
        <circle  cx="73" cy="91" r="2.5" fill="white" opacity=".75"/>

        {/* ── RIGHT EYE ── */}
        <ellipse cx="115" cy="79" rx="21" ry="23" fill="white"/>
        <circle  cx="113" cy="84" r="16"  fill="#7A4818"/>
        <circle  cx="113" cy="84" r="9.5" fill="#1a0800"/>
        <circle  cx="105" cy="76" r="7"   fill="white"/>
        <circle  cx="119" cy="91" r="2.5" fill="white" opacity=".75"/>

        {/* ── EYELIDS (blink / sleep) ── */}
        {eyesClosed && (
          <>
            {/* cover eyes with head colour */}
            <ellipse cx="65"  cy="79" rx="22" ry="24" fill="#D4891A"/>
            <ellipse cx="115" cy="79" rx="22" ry="24" fill="#D4891A"/>
            {/* closed eye lines */}
            {state === 'sleep'
              ? <>
                  {/* sleeping — gentle upward curve */}
                  <path d="M45,79 Q65,68 85,79" stroke="#1a0800" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                  <path d="M95,79 Q115,68 135,79" stroke="#1a0800" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                </>
              : <>
                  {/* blink — downward arc */}
                  <path d="M45,79 Q65,90 85,79" stroke="#1a0800" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                  <path d="M95,79 Q115,90 135,79" stroke="#1a0800" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                </>
            }
          </>
        )}

        {/* ── NOSE — large rounded pear, very prominent ── */}
        <path d="M73,108 Q90,100 107,108 Q102,126 90,128 Q78,126 73,108 Z"
          fill="#1a0800"/>
        {/* nose shine */}
        <ellipse cx="81" cy="108" rx="8" ry="4" fill="white" opacity=".28"/>

        {/* ── MOUTH ── open smile */}
        {state !== 'sleep'
          ? <path d="M72,134 Q90,150 108,134" stroke="#1a0800" strokeWidth="2.5"
              fill="none" strokeLinecap="round"/>
          : <path d="M76,132 Q90,140 104,132" stroke="#1a0800" strokeWidth="2"
              fill="none" strokeLinecap="round"/>
        }

        {/* ── TONGUE — large, hangs out, visible center groove ── */}
        {state !== 'sleep' && (
          <g style={{ transformOrigin:'90px 138px',
            animation: state === 'talk' ? 'mdTongue .5s ease-in-out infinite' : 'none' }}>
            {/* tongue body */}
            <path d="M76,138 Q90,158 104,138 Q102,166 90,168 Q78,166 76,138 Z"
              fill="#E05060"/>
            {/* center groove */}
            <path d="M90,148 Q90,168 90,168" stroke="#C03050" strokeWidth="2.2"
              fill="none" strokeLinecap="round"/>
            {/* tongue highlight */}
            <ellipse cx="90" cy="152" rx="9" ry="6" fill="#EE7085" opacity=".5"/>
          </g>
        )}

        {/* ── COLLAR ── red, wide */}
        <path d="M44,142 Q90,154 136,142 L136,154 Q90,166 44,154 Z" fill="#c0392b"/>
        <rect x="44" y="142" width="92" height="13" rx="6.5" fill="#c0392b"/>
        {/* collar highlight */}
        <rect x="44" y="142" width="92" height="6" rx="3" fill="#e04535" opacity=".35"/>

        {/* ── DOG TAG — gold circle with M ── */}
        <circle cx="90" cy="163" r="13" fill="#f0c000"/>
        <circle cx="90" cy="163" r="9"  fill="#d4a800"/>
        <text x="90" y="167.5" textAnchor="middle" fontSize="10" fill="#7a5500"
          fontWeight="700" fontFamily="Arial, sans-serif">M</text>

        {/* ── PAWS — barely visible at bottom of body ── */}
        {/* left paw */}
        <ellipse cx="56"  cy="226" rx="28" ry="15" fill="#C07010"/>
        <ellipse cx="46"  cy="234" rx="10" ry="8"  fill="#B06000"/>
        <ellipse cx="57"  cy="237" rx="11" ry="8"  fill="#B06000"/>
        <ellipse cx="68"  cy="234" rx="10" ry="8"  fill="#B06000"/>
        {/* right paw */}
        <ellipse cx="124" cy="226" rx="28" ry="15" fill="#C07010"/>
        <ellipse cx="114" cy="234" rx="10" ry="8"  fill="#B06000"/>
        <ellipse cx="125" cy="237" rx="11" ry="8"  fill="#B06000"/>
        <ellipse cx="136" cy="234" rx="10" ry="8"  fill="#B06000"/>

      </svg>

      {/* name */}
      <div style={{ textAlign:'center', marginTop:2, fontSize:9, fontWeight:700,
        letterSpacing:1, color:'#C07010', fontFamily:'Arial',
        textTransform:'uppercase', opacity:.85 }}>
        Murphy
      </div>
    </div>
  )
}
