export interface RateLimitProps {
  name: string; 
  hits: number;
  duration: number;
  blockDuration: number;
}

export const RATE_LIMIT_CONFIG: Record<string, RateLimitProps> = {
  signUp: {
    name: 'signUp',
    hits: 3, 
    duration: 60,
    blockDuration: 2 * 60
  },
  login: {
    name: 'login',
    hits: 5, 
    duration: 15,
    blockDuration: 60
  },
  refreshToken: {
    name: 'refreshToken',
    hits: 10, 
    duration: 10,
    blockDuration: 30
  },
} as const; 