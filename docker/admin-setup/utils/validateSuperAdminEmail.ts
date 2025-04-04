import { z } from 'zod';

export function validateSuperAdminEmailFormat(email?: string): string {
  if (!email) {
    throw new Error('SUPER_ADMIN_EMAIL env variable is required for setup.');
  }

  try {
    return z
      .string()
      .email('SUPER_ADMIN_EMAIL must be a valid email address')
      .parse(email);
  } catch (err) {
    if (err instanceof z.ZodError) {
      throw new Error(`Invalid SUPER_ADMIN_EMAIL: ${err.errors[0].message}`);
    }
    throw err;
  }
}
