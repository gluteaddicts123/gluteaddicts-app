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
  crossOrigin="anonymous"
  style={{ height: 70, objectFit: 'contain', marginBottom: 16, display: 'block', margin: '0 auto 16px' }}
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
              </div>
              <div style={{ color: C.gold, fontSize: 18 }}>›</div>
            </div>
          </Card>
        ))}

        <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, color: C.gray, textTransform: 'uppercase', margin: '20px 0 12px' }}>Paquetes</div>
        {PACKAGES.map(pkg => (
          <Card key={pkg.id} style={{ marginBottom: 10, position: 'relative', overflow: 'hidden' }} onClick={() => setScreen('packages')}>
            {pkg.popular && <div style={{ position: 'absolute', top: 0, right: 0, background: `linear-gradient(135deg,${C.pink},${C.gold})`, color: C.black, fontSize: 9, fontWeight: 900, padding: '4px 12px', borderRadius: '0 16px 0 10px', letterSpacing: .8 }}>MÁS POPULAR</div>}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: 26 }}>{pkg.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, color: C.white }}>{pkg.name}</div>
                <div style={{ fontSize: 11, color: C.gray }}>{pkg.unlimited ? 'Ilimitado' : `${pkg.sessions} sesiones`} · {pkg.validity}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 900, color: pkg.color, fontSize: 15 }}>{fmt(pkg.basePrice)}</div>
                <div style={{ fontSize: 10, color: C.gray }}>+ IVA 19%</div>
              </div>
            </div>
          </Card>
        ))}
        <Btn variant="outline" full style={{ marginTop: 4 }} onClick={() => setScreen('packages')}>Ver todos los paquetes →</Btn>

        <div style={{ marginTop: 20, background: `${C.gold}11`, border: `1px solid ${C.gold}33`, borderRadius: 14, padding: '14px 16px', fontSize: 12, color: C.grayL, lineHeight: 1.7 }}>
          ⚠️ <strong style={{ color: C.gold }}>Aviso:</strong> Clases sujetas a disponibilidad. Ingreso con calcetines obligatorio. No se permite ingreso con más de 5 min de retraso.
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SCHEDULE
// ══════════════════════════════════════════════════════════════════════════════
function ScheduleScreen() {
  const { user }                    = useAuth();
  const [type, setType]             = useState('jumping');
  const [day, setDay]               = useState(DAYS[0]);
  const [booked, setBooked]         = useState({});
  const [bookingKey, setBookingKey] = useState(null);
  const [cpId, setCpId]             = useState('');
  const [loading, setLoading]       = useState(false);
  const { show }                    = useToast();

  const slots = SCHEDULE[type][day] || [];

  async function reserve(slot) {
    if (!user) { show('Debes iniciar sesión para reservar.', 'error'); return; }
    const key = `${type}-${day}-${slot}`;
    if (!cpId) { setBookingKey(key); return; }
    setLoading(true);
    try {
      await API.createBooking({
        customer_package_id: parseInt(cpId),
        service_name: type === 'jumping' ? 'Solo Jumping' : 'Glúteos + Jumping',
        booking_date: '2026-06-01',
        booking_time: slot,
      });
      setBooked({ ...booked, [key]: true });
      show('¡Clase reservada! Te esperamos 💪');
    } catch (e) {
      show(e.message || 'Error al reservar.', 'error');
    }
    setLoading(false);
  }

  return (
    <div style={{ padding: '20px 16px' }}>
      <div style={{ fontSize: 22, fontWeight: 900, color: C.white, marginBottom: 4 }}>Horarios</div>
      <div style={{ fontSize: 13, color: C.gray, marginBottom: 20 }}>7 días a la semana + festivos · Mañana & Tarde</div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 18, overflowX: 'auto', paddingBottom: 4 }}>
        <Pill active={type === 'jumping'} onClick={() => setType('jumping')}>🦘 Solo Jumping</Pill>
        <Pill active={type === 'combo'} onClick={() => setType('combo')} color={C.pink}>🍑 Glúteos + Jumping</Pill>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
        {DAYS.map(d => (
          <button key={d} onClick={() => setDay(d)} style={{ minWidth: 44, height: 56, borderRadius: 12, border: 'none', background: day === d ? `linear-gradient(135deg,${C.gold},${C.goldD})` : C.surface, color: day === d ? C.black : C.grayL, fontWeight: 800, fontSize: 11, cursor: 'pointer', flexShrink: 0, fontFamily: 'inherit' }}>{d}</button>
        ))}
      </div>

      {slots.map(t => {
        const key = `${type}-${day}-${t}`;
        return (
          <Card key={t} style={{ marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 800, color: C.white, fontSize: 17 }}>{t}</div>
              <div style={{ fontSize: 11, color: C.gray, marginTop: 2 }}>60 min · Cupos disponibles</div>
            </div>
            {booked[key]
              ? <Badge color={C.success}>✓ Reservado</Badge>
              : <Btn variant="primary" small onClick={() => reserve(t)} loading={loading}>Reservar</Btn>}
          </Card>
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PACKAGES
// ══════════════════════════════════════════════════════════════════════════════
function PackagesScreen({ setScreen, setCheckoutPkg }) {
  return (
    <div style={{ padding: '20px 16px' }}>
      <div style={{ fontSize: 22, fontWeight: 900, color: C.white, marginBottom: 4 }}>Paquetes</div>
      <div style={{ fontSize: 13, color: C.gray, marginBottom: 6 }}>Precios sin IVA — IVA del 19% se suma al total</div>
      <div style={{ background: `${C.gold}11`, border: `1px solid ${C.gold}33`, borderRadius: 10, padding: '10px 14px', marginBottom: 20, fontSize: 12, color: C.grayL }}>
        🏷️ ¿Tienes código de descuento? Ingrésalo al momento del pago.
      </div>

      {PACKAGES.map(pkg => {
        const iva   = calcIva(pkg.basePrice);
        const total = calcTotal(pkg.basePrice);
        const vBtn  = pkg.id === 1 ? 'primary' : pkg.id === 2 ? 'pink' : 'purple';
        return (
          <div key={pkg.id} style={{ marginBottom: 18, position: 'relative' }}>
            {pkg.popular && <div style={{ position: 'absolute', top: -11, right: 16, zIndex: 1, background: `linear-gradient(135deg,${C.pink},${C.gold})`, color: C.black, fontSize: 10, fontWeight: 900, padding: '4px 14px', borderRadius: 99, letterSpacing: .8 }}>⭐ MÁS POPULAR</div>}
            <Card style={{ border: `1.5px solid ${pkg.popular ? C.pink : pkg.id === 3 ? C.purple : C.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 30, marginBottom: 4 }}>{pkg.icon}</div>
                  <div style={{ fontWeight: 900, color: C.white, fontSize: 19 }}>{pkg.name}</div>
                  <div style={{ fontSize: 12, color: C.gray }}>{pkg.subtitle}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: pkg.color }}>{fmt(pkg.basePrice)}</div>
                  <div style={{ fontSize: 11, color: C.gray }}>+ IVA (19%) {fmt(iva)}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.grayL }}>Total: {fmt(total)}</div>
                  {!pkg.unlimited && <div style={{ fontSize: 10, color: pkg.color, fontWeight: 700, marginTop: 2 }}>{fmt(total / pkg.sessions)}/clase</div>}
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                {pkg.perks.map(p => (
                  <div key={p} style={{ fontSize: 12, color: C.grayL, marginBottom: 5, display: 'flex', gap: 8 }}>
                    <span style={{ color: pkg.color }}>✓</span>{p}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                <Badge color={pkg.color}>📅 {pkg.validity}</Badge>
                {pkg.canShare  && <Badge color={C.success}>👥 Compartible</Badge>}
                {pkg.canShare  && <Badge color={C.gold}>💳 Pago dividido</Badge>}
                {pkg.unlimited && <Badge color={pkg.color}>∞ Ilimitado</Badge>}
                <Badge color={C.gold}>🏷️ Acepta cupones</Badge>
              </div>
              <Btn variant={vBtn} full onClick={() => { setCheckoutPkg(pkg); setScreen('checkout'); }}>
                Comprar con Wompi →
              </Btn>
            </Card>
          </div>
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CHECKOUT
// ══════════════════════════════════════════════════════════════════════════════
function CheckoutScreen({ pkg, setScreen }) {
  const { user }                    = useAuth();
  const { show, toast }             = useToast();
  const [step, setStep]             = useState(1);
  const [splitMode, setSplit]       = useState(false);
  const [members, setMembers]       = useState([]);
  const [newName, setNewName]       = useState('');
  const [newEmail, setNewEmail]     = useState('');
  const [coupon, setCoupon]         = useState(null);
  const [payMethod, setPayMethod]   = useState('');
  const [cardNum, setCardNum]       = useState('');
  const [cardExp, setCardExp]       = useState('');
  const [cardCvv, setCardCvv]       = useState('');
  const [processing, setProcessing] = useState(false);
  const [cpId, setCpId]             = useState(null);

  if (!pkg) { setScreen('packages'); return null; }
  if (!user) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
        <div style={{ fontWeight: 800, color: C.white, marginBottom: 8 }}>Debes iniciar sesión</div>
        <div style={{ fontSize: 13, color: C.gray, marginBottom: 24 }}>Para comprar un paquete necesitas una cuenta.</div>
        <Btn variant="primary" full onClick={() => setScreen('profile')}>Iniciar sesión / Registrarse</Btn>
      </div>
    );
  }

  const base      = pkg.basePrice;
  const iva       = calcIva(base);
  const withIva   = base + iva;
  const afterDisc = applyDiscount(withIva, coupon?.data);
  const discAmt   = withIva - afterDisc;
  const parts     = splitMode && members.length > 0 ? members.length + 1 : 1;
  const myShare   = Math.round(afterDisc / parts);
  const vBtn      = pkg.id === 1 ? 'primary' : pkg.id === 2 ? 'pink' : 'purple';

  function applyCoupon(code, data) { setCoupon(code && data ? { code, data, label: data.label } : null); }

  function addMember() {
    if (!newName || !newEmail || members.length >= pkg.maxMembers) return;
    setMembers([...members, { name: newName, email: newEmail }]);
    setNewName(''); setNewEmail('');
  }

  async function pay() {
    if (!payMethod) return;
    setProcessing(true);
    try {
      const res    = await API.buyPackage(pkg.id);
      setCpId(res.customer_package_id);
      const params = await API.initiatePayment(res.customer_package_id, myShare);
      API.openWompiWidget(params, () => {
        setProcessing(false);
        setStep(4);
      });
    } catch (e) {
      show(e.message || 'Error al procesar el pago.', 'error');
      setProcessing(false);
    }
  }

  if (step === 4) return (
    <div style={{ padding: '40px 20px', textAlign: 'center' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
      <div style={{ fontSize: 24, fontWeight: 900, color: C.white, marginBottom: 8 }}>¡Pago exitoso!</div>
      <div style={{ fontSize: 14, color: C.gray, marginBottom: 6 }}>Tu paquete <strong style={{ color: pkg.color }}>{pkg.name}</strong> está activo</div>
      {coupon && <div style={{ fontSize: 13, color: C.success, marginBottom: 12 }}>Cupón {coupon.code} aplicado — ahorraste {fmt(discAmt)}</div>}
      <div style={{ background: C.success + '22', border: `1px solid ${C.success}44`, borderRadius: 16, padding: 20, marginBottom: 24, textAlign: 'left' }}>
        {[['Paquete', pkg.name], [pkg.unlimited ? 'Tipo' : 'Sesiones', pkg.unlimited ? 'Ilimitado' : pkg.sessions], ['Vigencia', pkg.validity], ['Pagado', fmt(myShare)]].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: C.grayL, marginBottom: 6 }}>
            <span style={{ color: C.gray }}>{k}</span><span>{v}</span>
          </div>
        ))}
      </div>
      <Btn variant={vBtn} full onClick={() => setScreen('my-packages')}>Ver mis paquetes →</Btn>
      <Btn variant="ghost" full style={{ marginTop: 10 }} onClick={() => setScreen('home')}>Ir al inicio</Btn>
    </div>
  );

  return (
    <div style={{ padding: '20px 16px' }}>
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
        {['Detalle', 'Compartir', 'Pago'].map((s, i) => (
          <div key={s} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ height: 3, borderRadius: 99, background: step > i ? pkg.color : C.border, marginBottom: 6, transition: 'background .3s' }} />
            <div style={{ fontSize: 10, color: step > i ? pkg.color : C.gray, fontWeight: 700 }}>{s}</div>
          </div>
        ))}
      </div>

      {step === 1 && <>
        <Card style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 26 }}>{pkg.icon}</div>
              <div style={{ fontWeight: 800, color: C.white, fontSize: 16 }}>{pkg.name}</div>
              <div style={{ fontSize: 12, color: C.gray }}>{pkg.unlimited ? 'Ilimitado' : `${pkg.sessions} sesiones`} · {pkg.validity}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: pkg.color }}>{fmt(base)}</div>
              <div style={{ fontSize: 11, color: C.gray }}>+ IVA (19%) {fmt(iva)}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.grayL }}>Total: {fmt(withIva)}</div>
            </div>
          </div>
        </Card>

        <CouponInput onApply={applyCoupon} applied={coupon} />

        <div style={{ background: C.surface, borderRadius: 12, padding: 14, marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.gray, letterSpacing: .8, textTransform: 'uppercase', marginBottom: 10 }}>Resumen de pago</div>
          {[
            { label: 'Precio del paquete', val: fmt(base), color: C.grayL },
            { label: '+ IVA (19%)',        val: fmt(iva),  color: C.grayL },
            coupon && { label: `Descuento (${coupon.code})`, val: `-${fmt(discAmt)}`, color: C.success },
          ].filter(Boolean).map((r, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 7 }}>
              <span style={{ color: C.gray }}>{r.label}</span>
              <span style={{ color: r.color }}>{r.val}</span>
            </div>
          ))}
          <div style={{ height: 1, background: C.border, margin: '10px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 800, color: C.white }}>Total a pagar</span>
            <span style={{ fontWeight: 900, fontSize: 16, color: C.gold }}>{fmt(afterDisc)}</span>
          </div>
        </div>

        {pkg.canShare && (
          <Card style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, color: C.white }}>👥 Pago dividido</div>
                <div style={{ fontSize: 12, color: C.gray, marginTop: 2 }}>Invita y comparte el costo</div>
              </div>
              <div onClick={() => setSplit(!splitMode)} style={{ width: 44, height: 24, borderRadius: 99, background: splitMode ? C.gold : C.grayD, cursor: 'pointer', position: 'relative', transition: 'background .2s' }}>
                <div style={{ position: 'absolute', top: 3, left: splitMode ? 22 : 3, width: 18, height: 18, borderRadius: '50%', background: C.white, transition: 'left .2s' }} />
              </div>
            </div>
          </Card>
        )}
        <Btn variant={vBtn} full onClick={() => setStep(pkg.canShare && splitMode ? 2 : 3)}>
          {pkg.canShare && splitMode ? 'Siguiente: Agregar personas →' : 'Siguiente: Pagar →'}
        </Btn>
        <Btn variant="ghost" full style={{ marginTop: 10 }} onClick={() => setScreen('packages')}>← Volver</Btn>
      </>}

      {step === 2 && <>
        <div style={{ fontWeight: 800, color: C.white, marginBottom: 4 }}>Invitar personas</div>
        <div style={{ fontSize: 13, color: C.gray, marginBottom: 16 }}>Máx. {pkg.maxMembers} personas. Cada una paga su parte vía Wompi.</div>
        {members.map((m, i) => (
          <Card key={i} style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar name={m.name} size={38} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: C.white, fontSize: 13 }}>{m.name}</div>
              <div style={{ fontSize: 11, color: C.gray }}>{m.email}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.gold }}>{fmt(Math.round(afterDisc / (members.length + 1)))}</div>
              <Badge color={C.gold}>Pendiente</Badge>
            </div>
          </Card>
        ))}
        {members.length < pkg.maxMembers && (
          <Card style={{ marginBottom: 14 }}>
            <Input label="Nombre" value={newName} onChange={setNewName} placeholder="Nombre completo" icon="👤" />
            <Input label="Correo" type="email" value={newEmail} onChange={setNewEmail} placeholder="correo@ejemplo.com" icon="✉️" />
            <Btn variant="outline" full small onClick={addMember} disabled={!newName || !newEmail}>+ Agregar persona</Btn>
          </Card>
        )}
        <div style={{ background: `${C.gold}11`, border: `1px solid ${C.gold}33`, borderRadius: 12, padding: 14, marginBottom: 16 }}>
          <div style={{ fontWeight: 700, color: C.gold, marginBottom: 10 }}>💳 División</div>
          {[{ label: 'Tú (titular)', share: Math.round(afterDisc / (members.length + 1)) }, ...members.map(m => ({ label: m.name, share: Math.round(afterDisc / (members.length + 1)) }))].map((r, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
              <span style={{ color: C.grayL }}>{r.label}</span>
              <span style={{ color: C.white, fontWeight: 700 }}>{fmt(r.share)}</span>
            </div>
          ))}
          <div style={{ height: 1, background: C.border, margin: '8px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: C.gray }}>Total</span>
            <span style={{ color: C.gold, fontWeight: 800 }}>{fmt(afterDisc)}</span>
          </div>
        </div>
        <Btn variant={vBtn} full onClick={() => setStep(3)}>Siguiente: Pagar mi parte →</Btn>
        <Btn variant="ghost" full style={{ marginTop: 10 }} onClick={() => setStep(1)}>← Volver</Btn>
      </>}

      {step === 3 && <>
        <div style={{ fontWeight: 800, color: C.white, marginBottom: 4 }}>Pagar con Wompi</div>
        <div style={{ fontSize: 13, color: C.gray, marginBottom: 16 }}>Selecciona tu método de pago</div>
        <div style={{ background: C.surface, borderRadius: 12, padding: 14, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: C.gray, fontSize: 13 }}>Total a pagar</span>
            <span style={{ fontWeight: 900, fontSize: 18, color: C.gold }}>{fmt(myShare)}</span>
          </div>
        </div>
        {[
          { id: 'card',      icon: '💳', label: 'Tarjeta crédito / débito' },
          { id: 'nequi',     icon: '📱', label: 'Nequi' },
          { id: 'daviplata', icon: '🏦', label: 'Daviplata' },
          { id: 'pse',       icon: '🏛️', label: 'PSE — Transferencia bancaria' },
        ].map(m => (
          <Card key={m.id} style={{ marginBottom: 10, cursor: 'pointer', border: payMethod === m.id ? `1.5px solid ${pkg.color}` : `1px solid ${C.border}` }} onClick={() => setPayMethod(m.id)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 22 }}>{m.icon}</span>
              <span style={{ flex: 1, fontWeight: 600, color: C.white, fontSize: 13 }}>{m.label}</span>
              <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${payMethod === m.id ? pkg.color : C.grayD}`, background: payMethod === m.id ? pkg.color : 'transparent', transition: 'all .2s', flexShrink: 0 }} />
            </div>
          </Card>
        ))}
        {payMethod === 'card' && (
          <Card style={{ marginTop: 12 }}>
            <Input label="Número de tarjeta" value={cardNum} onChange={v => setCardNum(v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim())} placeholder="0000 0000 0000 0000" icon="💳" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <Input label="Vencimiento" value={cardExp} onChange={v => setCardExp(v.replace(/\D/g, '').slice(0, 4).replace(/^(\d{2})(\d)/, '$1/$2'))} placeholder="MM/AA" />
              <Input label="CVV" type="password" value={cardCvv} onChange={v => setCardCvv(v.replace(/\D/g, '').slice(0, 3))} placeholder="123" />
            </div>
          </Card>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '16px 0 8px' }}>
          <span style={{ fontSize: 11, color: C.gray }}>Pagos seguros con</span>
          <span style={{ background: '#00A651', borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 900, color: '#fff' }}>wompi</span>
        </div>
        <Btn variant={vBtn} full onClick={pay} disabled={!payMethod || processing} loading={processing}>
          {`Pagar ${fmt(myShare)}`}
        </Btn>
        <div style={{ fontSize: 10, color: C.grayD, textAlign: 'center', marginTop: 8 }}>🔒 Pago encriptado · Wompi Colombia</div>
        <Btn variant="ghost" full style={{ marginTop: 8 }} onClick={() => setStep(splitMode ? 2 : 1)}>← Volver</Btn>
      </>}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MY PACKAGES
// ══════════════════════════════════════════════════════════════════════════════
function MyPackagesScreen({ setScreen }) {
  const { user }                    = useAuth();
  const [pkgs, setPkgs]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [activePkg, setActivePkg]   = useState(null);
  const [invName, setInvName]       = useState('');
  const [invEmail, setInvEmail]     = useState('');
  const [invSent, setInvSent]       = useState(false);
  const [invLoading, setInvLoading] = useState(false);
  const { show, toast }             = useToast();

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    API.getMyPackages()
      .then(data => { setPkgs([...(data.owned || []), ...(data.shared || [])]); })
      .catch(() => show('Error al cargar paquetes.', 'error'))
      .finally(() => setLoading(false));
  }, [user]);

  async function sendInvite() {
    if (!invName || !invEmail) return;
    setInvLoading(true);
    try {
      await API.inviteMember(activePkg.id, invName, invEmail);
      setInvSent(true);
      setTimeout(() => { setShowInvite(false); setInvSent(false); setInvName(''); setInvEmail(''); }, 1800);
    } catch (e) {
      show(e.message || 'Error al invitar.', 'error');
    }
    setInvLoading(false);
  }

  if (!user) return (
    <div style={{ padding: '40px 20px', textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
      <div style={{ fontWeight: 800, color: C.white, marginBottom: 8 }}>Inicia sesión</div>
      <div style={{ fontSize: 13, color: C.gray, marginBottom: 24 }}>Para ver tus paquetes necesitas una cuenta.</div>
      <Btn variant="primary" full onClick={() => setScreen('profile')}>Iniciar sesión / Registrarse</Btn>
    </div>
  );

  return (
    <div style={{ padding: '20px 16px' }}>
      {toast && <Toast message={toast.message} type={toast.type} />}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 900, color: C.white }}>Mis Paquetes</div>
          <div style={{ fontSize: 13, color: C.gray }}>Sesiones y reservas activas</div>
        </div>
        <Btn variant="primary" small onClick={() => setScreen('packages')}>+ Comprar</Btn>
      </div>

      {loading && <div style={{ textAlign: 'center', color: C.gray, padding: '32px 0' }}>⏳ Cargando...</div>}

      {!loading && pkgs.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
          <div style={{ fontWeight: 700, color: C.white, marginBottom: 8 }}>Sin paquetes activos</div>
          <div style={{ fontSize: 13, color: C.gray, marginBottom: 20 }}>Compra tu primer paquete y empieza a entrenar</div>
          <Btn variant="primary" onClick={() => setScreen('packages')}>Ver paquetes</Btn>
        </div>
      )}

      {pkgs.map(pkg => {
        const pkgDef    = PACKAGES.find(p => p.id === parseInt(pkg.package_id)) || {};
        const isUnlim   = pkgDef.unlimited;
        const used      = parseInt(pkg.sessions_used) || 0;
        const total     = parseInt(pkg.sessions_total) || 1;
        const remaining = isUnlim ? '∞' : total - used;
        const color     = pkgDef.color || C.gold;

        return (
          <Card key={pkg.id} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 22, marginBottom: 4 }}>{pkgDef.icon || '📦'}</div>
                <div style={{ fontWeight: 900, color: C.white, fontSize: 17 }}>{pkg.package_name}</div>
                <div style={{ fontSize: 11, color: C.gray }}>Vence: {new Date(pkg.expiry_date).toLocaleDateString('es-CO')}</div>
              </div>
              <Badge color={pkg.status === 'active' ? C.success : C.danger}>
                {pkg.status === 'active' ? '✓ Activo' : pkg.status}
              </Badge>
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: C.gray, marginBottom: 6 }}>
                <span>Sesiones usadas: {used}{isUnlim ? '' : `/${total}`}</span>
                <span style={{ color, fontWeight: 700 }}>{remaining} restantes</span>
              </div>
              {isUnlim
                ? <div style={{ background: color + '22', border: `1px solid ${color}44`, borderRadius: 8, padding: '6px 12px', fontSize: 12, color, fontWeight: 700 }}>∞ Clases ilimitadas</div>
                : <ProgressBar value={used} max={total} color={color} />}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {pkg.status === 'active' && <Btn variant="primary" small onClick={() => setScreen('schedule')}>📅 Reservar</Btn>}
              {pkgDef.canShare && pkg.status === 'active' && (
                <Btn variant="outline" small onClick={() => { setActivePkg(pkg); setShowInvite(true); }}>👥 Invitar</Btn>
              )}
              {pkg.payment_status !== 'paid' && (
                <Btn variant="danger" small onClick={() => setScreen('packages')}>💳 Pagar pendiente</Btn>
              )}
            </div>
          </Card>
        );
      })}

      <Modal show={showInvite} onClose={() => setShowInvite(false)} title="Invitar persona">
        {invSent ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <div style={{ fontWeight: 800, color: C.success }}>¡Invitación enviada!</div>
            <div style={{ fontSize: 13, color: C.gray, marginTop: 6 }}>Recibirá un enlace para pagar su parte vía Wompi.</div>
          </div>
        ) : <>
          <div style={{ fontSize: 13, color: C.gray, marginBottom: 16 }}>Recibirán un correo con enlace para pagar y acceder al paquete.</div>
          <Input label="Nombre" value={invName} onChange={setInvName} placeholder="Nombre completo" icon="👤" />
          <Input label="Correo" type="email" value={invEmail} onChange={setInvEmail} placeholder="correo@ejemplo.com" icon="✉️" />
          <Btn variant="pink" full onClick={sendInvite} loading={invLoading} disabled={!invName || !invEmail}>Enviar invitación →</Btn>
        </>}
      </Modal>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PROFILE
// ══════════════════════════════════════════════════════════════════════════════
function ProfileScreen({ setScreen }) {
  const { user, login, register, logout, updateUser } = useAuth();
  const [edit, setEdit]       = useState(false);
  const [name, setName]       = useState('');
  const [phone, setPhone]     = useState('');
  const [mode, setMode]       = useState('login');
  const [email, setEmail]     = useState('');
  const [pass, setPass]       = useState('');
  const [regName, setRegName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const { show, toast }       = useToast();

  async function submit() {
    setError('');
    if (!email || !pass || (mode === 'register' && !regName)) { setError('Completa todos los campos.'); return; }
    setLoading(true);
    try {
      if (mode === 'login') { await login(email, pass); }
      else { await register(regName, email, pass); }
    } catch (e) {
      setError(e.message || 'Error de autenticación.');
    }
    setLoading(false);
  }

  if (!user) return (
    <div style={{ padding: '20px 16px' }}>
      {toast && <Toast message={toast.message} type={toast.type} />}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ fontSize: 44, marginBottom: 8 }}>🍑</div>
        <div style={{ fontSize: 22, fontWeight: 900, color: C.white }}>Glute Addicts</div>
        <div style={{ fontSize: 13, color: C.gray }}>Inicia sesión para gestionar tus clases</div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <Pill active={mode === 'login'} onClick={() => setMode('login')}>Iniciar sesión</Pill>
        <Pill active={mode === 'register'} onClick={() => setMode('register')} color={C.pink}>Registrarse</Pill>
      </div>
      {mode === 'register' && <Input label="Nombre" value={regName} onChange={setRegName} placeholder="Nombre completo" icon="👤" />}
      <Input label="Correo" type="email" value={email} onChange={setEmail} placeholder="tu@correo.com" icon="✉️" />
      <Input label="Contraseña" type="password" value={pass} onChange={setPass} placeholder="••••••••" icon="🔒" />
      {error && <div style={{ fontSize: 12, color: C.danger, marginBottom: 12 }}>⚠️ {error}</div>}
      <Btn variant={mode === 'login' ? 'primary' : 'pink'} full onClick={submit} loading={loading}>
        {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
      </Btn>
      <div style={{ textAlign: 'center', marginTop: 14, fontSize: 12, color: C.gray }}>Cuenta vinculada a gluteaddictsmedellin.co</div>
    </div>
  );

  return (
    <div style={{ padding: '20px 16px' }}>
      {toast && <Toast message={toast.message} type={toast.type} />}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Avatar name={user.name} size={72} />
        <div style={{ fontWeight: 900, color: C.white, fontSize: 20, marginTop: 12 }}>{user.name}</div>
        <div style={{ fontSize: 13, color: C.gray }}>{user.email}</div>
        <div style={{ marginTop: 8 }}><Badge color={C.gold}>Miembro Activo</Badge></div>
      </div>

      {edit ? (
        <Card style={{ marginBottom: 14 }}>
          <Input label="Nombre" value={name} onChange={setName} icon="👤" />
          <Input label="Teléfono" value={phone} onChange={setPhone} placeholder="+57 300 000 0000" icon="📱" />
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn variant="primary" full small onClick={() => { updateUser({ name, phone }); setEdit(false); }}>Guardar</Btn>
            <Btn variant="ghost" full small onClick={() => setEdit(false)}>Cancelar</Btn>
          </div>
        </Card>
      ) : (
        <Card style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.gray, letterSpacing: .8, textTransform: 'uppercase', marginBottom: 12 }}>Mis datos</div>
          {[['👤', 'Nombre', user.name], ['✉️', 'Correo', user.email], ['📱', 'Teléfono', user.phone || 'No registrado']].map(([icon, label, val]) => (
            <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 16 }}>{icon}</span>
              <div>
                <div style={{ fontSize: 10, color: C.gray, textTransform: 'uppercase', letterSpacing: .6 }}>{label}</div>
                <div style={{ fontSize: 13, color: C.grayL }}>{val}</div>
              </div>
            </div>
          ))}
          <Btn variant="outline" small onClick={() => { setName(user.name); setPhone(user.phone || ''); setEdit(true); }}>✏️ Editar perfil</Btn>
        </Card>
      )}

      {[
        { icon: '📦', label: 'Mis paquetes',    action: () => setScreen('my-packages') },
        { icon: '📅', label: 'Mis reservas',     action: () => setScreen('schedule') },
        { icon: '📍', label: 'Cómo llegar',      action: () => window.open('https://maps.google.com/?q=Cra+35+%237-86+El+Poblado+Medellin') },
        { icon: '💬', label: 'WhatsApp soporte', action: () => window.open('https://wa.me/573214789321') },
      ].map(l => (
        <Card key={l.label} style={{ marginBottom: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }} onClick={l.action}>
          <span style={{ fontSize: 20 }}>{l.icon}</span>
          <span style={{ flex: 1, fontWeight: 600, color: C.white, fontSize: 14 }}>{l.label}</span>
          <span style={{ color: C.gray }}>›</span>
        </Card>
      ))}

      <Btn variant="danger" full style={{ marginTop: 16 }} onClick={logout}>Cerrar sesión</Btn>

      <Card style={{ marginTop: 18, textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: C.gray, lineHeight: 2.2 }}>
          <div>📍 Cra. 35 #7-86, El Poblado, Medellín, Antioquia</div>
          <div>📞 +57 321 4789321</div>
          <div>✉️ Gluteaddictsmde@gmail.com</div>
        </div>
      </Card>
    </div>
  );
}

// ── Tab Bar ───────────────────────────────────────────────────────────────────
function TabBar({ active, setScreen }) {
  const tabs = [
    { id: 'home',        icon: '🏠', label: 'Inicio' },
    { id: 'schedule',    icon: '📅', label: 'Horarios' },
    { id: 'packages',    icon: '💳', label: 'Paquetes' },
    { id: 'my-packages', icon: '📦', label: 'Mis Clases' },
    { id: 'profile',     icon: '👤', label: 'Perfil' },
  ];
  return (
    <div style={{ position: 'sticky', bottom: 0, background: C.dark, borderTop: `1px solid ${C.border}`, display: 'flex', padding: '8px 0 max(16px, env(safe-area-inset-bottom))', zIndex: 100 }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => setScreen(t.id)} style={{ flex: 1, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '4px 0', fontFamily: 'inherit' }}>
          <div style={{ fontSize: 20, lineHeight: 1, opacity: active === t.id ? 1 : .38, transition: 'opacity .2s' }}>{t.icon}</div>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: .4, color: active === t.id ? C.gold : C.grayD, transition: 'color .2s' }}>{t.label.toUpperCase()}</div>
          {active === t.id && <div style={{ width: 4, height: 4, borderRadius: '50%', background: C.gold }} />}
        </button>
      ))}
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
function Inner() {
  const [screen, setScreen]        = useState('home');
  const [checkoutPkg, setCheckout] = useState(null);
  const scrollRef                  = useRef(null);

  useEffect(() => { scrollRef.current?.scrollTo(0, 0); }, [screen]);

  const screens = {
    home:          <HomeScreen setScreen={setScreen} />,
    schedule:      <ScheduleScreen />,
    packages:      <PackagesScreen setScreen={setScreen} setCheckoutPkg={p => { setCheckout(p); setScreen('checkout'); }} />,
    checkout:      <CheckoutScreen pkg={checkoutPkg} setScreen={setScreen} />,
    'my-packages': <MyPackagesScreen setScreen={setScreen} />,
    profile:       <ProfileScreen setScreen={setScreen} />,
  };

  return (
    <div style={{ maxWidth: 430, margin: '0 auto', background: C.black, minHeight: '100vh', display: 'flex', flexDirection: 'column', boxShadow: '0 0 60px rgba(0,0,0,0.8)' }}>
      <div style={{ background: C.dark, padding: 'max(12px, env(safe-area-inset-top)) 20px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, zIndex: 200 }}>
        <img src="https://gluteaddictsmedellin.co/wp-content/uploads/2026/01/Logo-2.png" alt="Glute Addicts" style={{ height: 28, objectFit: 'contain' }} />
        <div style={{ fontSize: 10, color: C.gray, textAlign: 'right', lineHeight: 1.5 }}>
          <div>🟢 ONLINE</div>
          <div style={{ color: '#00A651', fontWeight: 800 }}>WOMPI</div>
        </div>
      </div>
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto' }}>
        {screens[screen] || screens.home}
      </div>
      <TabBar active={screen} setScreen={setScreen} />
    </div>
  );
}

export default function App() {
  return (
    <>
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
        body { background:${C.black}; color:${C.white}; font-family:'Helvetica Neue',Helvetica,Arial,sans-serif; overscroll-behavior:none; }
        input,button,select,textarea { font-family:inherit; }
        @keyframes slideUp   { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }
        ::-webkit-scrollbar { width:0; }
        input::placeholder { color:${C.grayD}; }
        input { color:${C.white}; }
      `}</style>
      <div style={{
  minHeight: '100vh',
  background: `radial-gradient(ellipse at 30% 50%, ${C.gold}0a, transparent 60%), radial-gradient(ellipse at 70% 50%, ${C.pink}08, transparent 60%), #050505`,
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  paddingTop: 20,
}}>
  <AuthProvider>
    <Inner />
  </AuthProvider>
</div>
    </>
  );
}
