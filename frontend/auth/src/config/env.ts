import { User } from '../types';

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const ADMIN_APP_URL =
  import.meta.env.VITE_ADMIN_URL || 'http://localhost:5174';

export const CUSTOMER_APP_URL =
  import.meta.env.VITE_CUSTOMER_URL || 'http://localhost:5173';

export const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

/**
 * Cek apakah role termasuk staf/internal admin
 */
export function isInternalRole(role: string): boolean {
  const r = role.toLowerCase();
  return r === 'admin' || r === 'developer' || r === 'viewer';
}

/**
 * Menghitung URL tujuan redirect dan deskripsi target berdasarkan role pengguna
 */
export function resolveRedirectTarget(
  user: User,
  token: string,
  returnToParam?: string | null
): { targetUrl: string; targetName: string; targetRole: string } {
  const isAdmin = isInternalRole(user.role);
  const targetRole = isAdmin ? 'Internal Admin' : 'Customer';
  const targetName = isAdmin ? 'Console Administrator Nuptia' : 'Portal Customer Nuptia';
  const defaultBaseUrl = isAdmin ? ADMIN_APP_URL : CUSTOMER_APP_URL;

  let targetUrl = defaultBaseUrl;

  // Validasi return_to yang ketat berdasarkan peran akun (Role Enforcement):
  // - Akun Customer HANYA boleh diarahkan ke CUSTOMER_APP_URL (abaikan jika mencoba ke admin)
  // - Akun Internal Admin boleh ke ADMIN_APP_URL atau CUSTOMER_APP_URL
  if (returnToParam && returnToParam.trim()) {
    try {
      const decoded = decodeURIComponent(returnToParam.trim());
      const parsed = new URL(decoded);
      const adminOrigin = new URL(ADMIN_APP_URL).origin;
      const customerOrigin = new URL(CUSTOMER_APP_URL).origin;

      if (isAdmin) {
        if (parsed.origin === adminOrigin || parsed.origin === customerOrigin) {
          targetUrl = decoded;
        }
      } else {
        // Customer DILARANG dialihkan ke admin origin
        if (parsed.origin === customerOrigin) {
          targetUrl = decoded;
        } else {
          targetUrl = CUSTOMER_APP_URL;
        }
      }
    } catch {
      // Jika bukan URL absolut yang valid, gunakan defaultBaseUrl
    }
  }

  // Gabungkan dengan token handoff via hash
  // Format hash: #auth_token=<TOKEN>&auth_role=<ROLE>
  const urlObj = new URL(targetUrl.includes('://') ? targetUrl : `${defaultBaseUrl}${targetUrl}`);
  
  // Ambil hash yang sudah ada (misal #/templates atau #/editor/123)
  const existingHash = urlObj.hash ? urlObj.hash.replace(/^#/, '') : '';
  const hashParams = new URLSearchParams();
  hashParams.set('auth_token', token);
  hashParams.set('auth_role', user.role);
  if (existingHash && !existingHash.startsWith('auth_token')) {
    hashParams.set('auth_redirect', existingHash);
  }

  // Susun URL final dengan hash handoff
  const baseUrlClean = `${urlObj.origin}${urlObj.pathname}${urlObj.search}`;
  const finalRedirectUrl = `${baseUrlClean}#${hashParams.toString()}`;

  return {
    targetUrl: finalRedirectUrl,
    targetName,
    targetRole,
  };
}
