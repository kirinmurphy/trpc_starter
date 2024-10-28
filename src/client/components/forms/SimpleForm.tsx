import { TRPCClientError, TRPCClientErrorLike } from '@trpc/client';
import { ReactNode, FormEvent } from 'react';
import { AppRouter } from '../../../server/server';

interface AuthFormProps { 
  children: ReactNode; 
  onSubmit: () => void; 
  isLoading: boolean;
  error?: TRPCClientErrorLike<AppRouter> | null;
  title: string;
}

export function SimpleForm (props: AuthFormProps) {
  const { children, onSubmit, isLoading, error, title } = props;

  const errorMessage = error && error instanceof TRPCClientError 
    ? error.message
    : error && Array.isArray(JSON.parse(error.message)) 
    ? JSON.parse(error.message)
      .map((error:{ message: string }) => error.message).join('.\n') 
    : error?.message || '';

  const handleSubmit = async (e: FormEvent) => {
    if ( isLoading ) { return; }
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {children}
        <button 
          type="submit" 
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : (title || 'Submit')}
        </button>
      </form>
      {errorMessage && <p className="mt-4 text-red-600">{errorMessage}</p>}
    </div>
  );  
}