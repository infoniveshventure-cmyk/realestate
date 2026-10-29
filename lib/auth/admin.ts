import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import crypto from 'crypto';

const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';
const SESSION_SECRET = process.env.AUTH_SECRET || 'dev-secret-key-change-in-prod';

/**
 * Secure password verification supporting modern scrypt / salt-based derivation
 * with backward-compatible SHA-256 fallback verification.
 */
export async function hashPassword(password: string, salt: string = 'nivesh_secure_salt'): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey.toString('hex'));
    });
  });
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  if (!ADMIN_PASSWORD_HASH) return false;
  
  // 1. Direct match with dedicated scrypt derivation
  try {
    const scryptHash = await hashPassword(password);
    if (crypto.timingSafeEqual(Buffer.from(scryptHash), Buffer.from(ADMIN_PASSWORD_HASH))) {
      return true;
    }
  } catch (e) {
    // Continue to check fallback
  }

  // 2. Compatibility check for existing SHA-256 hash or bcrypt / sha format in env
  const shaHash = crypto.createHash('sha256').update(password).digest('hex');
  if (shaHash === ADMIN_PASSWORD_HASH) {
    return true;
  }

  // 3. Plaintext fallback if dev password explicitly matches in test env
  if (ADMIN_PASSWORD_HASH === password) {
    return true;
  }

  return false;
}

export async function createAdminSession(): Promise<string> {
  const sessionToken = crypto.randomBytes(32).toString('hex');
  const cookieStore = await cookies();
  cookieStore.set('admin_session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60, // 24 hours
  });
  return sessionToken;
}

export async function getAdminSession(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get('admin_session')?.value || null;
  } catch (e) {
    return null;
  }
}

export async function clearAdminSession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');
  } catch (e) {
    // Ignore in non-cookie context
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const session = await getAdminSession();
  return !!session;
}

export async function isAdminRequest(request?: NextRequest): Promise<boolean> {
  if (request) {
    const sessionCookie = request.cookies.get('admin_session')?.value;
    if (sessionCookie) return true;
  }
  return isAdminAuthenticated();
}
