import { useState } from 'react';
import { C, COUPONS } from './constants.js';

export function Pill({ children, color = C.gold, onClick, active }) {
  return (
    <button onClick={onClick} style={{
      background: active ? color : 'transparent',
      border: `1.5px solid ${color}`,
      color: active ? C.black : color,
      borderRadius: 99, padding: '7px 18px',
      fontSize: 13, fontWeight: 700,
      cursor: 'pointer', transition: 'all .2s', letterSpacing: .5,
      fontFamily: 'inherit', whiteSpace: 'nowrap',
    }}>{children}</button>
  );
}

export function Avatar({ name = 'GA', size = 36 }) {
  const i = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `linear-gradient(135deg,${C.gold},${C.pink})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * .35, fontWeight: 800, color: C.black, flexShrink: 0,
    }}>{i}</div>
  );
}

export function Card({ children, style = {}, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: C.card, borderRadius: 16,
      border: `1px solid ${C.border}`,
      padding: '16px', cursor: onClick ? 'pointer' : 'default',
      transition: 'border-color .15s', ...style,
    }}
    onMouseEnter={e => onClick && (e.currentTarget.style.borderColor = C.gold)}
    onMouseLeave={e => onClick && (e.currentTarget.style.borderColor = C.border)}
    >{children}</div>
  );
}

export function Badge({ children, color = C.gold }) {
  return (
    <span style={{
      background: color + '22', color,
      border: `1px solid ${color}44`,
      borderRadius: 99, padding: '3px 10px',
      fontSize: 10, fontWeight: 700, letterSpacing: .6, textTransform: 'uppercase',
    }}>{children}</span>
  );
}

export function ProgressBar({ value, max, color = C.gold }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div style={{ background: C.border, borderRadius: 99, height: 6, overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', borderRadius: 99, background: `linear-gradient(90deg,${color},${color}88)`, transition: 'width .5s' }} />
    </div>
  );
}

export function Btn({ children, variant = 'primary', full, small, onClick, disabled, style = {}, loading }) {
  const map = {
    primary: { background: `linear-gradient(135deg,${C.gold},${C.goldD})`, color: C.black },
    pink:    { background: `linear-gradient(135deg,${C.pink},#c0356a)`,    color: C.white },
    purple:  { background: `linear-gradient(135deg,${C.purple},#6a3fd6)`,  color: C.white },
    outline: { background: 'transparent', border: `1.5px solid ${C.gold}`, color: C.gold },
    ghost:   { background: 'transparent', color: C.grayL },
    danger:  { background: C.danger + '22', border: `1.5px solid ${C.danger}`, color: C.danger },
    success: { background: C.success + '22', border: `1.5px solid ${C.success}`, color: C.success },
  };
  const s = map[variant] || map.primary;
  return (
    <button onClick={onClick} disabled={disabled || loading} style={{
      ...s,
      borderRadius: 12, padding: small ? '8px 16px' : '13px 24px',
      fontSize: small ? 12 : 14, fontWeight: 700,
      width: full ? '100%' : 'auto',
      cursor: (disabled || loading) ? 'not-allowed' : 'pointer',
      opacity: (disabled || loading) ? .55 : 1,
      border: s.border || 'none',
      letterSpacing: .3, transition: 'all .2s',
      fontFamily: 'inherit', ...style,
    }}>
      {loading ? '⏳ Cargando...' : children}
    </button>
  );
}

export function Input({ label, type = 'text', value, onChange, placeholder, icon, suffix }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <div style={{ fontSize: 11, fontWeight: 700, color: C.gray, letterSpacing: .8, textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>}
      <div style={{ position: 'relative' }}>
        {icon && <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16, pointerEvents: 'none' }}>{icon}</div>}
        <input
          type={type} value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%', boxSizing: 'border-box',
            background: C.surface, border: `1.5px solid ${C.border}`,
            borderRadius: 10, padding: icon ? '11px 14px 11px 38px' : '11px 14px',
            color: C.white, fontSize: 14, fontFamily: 'inherit', outline: 'none',
          }}
          onFocus={e => e.target.style.borderColor = C.gold}
          onBlur={e => e.target.style.borderColor = C.border}
        />
      </div>
      {suffix && <div style={{ fontSize: 11, color: C.gray, marginTop: 4 }}>{suffix}</div>}
    </div>
  );
}

export function Modal({ show, onClose, title, children }) {
  if (!show) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,.85)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: C.dark, borderRadius: '24px 24px 0 0',
        border: `1px solid ${C.border}`, width: '100%', maxWidth: 430,
        maxHeight: '92vh', overflowY: 'auto',
        padding: '24px 20px 40px',
        animation: 'slideUp .28s ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.white }}>{title}</div>
          <button onClick={onClose} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', color: C.grayL, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Toast({ message, type = 'success', onDone }) {
  const colors = { success: C.success, error: C.danger, info: C.gold };
  return (
    <div style={{
      position: 'fixed', top: 60, left: '50%', transform: 'translateX(-50%)',
      zIndex: 9999, background: colors[type] + 'ee',
      color: C.white, padding: '12px 20px', borderRadius: 12,
      fontWeight: 700, fontSize: 13, maxWidth: 320, textAlign: 'center',
      boxShadow: '0 4px 24px rgba(0,0,0,.4)',
      animation: 'slideDown .3s ease',
    }}>{message}</div>
  );
}

// ── Coupon input ──────────────────────────────────────────────────────────────
export function CouponInput({ onApply, applied }) {
  const [code, setCode]       = useState('');
  const [error, setError]     = useState('');
  const [checking, setCheck]  = useState(false);

  function apply() {
    const upper = code.trim().toUpperCase();
    if (!upper) return;
    setCheck(true); setError('');
    // In production this would hit the WP API to validate
    setTimeout(() => {
      setCheck(false);
      if (COUPONS[upper]) {
        onApply(upper, COUPONS[upper]);
        setCode('');
      } else {
        setError('Cupón inválido o expirado.');
      }
    }, 700);
  }

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: C.gray, letterSpacing: .8, textTransform: 'uppercase', marginBottom: 6 }}>🏷️ Código de descuento</div>
      {applied ? (
        <div style={{ background: C.success + '22', border: `1px solid ${C.success}44`, borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.success }}>✓ {applied.code}</div>
            <div style={{ fontSize: 11, color: C.grayL }}>{applied.label}</div>
          </div>
          <button onClick={() => onApply(null, null)} style={{ background: 'none', border: 'none', color: C.danger, cursor: 'pointer', fontSize: 18 }}>✕</button>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              placeholder="Ej: GLUTE10"
              onKeyDown={e => e.key === 'Enter' && apply()}
              style={{ flex: 1, background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 10, padding: '11px 14px', color: C.white, fontSize: 13, fontFamily: 'inherit', outline: 'none', letterSpacing: 1, textTransform: 'uppercase' }}
              onFocus={e => e.target.style.borderColor = C.gold}
              onBlur={e => e.target.style.borderColor = C.border}
            />
            <Btn variant="outline" small onClick={apply} disabled={!code || checking}>{checking ? '...' : 'Aplicar'}</Btn>
          </div>
          {error && <div style={{ fontSize: 11, color: C.danger, marginTop: 6 }}>⚠️ {error}</div>}
        </>
      )}
    </div>
  );
}

// ── Price breakdown ───────────────────────────────────────────────────────────
export function PriceBreakdown({ basePrice, coupon, splitParts = 1 }) {
  const { calcIva, calcTotal, applyDiscount, fmt } = require('./constants.js');
  // re-imported inline to avoid circular — use direct math instead:
  const iva          = Math.round(basePrice * 0.19);
  const withIva      = basePrice + iva;
  const discountAmt  = coupon ? withIva - (coupon.data?.type === 'percent' ? Math.round(withIva * (1 - coupon.data.value / 100)) : Math.max(0, withIva - (coupon.data?.value || 0))) : 0;
  const afterDisc    = withIva - discountAmt;
  const myShare      = splitParts > 1 ? Math.round(afterDisc / splitParts) : afterDisc;

  const fmtN = n => '$' + Number(Math.round(n)).toLocaleString('es-CO') + ' COP';

  return (
    <div style={{ background: C.surface, borderRadius: 12, padding: 14, marginBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: C.gray, letterSpacing: .8, textTransform: 'uppercase', marginBottom: 10 }}>Resumen de pago</div>
      {[
        { label: 'Precio base',  val: fmtN(basePrice),   color: C.grayL },
        { label: 'IVA (19%)',    val: fmtN(iva),          color: C.grayL },
        coupon?.code && { label: `Descuento (${coupon.code})`, val: `-${fmtN(discountAmt)}`, color: C.success },
        splitParts > 1 && { label: `Tu parte (÷${splitParts})`, val: fmtN(myShare), color: C.gold, bold: true },
      ].filter(Boolean).map((r, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7, fontSize: 13 }}>
          <span style={{ color: C.gray }}>{r.label}</span>
          <span style={{ color: r.color, fontWeight: r.bold ? 800 : 400 }}>{r.val}</span>
        </div>
      ))}
      <div style={{ height: 1, background: C.border, margin: '10px 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 800, color: C.white }}>Total a pagar</span>
        <span style={{ fontWeight: 900, fontSize: 16, color: C.gold }}>{fmtN(myShare)}</span>
      </div>
    </div>
  );
}
