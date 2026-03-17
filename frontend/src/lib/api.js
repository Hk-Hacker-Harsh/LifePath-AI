// ─── LifePath AI — API Client ─────────────────────────────────────────────
// All calls go to the Express backend on the same Azure VM
// In production, VITE_API_URL = http://your-vm-ip:5000
// In development, uses proxy (see vite.config.js)

const BASE = import.meta.env.VITE_API_URL || ''

// ─── Token management ─────────────────────────────────────────────────────

export function getToken() {
  return localStorage.getItem('lifepath_token')
}

export function setToken(token) {
  localStorage.setItem('lifepath_token', token)
}

export function clearToken() {
  localStorage.removeItem('lifepath_token')
  localStorage.removeItem('lifepath_user')
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem('lifepath_user')
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function setStoredUser(user) {
  localStorage.setItem('lifepath_user', JSON.stringify(user))
}

// ─── Base fetch wrapper ───────────────────────────────────────────────────

async function api(path, options = {}) {
  const token = getToken()
  const res = await fetch(`${BASE}/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`)
    err.status = res.status
    err.data   = data
    throw err
  }
  return data
}

// ─── AUTH ─────────────────────────────────────────────────────────────────

export async function signup(email, password) {
  return api('/auth/signup', { method: 'POST', body: { email, password } })
}

export async function login(email, password) {
  const data = await api('/auth/login', { method: 'POST', body: { email, password } })
  setToken(data.token)
  setStoredUser(data.user)
  return data
}

export async function logout() {
  clearToken()
}

export async function getMe() {
  return api('/auth/me')
}

export async function resendVerification(email) {
  return api('/auth/resend-verification', { method: 'POST', body: { email } })
}

// ─── PROFILE ──────────────────────────────────────────────────────────────

export async function getProfile() {
  const data = await api('/profile')
  return data.profile  // null if not set up yet
}

export async function saveProfile(profileData) {
  return api('/profile', { method: 'POST', body: profileData })
}

// ─── DECISIONS ────────────────────────────────────────────────────────────

export async function getDecisions() {
  const data = await api('/decisions')
  return data.decisions
}

export async function saveDecision({ decisionText, city, formSnapshot, result, qualityScore, businessType }) {
  return api('/decisions', {
    method: 'POST',
    body: { decisionText, city, formSnapshot, result, qualityScore, businessType },
  })
}

export async function deleteDecision(id) {
  return api(`/decisions/${id}`, { method: 'DELETE' })
}

// ─── FEELINGS ─────────────────────────────────────────────────────────────

export async function getFeelings() {
  const data = await api('/feelings')
  return data.feelings
}

export async function saveFeeling({ mood, feeling, nextDecision }) {
  return api('/feelings', { method: 'POST', body: { mood, feeling, nextDecision } })
}
