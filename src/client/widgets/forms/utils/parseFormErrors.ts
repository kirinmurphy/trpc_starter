import { TRPCClientErrorLike } from '@trpc/client';
import { AppRouter } from '../../../../server/server';

interface FormFieldError {
  message: string;
  path: [string];
  code: string;
  validation?: string;
}

export type FormErrors = Record<string, string[]>;

export type FormErrorType = TRPCClientErrorLike<AppRouter> | null;

export function parseFormErrors(error?: FormErrorType) {
  let fieldErrors: FormErrors | undefined;
  let staticErrorMessage: string | undefined;

  if (!error) {
    return { staticErrorMessage, fieldErrors };
  }

  try {
    const parsedError = parseErrorMessage(error.message);

    if (Array.isArray(parsedError)) {
      fieldErrors = convertFormFieldErrors(parsedError);
    } else {
      staticErrorMessage = parsedError;
    }
  } catch {
    staticErrorMessage = error.message;
  }

  return { staticErrorMessage, fieldErrors };
}

function parseErrorMessage(errorMessage: string): FormFieldError[] | string {
  try {
    const parsed = JSON.parse(errorMessage);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return errorMessage;
  } catch {
    return errorMessage;
  }
}

function convertFormFieldErrors(errors: FormFieldError[]): FormErrors {
  return errors.reduce((acc, error) => {
    const fieldName = error.path[0];
    acc[fieldName] = acc[fieldName] ?? [];
    acc[fieldName].push(error.message);
    return acc;
  }, {} as FormErrors);
}
