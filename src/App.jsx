import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OPPORTUNITIES, WEEK_LABEL } from "./data.js";

// ─── DESIGN TOKENS (Dark Only — #030303) ───
const t = {
  bg: "#030303",
  bgAlt: "#0A0A0A",
  bgCard: "rgba(255,255,255,0.03)",
  bgCardHover: "rgba(255,255,255,0.06)",
  bgGlass: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.08)",
  borderHover: "rgba(255,255,255,0.16)",
  borderAccent: "rgba(129,140,248,0.3)",
  text: "#F5F5F7",
  textSecondary: "#C8C8CC",
  textTertiary: "#8E8E93",
  accent: "#818CF8",
  accentLight: "#A5B4FC",
  accentDim: "rgba(129,140,248,0.12)",
  accentGlow: "rgba(129,140,248,0.08)",
  rose: "#FB7185",
  roseDim: "rgba(251,113,133,0.12)",
  green: "#34D399",
  greenDim: "rgba(52,211,153,0.12)",
  blue: "#60A5FA",
  blueDim: "rgba(96,165,250,0.12)",
  yellow: "#FBBF24",
  yellowDim: "rgba(251,191,36,0.12)",
  red: "#F87171",
  shadow: "0 1px 2px rgba(0,0,0,0.4)",
  shadowHover: "0 8px 32px rgba(0,0,0,0.5)",
  glowAccent: "0 0 60px rgba(129,140,248,0.06), 0 0 120px rgba(129,140,248,0.03)",
};

// ─── DATA ───
const CATEGORIES = [
  { id: "all", label: "Toutes", icon: "grid" },
  { id: "tech", label: "Tech & SaaS", icon: "cpu" },
  { id: "sante", label: "Santé", icon: "heart" },
  { id: "immobilier", label: "Immobilier", icon: "building" },
  { id: "btp", label: "BTP", icon: "hammer" },
  { id: "marketing", label: "Marketing & Com", icon: "megaphone" },
];

// OPPORTUNITIES et WEEK_LABEL importés depuis ./data.js


const SCORE_LABELS = {
  demande: { label: "Demande", max: 25, desc: "Volume de mentions et recherches détectées" },
  croissance: { label: "Croissance", max: 25, desc: "Vitesse d'évolution de la tendance" },
  concurrence: { label: "Concurrence", max: 20, desc: "Moins de concurrence = score plus élevé" },
  monetisation: { label: "Monétisation", max: 15, desc: "Potentiel de revenus identifié" },
  faisabilite: { label: "Faisabilité", max: 15, desc: "Facilité à lancer un MVP" },
};

// ─── SVG ICONS ───
const Icons = {
  grid: (props) => <svg width={props.size||20} height={props.size||20} viewBox="0 0 24 24" fill="none" stroke={props.color||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  cpu: (props) => <svg width={props.size||20} height={props.size||20} viewBox="0 0 24 24" fill="none" stroke={props.color||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/></svg>,
  heart: (props) => <svg width={props.size||20} height={props.size||20} viewBox="0 0 24 24" fill="none" stroke={props.color||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 002 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>,
  building: (props) => <svg width={props.size||20} height={props.size||20} viewBox="0 0 24 24" fill="none" stroke={props.color||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M8 10h.01M16 10h.01M12 14h.01M8 14h.01M16 14h.01"/></svg>,
  hammer: (props) => <svg width={props.size||20} height={props.size||20} viewBox="0 0 24 24" fill="none" stroke={props.color||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 010-3L12 9"/><path d="M17.64 15L22 10.64"/><path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 00-3.94-1.64H9l.92.82A6.18 6.18 0 0112 8.4v1.56l2 2h2.47l2.26 1.91"/></svg>,
  megaphone: (props) => <svg width={props.size||20} height={props.size||20} viewBox="0 0 24 24" fill="none" stroke={props.color||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 11-5.8-1.6"/></svg>,
  arrowRight: (props) => <svg width={props.size||16} height={props.size||16} viewBox="0 0 24 24" fill="none" stroke={props.color||"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>,
  arrowLeft: (props) => <svg width={props.size||16} height={props.size||16} viewBox="0 0 24 24" fill="none" stroke={props.color||"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>,
  sparkle: (props) => <svg width={props.size||20} height={props.size||20} viewBox="0 0 24 24" fill={props.color||"currentColor"}><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z"/></svg>,
  radar: (props) => <svg width={props.size||20} height={props.size||20} viewBox="0 0 24 24" fill="none" stroke={props.color||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19.07 4.93A10 10 0 0 0 6.99 3.34"/><path d="M4 6h.01"/><path d="M2.29 9.62A10 10 0 1 0 21.31 8.35"/><path d="M16.24 7.76A6 6 0 1 0 8.23 16.67"/><path d="M12 18h.01"/><path d="M17.99 11.66A6 6 0 0 1 15.77 16.67"/><circle cx="12" cy="12" r="2"/></svg>,
  trendUp: (props) => <svg width={props.size||16} height={props.size||16} viewBox="0 0 24 24" fill="none" stroke={props.color||"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  check: (props) => <svg width={props.size||16} height={props.size||16} viewBox="0 0 24 24" fill="none" stroke={props.color||"currentColor"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  calendar: (props) => <svg width={props.size||16} height={props.size||16} viewBox="0 0 24 24" fill="none" stroke={props.color||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
  circle: (props) => <svg width={props.size||8} height={props.size||8} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill={props.color||"currentColor"}/></svg>,
  heartFilled: (props) => <svg width={props.size||18} height={props.size||18} viewBox="0 0 24 24" fill={props.color||"#FB7185"} stroke="none"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 002 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>,
  heartOutline: (props) => <svg width={props.size||18} height={props.size||18} viewBox="0 0 24 24" fill="none" stroke={props.color||t.textTertiary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 002 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>,
};

const CategoryIcon = ({ id, size = 20, color }) => {
  const cat = CATEGORIES.find(c => c.id === id);
  const IconComp = Icons[cat?.icon] || Icons.grid;
  return <IconComp size={size} color={color || t.accent} />;
};

// ─── FLOATING GEOMETRIC SHAPES ───
function ElegantShape({ delay = 0, width = 400, height = 100, rotate = 0, gradient, style: posStyle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -150, rotate: rotate - 15 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      style={{ position: "absolute", ...posStyle }}
    >
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{ width, height, position: "relative" }}
      >
        <div style={{
          position: "absolute", inset: 0, borderRadius: 9999,
          background: `linear-gradient(to right, ${gradient}, transparent)`,
          border: "2px solid rgba(255,255,255,0.15)",
          boxShadow: "0 8px 32px 0 rgba(255,255,255,0.1)",
        }}>
          <div style={{
            position: "absolute", inset: 0, borderRadius: 9999,
            background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2), transparent 70%)",
          }} />
        </div>
      </motion.div>
    </motion.div>
  );
}

function FloatingShapes() {
  return (
    <div style={{ position: "fixed", inset: 0, overflow: "visible", pointerEvents: "none", zIndex: -1 }}>
      {/* Subtle background gradient */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99,102,241,0.04) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(251,113,133,0.04) 0%, transparent 50%)",
      }} />

      <ElegantShape delay={0.3} width={600} height={140} rotate={12}
        gradient="rgba(99,102,241,0.15)" style={{ left: "-10%", top: "15%" }} />
      <ElegantShape delay={0.5} width={500} height={120} rotate={-15}
        gradient="rgba(251,113,133,0.15)" style={{ right: "-5%", top: "70%" }} />
      <ElegantShape delay={0.4} width={300} height={80} rotate={-8}
        gradient="rgba(139,92,246,0.15)" style={{ left: "5%", bottom: "5%" }} />
      <ElegantShape delay={0.6} width={200} height={60} rotate={20}
        gradient="rgba(245,158,11,0.15)" style={{ right: "15%", top: "10%" }} />
      <ElegantShape delay={0.7} width={150} height={40} rotate={-25}
        gradient="rgba(6,182,212,0.15)" style={{ left: "20%", top: "5%" }} />
    </div>
  );
}

// ─── FAVORITES HOOK ───
function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem("trendora_favorites");
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  useEffect(() => {
    try { localStorage.setItem("trendora_favorites", JSON.stringify(favorites)); }
    catch { /* silently fail */ }
  }, [favorites]);

  const toggle = useCallback((id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  }, []);

  const isFav = useCallback((id) => favorites.includes(id), [favorites]);

  return { favorites, toggle, isFav, count: favorites.length };
}

// ─── RESPONSIVE HOOK ───
function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" ? window.innerWidth < breakpoint : false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", check);
    check();
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return isMobile;
}

// ─── FADE-UP ANIMATION ───
const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.8, delay: 0.1 + (i || 0) * 0.15, ease: [0.25, 0.4, 0.25, 1] },
  }),
};

function FadeUp({ children, style, delay = 0, custom = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.1 + delay + (custom || 0) * 0.15, ease: [0.25, 0.4, 0.25, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// ─── COMPONENTS ───

function ScoreRing({ score, size = 52, strokeWidth = 3.5 }) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 85 ? t.green : score >= 70 ? t.blue : score >= 55 ? t.yellow : t.red;
  const glow = score >= 85 ? `0 0 12px ${t.green}40` : score >= 70 ? `0 0 12px ${t.blue}30` : "none";
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0, filter: `drop-shadow(${glow})` }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={t.border} strokeWidth={strokeWidth} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.3, fontWeight: 700, color: t.text, fontFamily: "'JetBrains Mono', monospace" }}>
        {score}
      </div>
    </div>
  );
}

function TrendBadge({ value }) {
  const num = parseInt(value);
  const color = num >= 200 ? t.green : num >= 100 ? t.blue : t.textSecondary;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 3, color, fontSize: 13, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>
      <Icons.trendUp size={12} color={color} />
      {value}
    </span>
  );
}

function WeekBadge({ type }) {
  const config = {
    new: { label: "Nouveau", bg: t.accentDim, color: t.accent, border: t.borderAccent },
    up: { label: "En hausse", bg: t.greenDim, color: t.green, border: "rgba(52,211,153,0.2)" },
    stable: { label: "Stable", bg: "rgba(255,255,255,0.04)", color: t.textTertiary, border: t.border },
  };
  const c = config[type] || config.stable;
  return (
    <span style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}`, padding: "4px 11px", borderRadius: 20, fontSize: 12, fontWeight: 600, letterSpacing: "0.02em" }}>
      {c.label}
    </span>
  );
}

function Tag({ children, color }) {
  const c = color || t.textSecondary;
  return (
    <span style={{ color: c, background: `${c}14`, border: `1px solid ${c}20`, padding: "4px 11px", borderRadius: 20, fontSize: 12, fontWeight: 500 }}>
      {children}
    </span>
  );
}

function ScoreBreakdown({ scores }) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {Object.entries(SCORE_LABELS).map(([key, meta]) => {
        const val = scores[key];
        const pct = (val / meta.max) * 100;
        const color = pct >= 85 ? t.green : pct >= 65 ? t.blue : t.yellow;
        return (
          <div key={key}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 14, color: t.textSecondary, fontWeight: 500 }}>{meta.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color, fontFamily: "'JetBrains Mono', monospace" }}>{val}/{meta.max}</span>
            </div>
            <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, borderRadius: 2, background: `linear-gradient(90deg, ${color}80, ${color})`, transition: "width 1s cubic-bezier(0.4,0,0.2,1)" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function GlassCard({ children, style, onClick, hover = true, glow = false }) {
  const baseStyle = {
    background: t.bgCard,
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: `1px solid ${t.border}`,
    borderRadius: 16,
    transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
    ...(glow ? { boxShadow: t.glowAccent } : { boxShadow: t.shadow }),
    ...(onClick ? { cursor: "pointer" } : {}),
    ...style,
  };
  return (
    <div
      style={baseStyle}
      onClick={onClick}
      onMouseEnter={hover && onClick ? (e) => {
        e.currentTarget.style.borderColor = t.borderHover;
        e.currentTarget.style.background = t.bgCardHover;
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = glow ? `0 0 80px rgba(129,140,248,0.1), ${t.shadowHover}` : t.shadowHover;
      } : undefined}
      onMouseLeave={hover && onClick ? (e) => {
        e.currentTarget.style.borderColor = t.border;
        e.currentTarget.style.background = t.bgCard;
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = glow ? t.glowAccent : t.shadow;
      } : undefined}
    >
      {children}
    </div>
  );
}

function FavButton({ id, isFav, toggle, size = 18 }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); toggle(id); }}
      style={{
        background: "none", border: "none", cursor: "pointer", padding: 6,
        borderRadius: 8, transition: "all 0.2s ease", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
      onMouseEnter={e => { e.currentTarget.style.background = "rgba(251,113,133,0.1)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "none"; }}
      title={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      {isFav ? <Icons.heartFilled size={size} /> : <Icons.heartOutline size={size} />}
    </button>
  );
}

function OpportunityRow({ opp, index, onSelect, showRank = false, isFav, toggleFav }) {
  const isMobile = useIsMobile();
  return (
    <GlassCard onClick={() => onSelect(opp)} style={{ padding: isMobile ? "16px 16px" : "18px 22px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 12 : 16 }}>
        {showRank && (
          <div style={{ fontSize: 16, fontWeight: 800, color: t.textTertiary, width: 24, textAlign: "center", fontFamily: "'JetBrains Mono', monospace", opacity: 0.5, flexShrink: 0 }}>{index}</div>
        )}
        <ScoreRing score={opp.score} size={isMobile ? 44 : 52} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: isMobile ? 14 : 15, fontWeight: 600, color: t.text, marginBottom: 6, lineHeight: 1.4 }}>{opp.name}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
            <Tag>{CATEGORIES.find(c => c.id === opp.category)?.label}</Tag>
            <Tag>{opp.type}</Tag>
            <WeekBadge type={opp.weekTrend} />
          </div>
        </div>
        {!isMobile && (
          <>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <TrendBadge value={opp.trend} />
              <div style={{ fontSize: 12, color: t.textTertiary, marginTop: 4, fontFamily: "'JetBrains Mono', monospace" }}>{opp.market}</div>
            </div>
            <FavButton id={opp.id} isFav={isFav} toggle={toggleFav} />
            <div style={{ color: t.textTertiary, flexShrink: 0 }}>
              <Icons.arrowRight size={16} color={t.textTertiary} />
            </div>
          </>
        )}
      </div>
      {isMobile && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10, paddingTop: 10, borderTop: `1px solid ${t.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <TrendBadge value={opp.trend} />
            <span style={{ fontSize: 12, color: t.textTertiary, fontFamily: "'JetBrains Mono', monospace" }}>{opp.market}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FavButton id={opp.id} isFav={isFav} toggle={toggleFav} size={16} />
            <Icons.arrowRight size={14} color={t.textTertiary} />
          </div>
        </div>
      )}
    </GlassCard>
  );
}

// ─── VIEWS ───

function HomeView({ opportunities, onSelect, onNavigate, isFav, toggleFav }) {
  const sorted = [...opportunities].sort((a, b) => b.score - a.score);
  const top5 = sorted.slice(0, 5);
  const newOpps = opportunities.filter(o => o.weekTrend === "new");
  const risingOpps = opportunities.filter(o => o.weekTrend === "up");
  const avgScore = Math.round(opportunities.reduce((a, b) => a + b.score, 0) / opportunities.length);
  const totalMentions = opportunities.reduce((a, b) => a + b.mentions, 0);
  const catCounts = CATEGORIES.filter(c => c.id !== "all").map(c => ({
    ...c,
    count: opportunities.filter(o => o.category === c.id).length,
    avgScore: Math.round(opportunities.filter(o => o.category === c.id).reduce((a, b) => a + b.score, 0) / opportunities.filter(o => o.category === c.id).length),
    best: [...opportunities.filter(o => o.category === c.id)].sort((a, b) => b.score - a.score)[0],
  }));

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      {/* ─── HERO ─── */}
      <div style={{ position: "relative", textAlign: "center", padding: "100px 20px 120px", overflow: "clip" }}>
        <div style={{ position: "relative", zIndex: 2, maxWidth: 800, margin: "0 auto" }}>
          <FadeUp custom={0}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 24, padding: "6px 16px", marginBottom: 28 }}>
              <Icons.circle size={8} color="rgba(251,113,133,0.8)" />
              <span style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", letterSpacing: "0.04em" }}>Propulsé par l'intelligence artificielle</span>
            </div>
          </FadeUp>

          <FadeUp custom={1}>
            <h1 style={{ fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 800, margin: "0 0 20px", lineHeight: 1.1, letterSpacing: "-0.03em", fontFamily: "'Inter', system-ui, sans-serif" }}>
              <span style={{ backgroundImage: "linear-gradient(to bottom, #FFFFFF, rgba(255,255,255,0.8))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Votre radar
              </span>
              <br />
              <span style={{ backgroundImage: "linear-gradient(to right, #A5B4FC, rgba(255,255,255,0.9), #FDA4AF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                d'opportunités business
              </span>
            </h1>
          </FadeUp>

          <FadeUp custom={2}>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "clamp(17px, 2.2vw, 21px)", margin: "0 auto 44px", maxWidth: 560, lineHeight: 1.7, fontWeight: 400, letterSpacing: "0.01em" }}>
              Chaque semaine, notre IA analyse des milliers de signaux pour détecter les meilleures opportunités de marché.
            </p>
          </FadeUp>

          <FadeUp custom={3}>
            <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
              <button onClick={() => onNavigate("top")} style={{
                background: "linear-gradient(135deg, #818CF8, #6366F1)", color: "#fff", padding: "14px 32px", borderRadius: 12,
                fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "inherit",
                transition: "all 0.3s ease", boxShadow: "0 0 30px rgba(129,140,248,0.25)",
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 50px rgba(129,140,248,0.4)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 30px rgba(129,140,248,0.25)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                Explorer le Top 10
              </button>
              <button onClick={() => onNavigate("contact")} style={{
                background: "transparent", color: t.text, padding: "14px 32px", borderRadius: 12,
                fontSize: 15, fontWeight: 600, border: `1px solid ${t.border}`, cursor: "pointer",
                fontFamily: "inherit", transition: "all 0.3s ease", backdropFilter: "blur(10px)",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = t.borderHover; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.background = "transparent"; }}>
                Prendre rendez-vous
              </button>
            </div>
          </FadeUp>
        </div>

        {/* Bottom gradient fade */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #030303, transparent 30%, transparent 70%, rgba(3,3,3,0.8))", pointerEvents: "none" }} />
      </div>

      {/* ─── STATS ─── */}
      <FadeUp style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
          {[
            { label: "Opportunités", value: opportunities.length, color: t.accent },
            { label: "Score moyen", value: avgScore, color: t.blue },
            { label: "Nouvelles", value: newOpps.length, sub: "cette semaine", color: t.green },
            { label: "En hausse", value: risingOpps.length, sub: "cette semaine", color: t.yellow },
            { label: "Mentions", value: totalMentions.toLocaleString(), color: t.textSecondary },
            { label: "Secteurs", value: catCounts.length, color: t.accent },
          ].map((s, i) => (
            <GlassCard key={i} style={{ padding: "18px 20px" }} hover={false}>
              <div style={{ fontSize: 10, color: t.textTertiary, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 8 }}>{s.label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: s.color, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-0.02em" }}>{s.value}</div>
              {s.sub && <div style={{ fontSize: 11, color: t.textTertiary, marginTop: 4 }}>{s.sub}</div>}
            </GlassCard>
          ))}
        </div>
      </FadeUp>

      {/* ─── HOW IT WORKS ─── */}
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 64px" }}>
        <FadeUp>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>
              <span style={{ backgroundImage: "linear-gradient(to bottom, #FFFFFF, rgba(255,255,255,0.8))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Comment ça marche
              </span>
            </h2>
            <p style={{ color: t.textSecondary, fontSize: 16, margin: "12px 0 0", lineHeight: 1.6 }}>3 étapes, chaque semaine, automatiquement</p>
          </div>
        </FadeUp>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          {[
            { icon: <Icons.radar size={28} color={t.accent} />, step: "01", title: "Analyse IA", desc: "Notre IA scanne des milliers de sources : Reddit, Google Trends, Product Hunt, forums spécialisés et réseaux sociaux." },
            { icon: <Icons.sparkle size={28} color={t.rose} />, step: "02", title: "Scoring multi-critères", desc: "Chaque opportunité est évaluée sur 5 axes : demande, croissance, concurrence, monétisation et faisabilité." },
            { icon: <Icons.trendUp size={28} color={t.green} />, step: "03", title: "Top classement", desc: "Les meilleures opportunités sont classées et mises à jour chaque lundi avec les données fraîches." },
          ].map((item, i) => (
            <FadeUp key={i} custom={i}>
              <GlassCard style={{ padding: 28, height: "100%" }} hover={false} glow={i === 0}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: t.accentDim, border: `1px solid ${t.borderAccent}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {item.icon}
                  </div>
                  <span style={{ fontSize: 40, fontWeight: 900, color: "rgba(255,255,255,0.04)", fontFamily: "'JetBrains Mono', monospace" }}>{item.step}</span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: t.text, margin: "0 0 10px" }}>{item.title}</h3>
                <p style={{ fontSize: 15, color: t.textSecondary, lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
              </GlassCard>
            </FadeUp>
          ))}
        </div>
      </div>

      {/* ─── ALERT BANNER ─── */}
      {newOpps.length > 0 && (
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 48px" }}>
          <FadeUp>
            <GlassCard onClick={() => onSelect(newOpps.sort((a,b) => b.score - a.score)[0])} glow style={{ padding: "22px 28px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: t.rose, display: "inline-block", animation: "pulse 2s ease-in-out infinite", boxShadow: `0 0 12px ${t.rose}60` }} />
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: t.rose }}>Alerte opportunité</span>
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: t.text, marginBottom: 6 }}>
                {newOpps.sort((a,b) => b.score - a.score)[0].name}
              </div>
              <div style={{ fontSize: 14, color: t.textSecondary, lineHeight: 1.5, display: "flex", alignItems: "center", gap: 8 }}>
                Score {newOpps.sort((a,b) => b.score - a.score)[0].score}/100 · {newOpps.sort((a,b) => b.score - a.score)[0].trend} de croissance
                <Icons.arrowRight size={14} color={t.accent} />
              </div>
            </GlassCard>
          </FadeUp>
        </div>
      )}

      {/* ─── TOP 5 ─── */}
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 48px" }}>
        <FadeUp>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: t.text, margin: 0 }}>Top 5 de la semaine</h2>
            <button onClick={() => onNavigate("top")} style={{ background: "none", border: "none", color: t.accent, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4 }}>
              Voir le Top 10 <Icons.arrowRight size={14} color={t.accent} />
            </button>
          </div>
        </FadeUp>
        <div style={{ display: "grid", gap: 10 }}>
          {top5.map((opp, i) => (
            <FadeUp key={opp.id} custom={i * 0.3}>
              <OpportunityRow opp={opp} index={i + 1} onSelect={onSelect} showRank isFav={isFav(opp.id)} toggleFav={toggleFav} />
            </FadeUp>
          ))}
        </div>
      </div>

      {/* ─── SECTORS ─── */}
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 48px" }}>
        <FadeUp>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: t.text, margin: 0 }}>Par secteur</h2>
            <button onClick={() => onNavigate("categories")} style={{ background: "none", border: "none", color: t.accent, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4 }}>
              Toutes les catégories <Icons.arrowRight size={14} color={t.accent} />
            </button>
          </div>
        </FadeUp>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
          {catCounts.map((cat, i) => (
            <FadeUp key={cat.id} custom={i * 0.3}>
              <GlassCard onClick={() => onNavigate("categories", cat.id)} style={{ padding: 22 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: t.accentDim, border: `1px solid ${t.borderAccent}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <CategoryIcon id={cat.id} size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: t.text }}>{cat.label}</div>
                      <div style={{ fontSize: 12, color: t.textTertiary }}>{cat.count} opportunités</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 10, color: t.textTertiary, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>Score moy.</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: t.blue, fontFamily: "'JetBrains Mono', monospace" }}>{cat.avgScore}</div>
                  </div>
                </div>
                {cat.best && (
                  <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "12px 14px", border: `1px solid ${t.border}` }}>
                    <div style={{ fontSize: 10, color: t.textTertiary, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginBottom: 6 }}>Meilleure opportunité</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: t.text, lineHeight: 1.4, marginBottom: 6 }}>{cat.best.name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: t.green, fontFamily: "'JetBrains Mono', monospace" }}>{cat.best.score}/100</span>
                      <TrendBadge value={cat.best.trend} />
                    </div>
                  </div>
                )}
              </GlassCard>
            </FadeUp>
          ))}
        </div>
      </div>

      {/* ─── NEW THIS WEEK ─── */}
      {newOpps.length > 0 && (
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 48px" }}>
          <FadeUp>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: t.text, margin: "0 0 20px", display: "flex", alignItems: "center", gap: 10 }}>
              Nouvelles cette semaine
              <span style={{ background: t.accentDim, color: t.accent, border: `1px solid ${t.borderAccent}`, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{newOpps.length}</span>
            </h2>
          </FadeUp>
          <div style={{ display: "grid", gap: 10 }}>
            {newOpps.sort((a, b) => b.score - a.score).map((opp, i) => (
              <FadeUp key={opp.id} custom={i * 0.2}>
                <OpportunityRow opp={opp} onSelect={onSelect} isFav={isFav(opp.id)} toggleFav={toggleFav} />
              </FadeUp>
            ))}
          </div>
        </div>
      )}

      {/* ─── RISING ─── */}
      {risingOpps.length > 0 && (
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 48px" }}>
          <FadeUp>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: t.text, margin: "0 0 20px", display: "flex", alignItems: "center", gap: 10 }}>
              En hausse
              <span style={{ background: t.greenDim, color: t.green, border: "1px solid rgba(52,211,153,0.2)", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{risingOpps.length}</span>
            </h2>
          </FadeUp>
          <div style={{ display: "grid", gap: 10 }}>
            {risingOpps.sort((a, b) => b.score - a.score).map((opp, i) => (
              <FadeUp key={opp.id} custom={i * 0.2}>
                <OpportunityRow opp={opp} onSelect={onSelect} isFav={isFav(opp.id)} toggleFav={toggleFav} />
              </FadeUp>
            ))}
          </div>
        </div>
      )}

      {/* ─── CTA ─── */}
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 64px" }}>
        <FadeUp>
          <div style={{
            position: "relative", borderRadius: 20, padding: "48px 32px", textAlign: "center", overflow: "hidden",
            border: `1px solid ${t.borderAccent}`,
          }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(129,140,248,0.08) 0%, transparent 70%)" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <h2 style={{ fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 800, margin: "0 0 12px", letterSpacing: "-0.02em" }}>
                <span style={{ backgroundImage: "linear-gradient(to right, #A5B4FC, #FFFFFF, #FDA4AF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  Une opportunité vous parle ?
                </span>
              </h2>
              <p style={{ color: t.textSecondary, fontSize: 16, margin: "0 auto 28px", maxWidth: 480, lineHeight: 1.6 }}>
                On vous accompagne de l'idée au lancement — stratégie, MVP, acquisition clients.
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
                <button onClick={() => onNavigate("top")} style={{
                  background: "transparent", color: t.text, padding: "14px 28px", borderRadius: 12,
                  fontSize: 14, fontWeight: 600, border: `1px solid ${t.border}`, cursor: "pointer", fontFamily: "inherit",
                  transition: "all 0.3s ease",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = t.borderHover; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; }}>
                  Explorer le Top 10
                </button>
                <button onClick={() => onNavigate("contact")} style={{
                  background: "linear-gradient(135deg, #818CF8, #6366F1)", color: "#fff", padding: "14px 28px", borderRadius: 12,
                  fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "inherit",
                  transition: "all 0.3s ease", boxShadow: "0 0 30px rgba(129,140,248,0.25)",
                }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 50px rgba(129,140,248,0.4)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 30px rgba(129,140,248,0.25)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                  Prendre rendez-vous
                </button>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}

function TopView({ opportunities, onSelect, isFav, toggleFav }) {
  const sorted = [...opportunities].sort((a, b) => b.score - a.score);
  const top10 = sorted.slice(0, 10);
  const rest = sorted.slice(10);
  const [showAll, setShowAll] = useState(false);
  const avgScore = Math.round(opportunities.reduce((a, b) => a + b.score, 0) / opportunities.length);
  const newCount = opportunities.filter(o => o.weekTrend === "new").length;

  return (
    <div>
      <FadeUp>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 32 }}>
          {[
            { label: "Opportunités", value: opportunities.length, color: t.accent },
            { label: "Score moyen", value: avgScore + "/100", color: t.blue },
            { label: "Nouvelles", value: newCount, color: t.green },
            { label: "Catégories", value: CATEGORIES.length - 1, color: t.textSecondary },
          ].map((s, i) => (
            <GlassCard key={i} style={{ padding: "16px 20px" }} hover={false}>
              <div style={{ fontSize: 10, color: t.textTertiary, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: s.color, fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</div>
            </GlassCard>
          ))}
        </div>
      </FadeUp>

      <FadeUp>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>
            <span style={{ backgroundImage: "linear-gradient(to right, #FFFFFF, #A5B4FC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Top 10 de la semaine
            </span>
          </h2>
          <p style={{ color: t.textTertiary, fontSize: 14, margin: "8px 0 0", lineHeight: 1.6 }}>
            Les opportunités business les mieux scorées — analyse IA mise à jour chaque lundi.
          </p>
        </div>
      </FadeUp>

      <div style={{ display: "grid", gap: 10 }}>
        {top10.map((opp, i) => (
          <FadeUp key={opp.id} custom={i * 0.2}>
            <OpportunityRow opp={opp} index={i + 1} onSelect={onSelect} showRank isFav={isFav(opp.id)} toggleFav={toggleFav} />
          </FadeUp>
        ))}
      </div>

      {rest.length > 0 && (
        <div style={{ marginTop: 48 }}>
          <FadeUp>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: t.text, margin: 0 }}>Toutes les opportunités</h2>
                <p style={{ color: t.textTertiary, fontSize: 13, margin: "6px 0 0" }}>{rest.length} opportunités supplémentaires</p>
              </div>
              <button onClick={() => setShowAll(!showAll)} style={{
                background: t.accentDim, color: t.accent, border: `1px solid ${t.borderAccent}`, borderRadius: 10,
                padding: "10px 22px", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit", transition: "all 0.2s ease",
              }}>
                {showAll ? "Réduire" : `Voir les ${rest.length}`}
              </button>
            </div>
          </FadeUp>

          {showAll && (
            <div style={{ display: "grid", gap: 8 }}>
              {rest.map((opp, i) => (
                <FadeUp key={opp.id} custom={Math.min(i * 0.1, 1.5)}>
                  <OpportunityRow opp={opp} index={i + 11} onSelect={onSelect} showRank isFav={isFav(opp.id)} toggleFav={toggleFav} />
                </FadeUp>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function NewView({ opportunities, onSelect, isFav, toggleFav }) {
  const newest = [...opportunities].slice(-15).reverse();
  const newThisWeek = newest.filter(o => o.weekTrend === "new");
  const catBreakdown = CATEGORIES.filter(c => c.id !== "all").map(c => ({
    ...c,
    count: newest.filter(o => o.category === c.id).length,
  })).filter(c => c.count > 0);

  return (
    <div>
      <FadeUp>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 32 }}>
          {[
            { label: "Dernières ajoutées", value: newest.length, color: t.accent },
            { label: "Nouvelles cette semaine", value: newThisWeek.length, color: t.green },
            { label: "Score le plus haut", value: newest.length > 0 ? Math.max(...newest.map(o => o.score)) : 0, color: t.rose },
            { label: "Secteurs couverts", value: catBreakdown.length, color: t.blue },
          ].map((s, i) => (
            <GlassCard key={i} style={{ padding: "16px 20px" }} hover={false}>
              <div style={{ fontSize: 10, color: t.textTertiary, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: s.color, fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</div>
            </GlassCard>
          ))}
        </div>
      </FadeUp>

      <FadeUp>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>
            <span style={{ backgroundImage: "linear-gradient(to right, #34D399, #A5B4FC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Nouveautés
            </span>
          </h2>
          <p style={{ color: t.textTertiary, fontSize: 14, margin: "8px 0 0", lineHeight: 1.6 }}>
            Les 15 dernières opportunités ajoutées au radar — fraîchement détectées par notre IA.
          </p>
        </div>
      </FadeUp>

      {catBreakdown.length > 1 && (
        <FadeUp>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
            {catBreakdown.map(c => (
              <div key={c.id} style={{
                display: "flex", alignItems: "center", gap: 6, background: t.bgCard,
                border: `1px solid ${t.border}`, borderRadius: 20, padding: "5px 14px",
              }}>
                <CategoryIcon id={c.id} size={14} />
                <span style={{ fontSize: 12, color: t.textSecondary, fontWeight: 600 }}>{c.label}</span>
                <span style={{ fontSize: 11, color: t.accent, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{c.count}</span>
              </div>
            ))}
          </div>
        </FadeUp>
      )}

      <div style={{ display: "grid", gap: 10 }}>
        {newest.map((opp, i) => (
          <FadeUp key={opp.id} custom={i * 0.15}>
            <OpportunityRow opp={opp} index={i + 1} onSelect={onSelect} showRank isFav={isFav(opp.id)} toggleFav={toggleFav} />
          </FadeUp>
        ))}
      </div>
    </div>
  );
}

function CategoryView({ opportunities, onSelect, initialCat, isFav, toggleFav }) {
  const [activeCat, setActiveCat] = useState(initialCat || "all");
  const filtered = activeCat === "all" ? opportunities : opportunities.filter(o => o.category === activeCat);
  const sorted = [...filtered].sort((a, b) => b.score - a.score);

  return (
    <div>
      <FadeUp>
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>
            <span style={{ backgroundImage: "linear-gradient(to right, #FFFFFF, #FDA4AF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Catégories
            </span>
          </h2>
          <p style={{ color: t.textTertiary, fontSize: 14, margin: "8px 0 0", lineHeight: 1.6 }}>Explore les opportunités par secteur d'activité.</p>
        </div>
      </FadeUp>

      <FadeUp>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
          {CATEGORIES.map(cat => {
            const active = activeCat === cat.id;
            const count = cat.id === "all" ? opportunities.length : opportunities.filter(o => o.category === cat.id).length;
            return (
              <button key={cat.id} onClick={() => setActiveCat(cat.id)} style={{
                background: active ? t.accentDim : t.bgCard,
                color: active ? t.accent : t.textSecondary,
                border: `1px solid ${active ? t.borderAccent : t.border}`,
                borderRadius: 10, padding: "10px 18px", cursor: "pointer", fontSize: 13, fontWeight: 600,
                transition: "all 0.2s ease", display: "flex", alignItems: "center", gap: 8, fontFamily: "inherit",
              }}>
                <CategoryIcon id={cat.id} size={16} color={active ? t.accent : t.textTertiary} />
                {cat.label}
                <span style={{ background: active ? `${t.accent}20` : "rgba(255,255,255,0.06)", padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700 }}>{count}</span>
              </button>
            );
          })}
        </div>
      </FadeUp>

      {activeCat !== "all" && (
        <FadeUp>
          <GlassCard style={{ padding: 22, marginBottom: 24, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16 }} hover={false}>
            <div>
              <div style={{ fontSize: 10, color: t.textTertiary, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 6 }}>Opportunités</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: t.text, fontFamily: "'JetBrains Mono', monospace" }}>{sorted.length}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: t.textTertiary, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 6 }}>Score moyen</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: t.accent, fontFamily: "'JetBrains Mono', monospace" }}>{Math.round(sorted.reduce((a, b) => a + b.score, 0) / sorted.length)}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: t.textTertiary, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 6 }}>Meilleur score</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: t.green, fontFamily: "'JetBrains Mono', monospace" }}>{sorted[0]?.score || "—"}</div>
            </div>
          </GlassCard>
        </FadeUp>
      )}

      <div style={{ display: "grid", gap: 10 }}>
        {sorted.map((opp, i) => (
          <FadeUp key={opp.id} custom={Math.min(i * 0.1, 1.5)}>
            <OpportunityRow opp={opp} onSelect={onSelect} isFav={isFav(opp.id)} toggleFav={toggleFav} />
          </FadeUp>
        ))}
      </div>
    </div>
  );
}

function DetailView({ opportunity: opp, onBack, isFav, toggleFav }) {
  const cat = CATEGORIES.find(c => c.id === opp.category);

  return (
    <div>
      <FadeUp>
        <button onClick={onBack} style={{ background: "none", border: "none", color: t.accent, cursor: "pointer", fontSize: 14, fontWeight: 600, padding: 0, marginBottom: 24, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8 }}>
          <Icons.arrowLeft size={16} color={t.accent} />
          Retour
        </button>
      </FadeUp>

      <FadeUp>
        <GlassCard style={{ padding: 32, marginBottom: 20 }} hover={false} glow>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "flex-start" }}>
            <ScoreRing score={opp.score} size={80} strokeWidth={4.5} />
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                <Tag color={t.accent}>{cat?.label}</Tag>
                <Tag>{opp.type}</Tag>
                <WeekBadge type={opp.weekTrend} />
              </div>
              <h1 style={{ fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 800, margin: "0 0 12px", lineHeight: 1.3, letterSpacing: "-0.02em" }}>
                <span style={{ backgroundImage: "linear-gradient(to right, #FFFFFF, #A5B4FC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  {opp.name}
                </span>
              </h1>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 20, fontSize: 14, alignItems: "center" }}>
                <span style={{ color: t.textSecondary }}>Marché : <strong style={{ color: t.text }}>{opp.market}</strong></span>
                <span style={{ color: t.textSecondary }}>Tendance : <TrendBadge value={opp.trend} /></span>
                <span style={{ color: t.textSecondary }}>Mentions : <strong style={{ color: t.text }}>{opp.mentions.toLocaleString()}</strong></span>
                <button
                  onClick={() => toggleFav(opp.id)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    background: isFav(opp.id) ? t.roseDim : t.bgCard,
                    border: `1px solid ${isFav(opp.id) ? "rgba(251,113,133,0.3)" : t.border}`,
                    color: isFav(opp.id) ? t.rose : t.textSecondary,
                    padding: "6px 14px", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 600,
                    fontFamily: "inherit", transition: "all 0.2s ease",
                  }}>
                  {isFav(opp.id) ? <Icons.heartFilled size={14} /> : <Icons.heartOutline size={14} color={t.textSecondary} />}
                  {isFav(opp.id) ? "Sauvegardé" : "Sauvegarder"}
                </button>
              </div>
            </div>
          </div>
        </GlassCard>
      </FadeUp>

      <FadeUp custom={1}>
        <GlassCard style={{ padding: 28, marginBottom: 20 }} hover={false}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: t.text, margin: "0 0 18px" }}>Détail du score</h3>
          <ScoreBreakdown scores={opp.scores} />
          <div style={{ marginTop: 16, padding: "12px 16px", background: "rgba(255,255,255,0.03)", borderRadius: 10, border: `1px solid ${t.border}`, fontSize: 13, color: t.textTertiary, lineHeight: 1.6 }}>
            Score calculé sur 5 critères : demande marché (25pts), croissance (25pts), concurrence (20pts), monétisation (15pts) et faisabilité (15pts).
          </div>
        </GlassCard>
      </FadeUp>

      <FadeUp custom={2}>
        <GlassCard style={{ padding: 28, marginBottom: 20 }} hover={false}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: t.text, margin: "0 0 14px" }}>Problématique identifiée</h3>
          <p style={{ color: t.textSecondary, fontSize: 16, lineHeight: 1.8, margin: 0 }}>{opp.problem}</p>
          <div style={{ marginTop: 14, fontSize: 12, color: t.textTertiary }}>Sources : {opp.sources}</div>
        </GlassCard>
      </FadeUp>

      <FadeUp custom={3}>
        <div style={{
          background: t.accentDim, border: `1px solid ${t.borderAccent}`, borderRadius: 16, padding: 28, marginBottom: 20,
          boxShadow: "0 0 40px rgba(129,140,248,0.05)",
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: t.accent, margin: "0 0 14px" }}>Solution proposée</h3>
          <p style={{ color: t.text, fontSize: 16, lineHeight: 1.8, margin: 0 }}>{opp.solution}</p>
        </div>
      </FadeUp>

      <FadeUp custom={4}>
        <GlassCard style={{ padding: 28, marginBottom: 28 }} hover={false}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: t.text, margin: "0 0 14px" }}>Paysage concurrentiel</h3>
          <p style={{ color: t.textSecondary, fontSize: 16, lineHeight: 1.8, margin: 0 }}>{opp.competitors}</p>
        </GlassCard>
      </FadeUp>

      <FadeUp custom={5}>
        <div style={{
          position: "relative", borderRadius: 20, padding: "40px 32px", textAlign: "center", overflow: "hidden",
          border: `1px solid ${t.borderAccent}`,
        }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(129,140,248,0.08) 0%, transparent 70%)" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h3 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 10px", letterSpacing: "-0.02em" }}>
              <span style={{ backgroundImage: "linear-gradient(to right, #A5B4FC, #FFFFFF, #FDA4AF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Cette opportunité vous intéresse ?
              </span>
            </h3>
            <p style={{ color: t.textSecondary, fontSize: 15, margin: "0 0 24px", lineHeight: 1.6 }}>
              On vous accompagne pour transformer cette opportunité en projet concret.
            </p>
            <a href="https://calendly.com/mur-noe-celony/30min" target="_blank" rel="noopener noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "linear-gradient(135deg, #818CF8, #6366F1)", color: "#fff", padding: "14px 32px", borderRadius: 12,
              fontSize: 15, fontWeight: 700, textDecoration: "none", cursor: "pointer", border: "none", fontFamily: "inherit",
              transition: "all 0.3s ease", boxShadow: "0 0 30px rgba(129,140,248,0.25)",
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 50px rgba(129,140,248,0.4)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 30px rgba(129,140,248,0.25)"; e.currentTarget.style.transform = "translateY(0)"; }}>
              Prendre rendez-vous <Icons.arrowRight size={16} color="#fff" />
            </a>
          </div>
        </div>
      </FadeUp>
    </div>
  );
}

function ContactView({ onNavigate }) {
  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <FadeUp>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h2 style={{ fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>
            <span style={{ backgroundImage: "linear-gradient(to right, #A5B4FC, #FFFFFF, #FDA4AF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              On vous accompagne
            </span>
          </h2>
          <p style={{ color: t.textSecondary, fontSize: 16, margin: "14px 0 0", lineHeight: 1.6 }}>
            Vous avez repéré une opportunité ? On vous aide à la transformer en business.
          </p>
        </div>
      </FadeUp>

      <FadeUp custom={1}>
        <GlassCard style={{ padding: 32, marginBottom: 28 }} hover={false} glow>
          <div style={{ display: "grid", gap: 24, marginBottom: 28 }}>
            {[
              { icon: <Icons.radar size={22} color={t.accent} />, title: "Validation de l'idée", desc: "On analyse le marché, la concurrence et la viabilité de votre opportunité." },
              { icon: <Icons.sparkle size={22} color={t.rose} />, title: "Stratégie de lancement", desc: "Plan d'action, MVP, acquisition des premiers clients — tout est structuré." },
              { icon: <Icons.trendUp size={22} color={t.green} />, title: "Accompagnement continu", desc: "Suivi hebdomadaire pour itérer, optimiser et scaler votre projet." },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: t.accentDim, border: `1px solid ${t.borderAccent}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: t.text, marginBottom: 4 }}>{item.title}</div>
                  <div style={{ fontSize: 15, color: t.textSecondary, lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <a href="https://calendly.com/mur-noe-celony/30min" target="_blank" rel="noopener noreferrer" style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            background: "linear-gradient(135deg, #818CF8, #6366F1)", color: "#fff", padding: "16px 32px", borderRadius: 12,
            fontSize: 16, fontWeight: 700, textDecoration: "none", cursor: "pointer",
            transition: "all 0.3s ease", width: "100%", border: "none", fontFamily: "inherit",
            boxShadow: "0 0 30px rgba(129,140,248,0.25)",
          }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 50px rgba(129,140,248,0.4)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 30px rgba(129,140,248,0.25)"; e.currentTarget.style.transform = "translateY(0)"; }}>
            Réserver un appel découverte <Icons.arrowRight size={18} color="#fff" />
          </a>
        </GlassCard>
      </FadeUp>

      <FadeUp custom={2}>
        <div style={{ textAlign: "center", fontSize: 13, color: t.textTertiary, lineHeight: 1.6 }}>
          Appel gratuit de 30 minutes · Sans engagement · On discute de votre projet
        </div>
      </FadeUp>
    </div>
  );
}

// ─── MAIN APP ───
// ─── FAVORITES VIEW ───
function FavoritesView({ opportunities, onSelect, favorites, toggleFav, isFav }) {
  const favOpps = opportunities.filter(o => favorites.includes(o.id)).sort((a, b) => b.score - a.score);

  return (
    <div>
      <FadeUp>
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>
            <span style={{ backgroundImage: "linear-gradient(to right, #FFFFFF, #FB7185)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Mes favoris
            </span>
          </h2>
          <p style={{ color: t.textSecondary, fontSize: 14, margin: "8px 0 0", lineHeight: 1.6 }}>
            {favOpps.length > 0 ? `${favOpps.length} opportunité${favOpps.length > 1 ? "s" : ""} sauvegardée${favOpps.length > 1 ? "s" : ""}` : "Aucune opportunité en favori pour le moment"}
          </p>
        </div>
      </FadeUp>

      {favOpps.length === 0 ? (
        <FadeUp>
          <GlassCard style={{ padding: "48px 32px", textAlign: "center" }} hover={false}>
            <Icons.heartOutline size={48} color={t.textTertiary} />
            <p style={{ color: t.textSecondary, fontSize: 16, margin: "20px 0 8px", fontWeight: 600 }}>Pas encore de favoris</p>
            <p style={{ color: t.textTertiary, fontSize: 14, margin: 0, lineHeight: 1.6 }}>
              Cliquez sur le coeur d'une opportunité pour la sauvegarder ici.
            </p>
          </GlassCard>
        </FadeUp>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {favOpps.map((opp, i) => (
            <FadeUp key={opp.id} custom={i * 0.15}>
              <OpportunityRow opp={opp} onSelect={onSelect} isFav={isFav(opp.id)} toggleFav={toggleFav} />
            </FadeUp>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ───
export default function Trendora() {
  const [view, setView] = useState("home");
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [initialCat, setInitialCat] = useState(null);
  const { favorites, toggle: toggleFav, isFav, count: favCount } = useFavorites();

  const handleSelect = useCallback((opp) => {
    setSelectedOpp(opp);
    setView("detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleBack = useCallback(() => {
    setSelectedOpp(null);
    setView(prev => prev === "detail" ? "home" : prev);
  }, []);

  const handleNavigate = useCallback((target, catId) => {
    setSelectedOpp(null);
    if (catId) setInitialCat(catId);
    else setInitialCat(null);
    setView(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const navItems = [
    { id: "home", label: "Accueil" },
    { id: "top", label: "Top 10" },
    { id: "new", label: "Nouveautés" },
    { id: "categories", label: "Catégories" },
    { id: "favorites", label: "Favoris", badge: favCount },
  ];

  return (
    <div style={{ background: t.bg, minHeight: "100vh", color: t.text, position: "relative", isolation: "isolate" }}>
      <FloatingShapes />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', system-ui, -apple-system, sans-serif; background: ${t.bg}; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        ::selection { background: rgba(129,140,248,0.3); }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @media (max-width: 640px) {
          .nav-desktop { display: none !important; }
          .nav-mobile { display: flex !important; }
        }
        @media (min-width: 641px) {
          .nav-mobile { display: none !important; }
        }
      `}</style>

      {/* ─── HEADER ─── */}
      <header style={{
        background: "rgba(3,3,3,0.8)",
        borderBottom: `1px solid ${t.border}`,
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => { setView("home"); setSelectedOpp(null); }}>
              <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="Trendora" style={{ width: 30, height: 25 }} />
              <span style={{ fontSize: 19, fontWeight: 800, color: t.text, letterSpacing: "-0.02em" }}>Trendora</span>
            </div>
            <nav className="nav-desktop" style={{ display: "flex", gap: 4 }}>
              {navItems.map(item => {
                const active = view === item.id || (view === "detail" && item.id === "home");
                return (
                  <button key={item.id} onClick={() => handleNavigate(item.id)} style={{
                    background: active ? t.accentDim : "transparent",
                    color: active ? t.accent : t.textSecondary,
                    border: `1px solid ${active ? t.borderAccent : "transparent"}`,
                    borderRadius: 8, padding: "7px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600,
                    transition: "all 0.2s ease", fontFamily: "inherit",
                  }}
                    onMouseEnter={!active ? (e) => { e.currentTarget.style.color = t.text; } : undefined}
                    onMouseLeave={!active ? (e) => { e.currentTarget.style.color = t.textSecondary; } : undefined}>
                    {item.id === "favorites" && <Icons.heartFilled size={13} color={active ? t.rose : t.textTertiary} />}
                    {item.label}
                    {item.badge > 0 && (
                      <span style={{ background: t.roseDim, color: t.rose, padding: "1px 7px", borderRadius: 10, fontSize: 11, fontWeight: 700, marginLeft: 2 }}>{item.badge}</span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <a href="https://calendly.com/mur-noe-celony/30min" target="_blank" rel="noopener noreferrer"
            onClick={(e) => { e.preventDefault(); handleNavigate("contact"); }}
            style={{
              background: "linear-gradient(135deg, #818CF8, #6366F1)", color: "#fff", padding: "9px 20px", borderRadius: 10,
              fontSize: 13, fontWeight: 700, textDecoration: "none", cursor: "pointer",
              transition: "all 0.3s ease", border: "none", fontFamily: "inherit",
              display: "flex", alignItems: "center", gap: 6,
              boxShadow: "0 0 20px rgba(129,140,248,0.2)",
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 30px rgba(129,140,248,0.35)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 20px rgba(129,140,248,0.2)"; }}>
            On vous accompagne
          </a>
        </div>

        {/* Mobile nav */}
        <nav className="nav-mobile" style={{ display: "none", padding: "0 24px 12px", gap: 4 }}>
          {navItems.map(item => {
            const active = view === item.id || (view === "detail" && item.id === "home");
            return (
              <button key={item.id} onClick={() => handleNavigate(item.id)} style={{
                flex: 1, background: active ? t.accentDim : "transparent",
                color: active ? t.accent : t.textSecondary,
                border: `1px solid ${active ? t.borderAccent : "transparent"}`,
                borderRadius: 8, padding: "8px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600,
                transition: "all 0.2s ease", fontFamily: "inherit",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
              }}>
                {item.id === "favorites" && <Icons.heartFilled size={11} color={active ? t.rose : t.textTertiary} />}
                {item.label}
                {item.badge > 0 && (
                  <span style={{ background: t.roseDim, color: t.rose, padding: "1px 6px", borderRadius: 8, fontSize: 10, fontWeight: 700 }}>{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>
      </header>

      {/* ─── WEEK BANNER ─── */}
      {view !== "contact" && view !== "home" && (
        <div style={{ borderBottom: `1px solid ${t.border}`, padding: "10px 24px" }}>
          <div style={{ maxWidth: 880, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: t.green, display: "inline-block", boxShadow: `0 0 8px ${t.green}40` }} />
              <span style={{ color: t.textSecondary, fontWeight: 500 }}>{WEEK_LABEL}</span>
              <span style={{ color: t.textTertiary }}>·</span>
              <span style={{ color: t.textTertiary }}>{OPPORTUNITIES.length} opportunités analysées</span>
            </div>
            <span style={{ color: t.textTertiary, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
              <Icons.calendar size={12} color={t.textTertiary} /> Prochain refresh : lundi
            </span>
          </div>
        </div>
      )}

      {/* ─── MAIN CONTENT ─── */}
      <main style={{ maxWidth: view === "home" ? 1200 : 880, margin: "0 auto", padding: view === "home" ? "0 0 64px" : "32px 24px 64px", transition: "max-width 0.3s ease", position: "relative", zIndex: 1 }}>
        {view === "home" && <HomeView opportunities={OPPORTUNITIES} onSelect={handleSelect} onNavigate={handleNavigate} isFav={isFav} toggleFav={toggleFav} />}
        {view === "top" && <TopView opportunities={OPPORTUNITIES} onSelect={handleSelect} isFav={isFav} toggleFav={toggleFav} />}
        {view === "new" && <NewView opportunities={OPPORTUNITIES} onSelect={handleSelect} isFav={isFav} toggleFav={toggleFav} />}
        {view === "categories" && <CategoryView opportunities={OPPORTUNITIES} onSelect={handleSelect} initialCat={initialCat} isFav={isFav} toggleFav={toggleFav} />}
        {view === "detail" && selectedOpp && <DetailView opportunity={selectedOpp} onBack={handleBack} isFav={isFav} toggleFav={toggleFav} />}
        {view === "favorites" && <FavoritesView opportunities={OPPORTUNITIES} onSelect={handleSelect} favorites={favorites} toggleFav={toggleFav} isFav={isFav} />}
        {view === "contact" && <ContactView onNavigate={handleNavigate} />}
      </main>

      {/* ─── FOOTER ─── */}
      <footer style={{ borderTop: `1px solid ${t.border}`, padding: "24px 24px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 880, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12, color: t.textTertiary, flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="Trendora" style={{ width: 18, height: 15, opacity: 0.5 }} />
            <span>Trendora — Radar d'opportunités business propulsé par IA</span>
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>Google Trends · Reddit · Product Hunt · Twitter/X</span>
        </div>
      </footer>
    </div>
  );
}
