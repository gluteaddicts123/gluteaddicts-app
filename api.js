/**
 * api.js — All calls to the WordPress REST API (Reservas Colombia plugin)
 *
 * Base URL is read from the env variable VITE_WP_URL.
 * Set it in Vercel → Settings → Environment Variables:
 *   VITE_WP_URL = https://gluteaddictsmedellin.co
 */

const WP = import.meta.env.VITE_WP_URL || 'https://gluteaddictsmedellin.co';
const BASE = `${WP}/wp-json`;

let _token = null; // WP auth token stored in memory

// ── Auth helpers ──────────────────────────────────────────────────────────────
export function setToken(t) { _token = t; }
export function clearToken() { _token = null; }

function headers(extra = {}) {
  const h = { 'Content-Type': 'application/json', ...extra };
  if (_token) h['Authorization'] = `Bearer ${_token}`;
  return h;
}

async function request(path, method = 'GET', body = null) {
  const opts = { method, headers: headers() };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE}${path}`, opts);

  if (res.status === 401) {
    clearToken();
    throw new Error('session_expired');
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

// ── JWT Auth (requires JWT Authentication for WP-API plugin) ─────────────────
export async function login(username, password) {
  const res = await fetch(`${WP}/wp-json/jwt-auth/v1/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  setToken(data.token);
  return data; // { token, user_email, user_nicename, user_display_name }
}

export async function register(name, email, password) {
  // Uses WP's built-in user registration endpoint
  const res = await fetch(`${WP}/wp-json/wp/v2/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: email, email, password, display_name: name }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Registration failed');
  // Auto-login after register
  return login(email, password);
}

// ── REST Nonce (for logged-in WP sessions via cookie) ────────────────────────
export function setNonce(nonce) {
  // Alternative to JWT — set nonce from wp_rest nonce if embedded in WP page
  _token = null;
  headers['X-WP-Nonce'] = nonce;
}

// ── Packages catalogue ────────────────────────────────────────────────────────
export const getPackages = () =>
  request('/reservas-colombia/v1/packages');

// ── My packages ───────────────────────────────────────────────────────────────
export const getMyPackages = () =>
  request('/reservas-colombia/v1/my-packages');

export const getPackageDetail = (cpId) =>
  request(`/reservas-colombia/v1/my-packages/${cpId}`);

// ── Purchase ──────────────────────────────────────────────────────────────────
export const buyPackage = (packageId) =>
  request(`/reservas-colombia/v1/packages/${packageId}/buy`, 'POST');

// ── Payment ───────────────────────────────────────────────────────────────────
export const initiatePayment = (customerPackageId, amount, memberId = null) =>
  request('/reservas-colombia/v1/payments/initiate', 'POST', {
    customer_package_id: customerPackageId,
    amount,
    ...(memberId ? { member_id: memberId } : {}),
  });

// ── Sharing ───────────────────────────────────────────────────────────────────
export const inviteMember = (cpId, name, email, sessionsAllocated = 0, paymentShare = 0) =>
  request(`/reservas-colombia/v1/my-packages/${cpId}/invite`, 'POST', {
    name, email,
    sessions_allocated: sessionsAllocated,
    payment_share:      paymentShare,
  });

export const removeMember = (memberId) =>
  request(`/reservas-colombia/v1/members/${memberId}`, 'DELETE');

export const getSplitInfo = (cpId) =>
  request(`/reservas-colombia/v1/my-packages/${cpId}/split`);

// ── Bookings ──────────────────────────────────────────────────────────────────
export const getMyBookings = () =>
  request('/reservas-colombia/v1/bookings');

export const createBooking = (data) =>
  request('/reservas-colombia/v1/bookings', 'POST', data);

export const cancelBooking = (bookingId) =>
  request(`/reservas-colombia/v1/bookings/${bookingId}/cancel`, 'POST');

// ── Services ──────────────────────────────────────────────────────────────────
export const getServices = () =>
  request('/reservas-colombia/v1/services');

// ── Wompi widget loader ───────────────────────────────────────────────────────
/**
 * Dynamically loads the Wompi checkout script and opens the widget.
 *
 * @param {object} params  - Response from initiatePayment()
 * @param {function} onSuccess - Called with transaction when approved
 */
export function openWompiWidget(params, onSuccess) {
  const existing = document.getElementById('wompi-script');
  if (existing) {
    _mountWidget(params, onSuccess);
    return;
  }
  const s = document.createElement('script');
  s.id  = 'wompi-script';
  s.src = 'https://checkout.wompi.co/widget.js';
  s.setAttribute('data-render', 'false');
  s.onload = () => _mountWidget(params, onSuccess);
  document.head.appendChild(s);
}

function _mountWidget(params, onSuccess) {
  // eslint-disable-next-line no-undef
  const checkout = new WidgetCheckout({
    currency:       'COP',
    amountInCents:  params.amountInCents,
    reference:      params.reference,
    publicKey:      params.publicKey,
    redirectUrl:    params.redirectUrl,
    customerData:   params.customerData,
  });
  checkout.open(result => {
    if (result?.transaction?.status === 'APPROVED') {
      onSuccess(result.transaction);
    }
  });
}
