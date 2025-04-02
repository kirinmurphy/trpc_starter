import { z } from 'zod';
import { escapeHTML } from '../utils/escapeHtml';

const errorMessages = {
  localPartMax: 'Email value before @ cannot exceed 64 characters.',
  domainPartMax: 'Email value after @ cannot exceed 255 characters.',
  unsafeEmailContent: 'Email contains potentially unsafe content.',
  invalidEmailCharacters: 'Email contains invalid characters.',
  unsafePasswordContent: 'Password contains potentially unsafe content.',
  repeatCharacters:
    'Password cannot include 3 ore more consecutive characters.',
  insecurePassword:
    'This password is not secure, please select a more secure password.',
  passwordFormat:
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
};

export const userNameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(70, 'Name cannot exceed 70 characters')
  .trim()
  .transform((html) => escapeHTML(html))
  .refine(inputIsUnsafe, 'Name contains potentially unsafe content');

export const createEmailSchema = z
  .string()
  .trim()
  .min(5, 'Email must be at least 5 characters')
  .max(254, 'Email cannot exceed 254 characters')
  .email('Invalid email format')
  .toLowerCase()
  .transform((email) => {
    const sanitizedEmail = escapeHTML(email);
    const [localPart, domainPart] = sanitizedEmail.split('@');
    if (localPart.length > 64) {
      throw new Error(errorMessages.localPartMax);
    }
    if (domainPart.length > 255) {
      throw new Error(errorMessages.domainPartMax);
    }
    return sanitizedEmail;
  })
  .refine(inputIsUnsafe, errorMessages.unsafeEmailContent)
  .refine(
    (email) => !/['";\\]/.test(email),
    errorMessages.invalidEmailCharacters
  );

export const createPasswordSchema = z
  .string()
  .trim()
  .min(10, 'Password must be at least 10 characters')
  .max(72, 'Password cannot exceed 72 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*-])[A-Za-z\d!@#$%^&-_*]{8,}$/,
    errorMessages.passwordFormat
  )
  .refine(inputIsUnsafe, errorMessages.unsafePasswordContent)
  .refine((input) => !/(.)\1{2,}/.test(input), errorMessages.repeatCharacters)
  .refine(
    (input) => !/^(password|123456|qwerty)/i.test(input),
    errorMessages.insecurePassword
  )
  .transform((password) => escapeHTML(password));

export const resetPasswordBaseFields = {
  userId: z.string().uuid(),
  password: createPasswordSchema,
  confirmPassword: z.string().min(1, 'Password confirmation is required'),
};

export function checkIfConfirmPasswordMatches(
  data: { password: string; confirmPassword: string },
  ctx: z.RefinementCtx
) {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: 'custom',
      message: 'Passwords must match',
      path: ['confirmPassword'],
    });
  }
}

export function inputIsUnsafe(string: string): boolean {
  return !/<script|javascript|alert|onclick/i.test(string);
}
