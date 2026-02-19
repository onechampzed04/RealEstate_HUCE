const pending = new Map();

// pending structure: email -> { name, email, password, otp, expiresAt }

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function createPending(name, email, password, ttlMs = 1000 * 60 * 10) {
  const otp = generateOtp();
  const expiresAt = Date.now() + ttlMs;
  pending.set(email, { name, email, password, otp, expiresAt });
  return otp;
}

function getPending(email) {
  const record = pending.get(email);
  if (!record) return null;
  if (Date.now() > record.expiresAt) {
    pending.delete(email);
    return null;
  }
  return record;
}

function removePending(email) {
  pending.delete(email);
}

// periodic cleanup
setInterval(() => {
  const now = Date.now();
  for (const [email, rec] of pending.entries()) {
    if (rec.expiresAt <= now) pending.delete(email);
  }
}, 1000 * 60);

export default { createPending, getPending, removePending };
