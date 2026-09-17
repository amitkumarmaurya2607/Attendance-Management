const ACCESS_TOKEN_KEY = "attendflow.access-token";
const REFRESH_TOKEN_KEY = "attendflow.refresh-token";

export const SESSION_EXPIRED_EVENT = "attendflow:session-expired";

export interface SessionTokens {
  accessToken: string;
  refreshToken: string;
}

function readStored(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStored(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // storage unavailable (private mode / quota) — session stays in-memory
  }
}

function removeStored(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export const session = {
  getAccessToken(): string | null {
    return readStored(ACCESS_TOKEN_KEY);
  },
  getRefreshToken(): string | null {
    return readStored(REFRESH_TOKEN_KEY);
  },
  getTokens(): SessionTokens | null {
    const accessToken = readStored(ACCESS_TOKEN_KEY);
    const refreshToken = readStored(REFRESH_TOKEN_KEY);
    return accessToken && refreshToken ? { accessToken, refreshToken } : null;
  },
  setTokens(tokens: SessionTokens): void {
    writeStored(ACCESS_TOKEN_KEY, tokens.accessToken);
    writeStored(REFRESH_TOKEN_KEY, tokens.refreshToken);
  },
  setAccessToken(accessToken: string): void {
    writeStored(ACCESS_TOKEN_KEY, accessToken);
  },
  clear(): void {
    removeStored(ACCESS_TOKEN_KEY);
    removeStored(REFRESH_TOKEN_KEY);
  },
};

export function notifySessionExpired(): void {
  try {
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
  } catch {
    // ignore
  }
}