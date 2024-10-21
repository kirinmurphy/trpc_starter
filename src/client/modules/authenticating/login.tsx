import React, { useState } from 'react';
import { trpcService } from '../../../utils/trpcClients';
import { useQueryClient } from '@tanstack/react-query';

interface LoginProps {
  onLoginSuccess?: () => void;
}

export function Login ({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const loginMutation = trpcService.auth.login.useMutation({
    onSuccess: async (data) => {
      if ( data?.success ) {
        await queryClient.invalidateQueries(['auth', 'validateUser']);
        if ( onLoginSuccess ) onLoginSuccess();
      } else {
        setError('Login failed');
      }
    },
    onError: (error) => {
      console.error('Loginn error: ', error);
      setError(error.message || 'An error occurred. Please try again.');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1 font-medium">Email</label>
          <input
            id="email"
            type="email"
            value={email}
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

export default Login;