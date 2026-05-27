import { useState, useEffect, useRef, useCallback } from 'react';
import { AuthProvider, useAuth } from './AuthContext.jsx';
import { C, PACKAGES, DAYS, SCHEDULE, COUPONS, calcIva, calcTotal, applyDiscount, fmt } from './constants.js';
import { Card, Badge, Btn, Input, Modal, Pill, Avatar, ProgressBar, CouponInput, Toast, ImageSlider } from './components.jsx';
import * as API from './api.js';

// ── Toast manager hook ────────────────────────────────────────────────────────
function useToast() {
  const [toast, setToast] = useState(null);
  const show = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);
  return { toast, show };
}

// ══════════════════════════════════════════════════════════════════════════════
// HOME
// ══════════════════════════════════════════════════════════════════════════════
function HomeScreen({ setScreen }) {
  return (
    <div style={{ paddingBottom: 20 }}>
      <div style={{
        background: `radial-gradient(ellipse 90% 60% at 40% 40%,${C.gold}1a 0%,transparent 60%),
                     radial-gradient(ellipse 60% 50% at 85% 80%,${C.pink}14 0%,transparent 60%),${C.black}`,
        padding: '48px 20px 36px', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${C.gold},transparent)` }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 39px,${C.border}44 40px)`, opacity: .25 }} />
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 4, color: C.gold, textTransform: 'uppercase', marginBottom: 14 }}>EL POBLADO · MEDELLÍN</div>
          <img
            src="https://gluteaddictsmedellin.co/wp-content/uploads/2026/01/Logo-2.png"
            alt="Glute Addicts"
            style={{ height: 70, objectFit: 'contain', marginBottom: 16 }}
            onError={e => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <div style={{ display: 'none', fontSize: 40, fontWeight: 900, lineHeight: 1.1, color: C.white, marginBottom: 6, fontStyle: 'italic' }}>
            GLUTE<br />
            <span style={{ background: `linear-gradient(135deg,${C.gold},${C.pink})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ADDICTS</span>
          </div>
          <div style={{ fontSize: 13, color: C.grayL, margin: '0 auto 24px', lineHeight: 1.6 }}>
            Jumping · Glúteos · Fuerza<br />Salta más alto. Fortalece tus glúteos.
          </div>
          <Btn variant="primary" onClick={() => setScreen('schedule')}>🎯 Reserva tu clase</Btn>
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>

        {/* Image Slider */}
        <div style={{ marginTop: 20 }}>
          <ImageSlider />
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, margin: '20px 0' }}>
          {[
            { icon: '🔥', val: '60', lbl: 'Minutos' },
            { icon: '💪', val: '7 días', lbl: '+ Festivos' },
            { icon: '📍', val: 'Poblado', lbl: 'El Poblado' },
          ].map(s => (
            <Card key={s.val} style={{ textAlign: 'center', padding: '14px 8px' }}>
              <div style={{ fontSize: 22 }}>{s.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: C.gold }}>{s.val}</div>
              <div style={{ fontSize: 10, color: C.gray }}>{s.lbl}</div>
            </Card>
          ))}
        </div>

        {/* Address bar */}
        <div style={{ background: C.card, borderRadius: 12, padding: '12px 16px', marginBottom: 16, border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 12, color: C.grayL, marginBottom: 4 }}>📍 Cra. 35 #7-86, El Poblado, Medellín, Antioquia</div>
          <div style={{ fontSize: 12, color: C.gold, fontWeight: 700 }}>🗓 7 días a la semana + festivos</div>
        </div>

        <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, color: C.gray, textTransform: 'uppercase', marginBottom: 12 }}>Nuestras Clases</div>
        {[
          { icon: '🦘', name: 'Solo Jumping', desc: 'Potencia explosiva y cardio de alta intensidad', dur: '60 min', color: C.gold },
          { icon: '🍑', name: 'Glúteos + Jumping', desc: 'Saltos explosivos + fuerza específica de glúteos', dur: '60 min (30+30)', color: C.pink },
        ].map(cls => (
          <Card key={cls.name} style={{ marginBottom: 12 }} onClick={() => setScreen('schedule')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ fontSize: 30, width: 48, height: 48, background: cls.color + '22', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{cls.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, color: C.white, marginBottom: 4 }}>{cls.name}</div>
                <div style={{ fontSize: 12, color: C.gray, marginBottom: 6 }}>{cls.desc}</div>
                <Badge color={cls.color}>⏱ {cls.dur}</Badge>
