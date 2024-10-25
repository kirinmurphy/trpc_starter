import { z } from "zod";

export const createEmailSchema = z.string()
  .trim()
  .min(5, 'Email must be at least 5 characters')
  .max(254, 'Email cannot exceed 254 characters')
  .email('Invalid email format')
  .toLowerCase();
  // add validation for email parts 

export const createPasswordSchema = z.string()
  .trim()
  .min(10, 'Password must be at least 8 characters')
  .max(72, 'Password cannot exceed 72 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*-])[A-Za-z\d!@#$%^&-_*]{8,}$/,
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  );
  // more validation checks 


