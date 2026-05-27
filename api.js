const WP_API = 'https://gluteaddictsmedellin.co/wp-json/reservas-colombia/v1';
const WP_BASE = 'https://gluteaddictsmedellin.co/wp-json/wp/v2';

// ── Auth storage ──────────────────────────────────────────────────────────────
export function getToken() { return localStorage.getItem('rc_token'); }
export function setToken(t) { localStorage.setItem('rc_token', t); }
export function clearToken() { localStorage.removeItem('rc_token'); }
export function getUser() { try { return JSON.parse(localStorage.getItem('rc_user')); } catch { return null; } }
export function setUser(u) { localStorage.setItem('rc_user', JSON.stringify(u)); }
export function clearUser() { localStorage.removeItem('rc_user'); }

// ── Base fetch ────────────────────────────────────────────────────────────────
async function api(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${WP_API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Basic ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || data?.error || 'Error en la solicitud.');
  return data;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export async function login(email, password) {
  // Use basic auth to verify credentials
  const token = btoa(`${email}:${password}`);
  const res = await fetch(`${WP_BASE}/users/me`, {
    headers: { Authorization: `Basic ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error('Credenciales incorrectas.');
  setToken(token);
  setUser({ id: data.id, name: data.name, email: email, phone: '' });
  return data;
}

export async function register(name, email, password) {
  // Register via WooCommerce customer creation
  const res = await fetch(`${WP_BASE}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: email.split('@')[0] + Math.floor(Math.random() * 1000),
      email,
      password,
      name,
      roles: ['customer'],
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || 'Error al registrarse.');
  return await login(email, password);
}

export async function validateToken() {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await fetch(`${WP_BASE}/users/me`, {
      headers: { Authorization: `Basic ${token}` },
    });
    if (!res.ok) { clearToken(); clearUser(); return null; }
    return token;
  } catch {
    clearToken();
    clearUser();
    return null;
  }
}

export function logout() { clearToken(); clearUser(); }

// ── Packages ──────────────────────────────────────────────────────────────────
export async function getPackages() {
  return api('/packages');
}

export async function buyPackage(packageId) {
  return api(`/packages/${packageId}/buy`, { method: 'POST' });
}

export async function getMyPackages() {
  return api('/my-packages');
}

export async function getPackageDetail(cpId) {
  return api(`/my-packages/${cpId}`);
}

// ── Payments ──────────────────────────────────────────────────────────────────
export async function initiatePayment(customerPackageId, amount, memberId = null) {
  return api('/payments/initiate', {
    method: 'POST',
    body: JSON.stringify({
      customer_package_id: customerPackageId,
      amount,
      ...(memberId ? { member_id: memberId } : {}),
    }),
  });
}

export function openWompiWidget(params, onSuccess) {
  const checkout = new window.WidgetCheckout({
    currency:       params.currency,
    amountInCents:  params.amountInCents,
    reference:      params.reference,
    publicKey:      params.publicKey,
    redirectUrl:    params.redirectUrl,
    customerData:   params.customerData,
  });
  checkout.open(result => {
    const tx = result.transaction;
    if (tx && tx.status === 'APPROVED') {
      onSuccess(tx);
    }
  });
}

// ── Bookings ──────────────────────────────────────────────────────────────────
export async function createBooking(data) {
  return api('/bookings', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function cancelBooking(bookingId) {
  return api(`/bookings/${bookingId}/cancel`, { method: 'POST' });
}

export async function getMyBookings() {
  return api('/bookings');
}

// ── Sharing ───────────────────────────────────────────────────────────────────
export async function inviteMember(cpId, name, email, sessionsAllocated = 0, paymentShare = 0) {
  return api(`/my-packages/${cpId}/invite`, {
    method: 'POST',
    body: JSON.stringify({ name, email, sessions_allocated: sessionsAllocated, payment_share: paymentShare }),
  });
}

export async function removeMember(memberId) {
  return api(`/members/${memberId}`, { method: 'DELETE' });
}

export async function getSplitInfo(cpId) {
  return api(`/my-packages/${cpId}/split`);
}

// ── Waiver ────────────────────────────────────────────────────────────────────
export async function recordWaiverAcceptance(cpId) {
  return api('/waiver/accept', {
    method: 'POST',
    body: JSON.stringify({
      customer_package_id: cpId,
      accepted_at: new Date().toISOString(),
    }),
  });
}
