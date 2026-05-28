const WP_API = 'https://gluteaddictsmedellin.co/wp-json/reservas-colombia/v1';
const GA_API = 'https://gluteaddictsmedellin.co/wp-json/ga/v1';

// ── Auth storage ──────────────────────────────────────────────────────────────
export function getToken()  { return localStorage.getItem('rc_token'); }
export function setToken(t) { localStorage.setItem('rc_token', t); }
export function clearToken(){ localStorage.removeItem('rc_token'); }
export function getNonce()  { return localStorage.getItem('rc_nonce'); }
export function setNonce(n) { localStorage.setItem('rc_nonce', n); }
export function clearNonce(){ localStorage.removeItem('rc_nonce'); }
export function getUser()   { try { return JSON.parse(localStorage.getItem('rc_user')); } catch { return null; } }
export function setUser(u)  { localStorage.setItem('rc_user', JSON.stringify(u)); }
export function clearUser() { localStorage.removeItem('rc_user'); }

// ── Base fetch ────────────────────────────────────────────────────────────────
async function api(path, options = {}) {
  const nonce = getNonce();
  const token = getToken();
  const res = await fetch(`${WP_API}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(nonce ? { 'X-WP-Nonce': nonce } : {}),
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
  const res = await fetch(`${GA_API}/auth-cookie`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Credenciales incorrectas.');
  setToken(data.token);
  setNonce(data.nonce);
  setUser({ id: data.id, name: data.name, email: data.email, phone: '' });
  return data;
}

export async function register(name, email, password) {
  const res = await fetch(`${GA_API}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Error al registrarse.');
  return await login(email, password);
}

export async function validateToken() {
  const token = getToken();
  const user  = getUser();
  if (!token || !user) return null;
  try {
    const res = await fetch(`${GA_API}/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email:    user.email,
        password: atob(token).split(':')[1],
      }),
    });
    if (!res.ok) { clearToken(); clearNonce(); clearUser(); return null; }
    const data = await res.json();
    if (data.nonce) setNonce(data.nonce);
    return token;
  } catch {
    clearToken();
    clearNonce();
    clearUser();
    return null;
  }
}

export function logout() { clearToken(); clearNonce(); clearUser(); }

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
    currency:      params.currency,
    amountInCents: params.amountInCents,
    reference:     params.reference,
    publicKey:     params.publicKey,
    redirectUrl:   params.redirectUrl,
    customerData:  params.customerData,
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
