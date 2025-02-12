import { ReactNode, FormEvent } from 'react';
import {
  FormErrors,
  FormErrorType,
  parseFormErrors,
} from './utils/parseFormErrors';
import { FormErrorMessage } from './FormErrorMessage';

interface AuthFormProps {
  children: (props: { fieldErrors?: FormErrors }) => ReactNode;
  onSubmit: () => void;
  isLoading: boolean;
  error?: FormErrorType;
  title: string;
}

export function SimpleForm(props: AuthFormProps) {
  const { children, onSubmit, isLoading, error, title } = props;

  const { fieldErrors, staticErrorMessage } = parseFormErrors(error);

  const handleSubmit = async (e: FormEvent) => {
    if (isLoading) {
      return;
    }
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {children({ fieldErrors })}
        <div className="pt-8">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : title || 'Submit'}
          </button>
        </div>
      </form>

      <div className="pt-4">
        {staticErrorMessage && <FormErrorMessage msg={staticErrorMessage} />}

        {fieldErrors && (
          <FormErrorMessage msg="Please check the form for errors." />
        )}
      </div>
    </div>
  );
}
