const pendingRegistrations = new Map();
const pendingPasswordChanges = new Map();
const pendingNameChanges = new Map();
const pendingEmailChanges = new Map();
const pendingPhoneChanges = new Map();

// pendingRegistrations: email -> { name, email, password, otp, expiresAt }
// pendingPasswordChanges: userId -> { userId, newPassword, otp, expiresAt }
// pendingNameChanges: userId -> { userId, newName, otp, expiresAt }
// pendingEmailChanges: userId -> { userId, newEmail, otp, expiresAt }
// pendingPhoneChanges: userId -> { userId, newPhone, otp, expiresAt }

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Registration OTP functions
function createPendingRegistration(name, email, password, phone = '', ttlMs = 1000 * 60 * 10) {
  const otp = generateOtp();
  const expiresAt = Date.now() + ttlMs;
  pendingRegistrations.set(email, { name, email, password, phone, otp, expiresAt });
  return otp;
}

function getPendingRegistration(email) {
  const record = pendingRegistrations.get(email);
  if (!record) return null;
  if (Date.now() > record.expiresAt) {
    pendingRegistrations.delete(email);
    return null;
  }
  return record;
}

function removePendingRegistration(email) {
  pendingRegistrations.delete(email);
}

// Password change OTP functions
function createPendingPasswordChange(userId, newPassword, ttlMs = 1000 * 60 * 10) {
  const otp = generateOtp();
  const expiresAt = Date.now() + ttlMs;
  pendingPasswordChanges.set(userId, { userId, newPassword, otp, expiresAt });
  return otp;
}

function getPendingPasswordChange(userId) {
  const record = pendingPasswordChanges.get(userId);
  if (!record) return null;
  if (Date.now() > record.expiresAt) {
    pendingPasswordChanges.delete(userId);
    return null;
  }
  return record;
}

function removePendingPasswordChange(userId) {
  pendingPasswordChanges.delete(userId);
}

// Name change OTP functions
function createPendingNameChange(userId, newName, ttlMs = 1000 * 60 * 10) {
  const otp = generateOtp();
  const expiresAt = Date.now() + ttlMs;
  pendingNameChanges.set(userId, { userId, newName, otp, expiresAt });
  return otp;
}

function getPendingNameChange(userId) {
  const record = pendingNameChanges.get(userId);
  if (!record) return null;
  if (Date.now() > record.expiresAt) {
    pendingNameChanges.delete(userId);
    return null;
  }
  return record;
}

function removePendingNameChange(userId) {
  pendingNameChanges.delete(userId);
}

// Email change OTP functions
function createPendingEmailChange(userId, newEmail, ttlMs = 1000 * 60 * 10) {
  const otp = generateOtp();
  const expiresAt = Date.now() + ttlMs;
  pendingEmailChanges.set(userId, { userId, newEmail, otp, expiresAt });
  return otp;
}

function getPendingEmailChange(userId) {
  const record = pendingEmailChanges.get(userId);
  if (!record) return null;
  if (Date.now() > record.expiresAt) {
    pendingEmailChanges.delete(userId);
    return null;
  }
  return record;
}

function removePendingEmailChange(userId) {
  pendingEmailChanges.delete(userId);
}

// Phone change OTP functions
function createPendingPhoneChange(userId, newPhone, ttlMs = 1000 * 60 * 10) {
  const otp = generateOtp();
  const expiresAt = Date.now() + ttlMs;
  pendingPhoneChanges.set(userId, { userId, newPhone, otp, expiresAt });
  return otp;
}

function getPendingPhoneChange(userId) {
  const record = pendingPhoneChanges.get(userId);
  if (!record) return null;
  if (Date.now() > record.expiresAt) {
    pendingPhoneChanges.delete(userId);
    return null;
  }
  return record;
}

function removePendingPhoneChange(userId) {
  pendingPhoneChanges.delete(userId);
}

// Legacy functions for backward compatibility
function createPending(name, email, password, ttlMs = 1000 * 60 * 10) {
  return createPendingRegistration(name, email, password, ttlMs);
}

function getPending(email) {
  return getPendingRegistration(email);
}

function removePending(email) {
  return removePendingRegistration(email);
}

// Periodic cleanup
setInterval(() => {
  const now = Date.now();
  for (const [email, rec] of pendingRegistrations.entries()) {
    if (rec.expiresAt <= now) pendingRegistrations.delete(email);
  }
  for (const [userId, rec] of pendingPasswordChanges.entries()) {
    if (rec.expiresAt <= now) pendingPasswordChanges.delete(userId);
  }
  for (const [userId, rec] of pendingNameChanges.entries()) {
    if (rec.expiresAt <= now) pendingNameChanges.delete(userId);
  }
  for (const [userId, rec] of pendingEmailChanges.entries()) {
    if (rec.expiresAt <= now) pendingEmailChanges.delete(userId);
  }
  for (const [userId, rec] of pendingPhoneChanges.entries()) {
    if (rec.expiresAt <= now) pendingPhoneChanges.delete(userId);
  }
}, 1000 * 60);

export default { 
  createPending, 
  getPending, 
  removePending,
  createPendingRegistration,
  getPendingRegistration,
  removePendingRegistration,
  createPendingPasswordChange,
  getPendingPasswordChange,
  removePendingPasswordChange,
  createPendingNameChange,
  getPendingNameChange,
  removePendingNameChange,
  createPendingEmailChange,
  getPendingEmailChange,
  removePendingEmailChange,
  createPendingPhoneChange,
  getPendingPhoneChange,
  removePendingPhoneChange
};
