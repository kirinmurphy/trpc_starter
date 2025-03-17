import { z } from 'zod';

export function validateSuperAdminEmail(email?: string): string {
  if (!email) {
    throw new Error(
      'SUPER_ADMIN_EMAIL environment variable is required for initial setup.'
    );
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
