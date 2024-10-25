import React, { useState } from 'react';
import { trpcService } from '../../../utils/trpcClients';
import { useQueryClient } from '@tanstack/react-query';

interface SignUpProps {
  onSignUpSuccess?: () => void;
}

export function SignUp ({ onSignUpSuccess }: SignUpProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const signUpMutation = trpcService.auth.signUp.useMutation({
    onSuccess: async (data) => {
      console.log('DATAAAAAAA', data);
      if ( data?.success ) {
        // TODO: what other queries to invalidate 
        await queryClient.invalidateQueries(['auth', 'validateUser']);
        if ( onSignUpSuccess ) onSignUpSuccess();
      } else {
        setError('Sign Up failed');
      }
    },
    onError: (error) => {
      const errorMessage = Array.isArray(JSON.parse(error.message)) 
        ? JSON.parse(error.message)
          .map((error:{ message: string }) => error.message).join('\n') 
        : error.message;
      setError(errorMessage || 'An error occurred. Please try again.');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    signUpMutation.mutate({ email, password, name });
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1 font-medium">Name</label>
          <input
            id="name"
            type="name"
            value={name}
            autoComplete="off"
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1 font-medium">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1 font-medium">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            autoComplete="off"
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <button 
          type="submit" 
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
};

export default SignUp;