// ── IVA ──────────────────────────────────────────────────────────────────────
export const IVA_RATE = 0.19;

export function calcIva(base)   { return Math.round(base * IVA_RATE); }
export function calcTotal(base) { return base + calcIva(base); }
export function applyDiscount(total, coupon) {
  if (!coupon) return total;
  if (coupon.type === 'percent') return Math.round(total * (1 - coupon.value / 100));
  if (coupon.type === 'fixed')   return Math.max(0, total - coupon.value);
  return total;
}
export function fmt(n) {
  return '$' + Number(Math.round(n)).toLocaleString('es-CO') + ' COP';
}

// ── Brand colors ──────────────────────────────────────────────────────────────
export const C = {
  black:   '#0a0a0a',
  dark:    '#111111',
  card:    '#181818',
  surface: '#1f1f1f',
  border:  '#2a2a2a',
  gold:    '#c9a84c',
  goldL:   '#e8c96a',
  goldD:   '#a07830',
  pink:    '#e85d8a',
  white:   '#ffffff',
  gray:    '#888888',
  grayL:   '#bbbbbb',
  grayD:   '#444444',
  success: '#4caf7d',
  danger:  '#e85d5d',
  purple:  '#9b6dff',
};

// ── Packages (mirrors WordPress catalogue — kept in sync via API in production)
export const PACKAGES = [
  {
    id: 1,
    name:      '1 Clase',
    subtitle:  'Prueba una sesión',
    sessions:  1,
    unlimited: false,
    basePrice: 40000,
    validity:  '10 días',
    color:     C.gold,
    icon:      '🎯',
    perks:     ['1 sesión (Jumping o Combo)', 'Válido 10 días', 'Reserva desde la app'],
    canShare:  false,
    maxMembers: 0,
  },
  {
    id: 2,
    name:      '10 Clases',
    subtitle:  'El más popular',
    sessions:  10,
    unlimited: false,
    basePrice: 360000,
    validity:  '30 días',
    color:     C.pink,
    icon:      '🔥',
    popular:   true,
    perks:     ['10 sesiones', 'Válido 30 días', 'Comparte con hasta 2 personas', 'Pago dividido con Wompi'],
    canShare:  true,
    maxMembers: 2,
  },
  {
    id: 3,
    name:      'Mensual Ilimitado',
    subtitle:  'Máximos resultados',
    sessions:  999,
    unlimited: true,
    basePrice: 600000,
    validity:  '30 días calendario',
    color:     C.purple,
    icon:      '⚡',
    perks:     ['Clases ilimitadas', 'Válido 30 días', 'Jumping + Combo incluido', 'Prioridad en reservas'],
    canShare:  false,
    maxMembers: 0,
  },
];

// ── Schedule ──────────────────────────────────────────────────────────────────
export const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export const SCHEDULE = {
  jumping: {
    Lun: ['6:00 AM','8:30 AM','6:00 PM'],
    Mar: ['6:00 AM','8:30 AM','6:00 PM'],
    Mié: ['6:00 AM','8:30 AM','6:00 PM'],
    Jue: ['6:00 AM','8:30 AM','5:00 PM'],
    Vie: ['6:00 AM','8:30 AM','5:00 PM'],
    Sáb: ['8:00 AM','10:30 AM'],
    Dom: ['8:00 AM','10:30 AM'],
  },
  combo: {
    Lun: ['7:15 AM','9:45 AM','7:15 PM'],
    Mar: ['7:15 AM','9:45 AM','7:15 PM'],
    Mié: ['7:15 AM','9:45 AM','7:15 PM'],
    Jue: ['7:15 AM','9:45 AM','6:15 PM'],
    Vie: ['7:15 AM','9:45 AM','6:15 PM'],
    Sáb: ['9:15 AM','11:45 AM'],
    Dom: ['9:15 AM','11:45 AM'],
  },
};

// ── Coupons (managed in WordPress admin — this is just for demo/offline mode)
export const COUPONS = {
  GLUTE10:    { type: 'percent', value: 10,    label: '10% de descuento' },
  BIENVENIDA: { type: 'percent', value: 15,    label: '15% descuento - Nuevo cliente' },
  PROMO50:    { type: 'fixed',   value: 50000, label: '$50.000 de descuento' },
  VIP20:      { type: 'percent', value: 20,    label: '20% de descuento VIP' },
};
