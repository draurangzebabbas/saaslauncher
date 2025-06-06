import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Github, Linkedin, Mail, Apple } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { supabase } from '../lib/supabase';

type AuthMode = 'signin' | 'signup';
type Provider = 'google' | 'github' | 'apple' | 'linkedin';

export default function Auth() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<Provider | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'signin') {
        await signIn(email, password);
        toast.success('Signed in successfully');
      } else {
        await signUp(email, password, name);
        toast.success('Account created successfully');
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Authentication error:', error);
      toast.error(
        mode === 'signin'
          ? 'Failed to sign in. Please check your credentials.'
          : 'Failed to create account. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async (provider: Provider) => {
    setSocialLoading(provider);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Social auth error:', error);
      toast.error(`Failed to sign in with ${provider}. Please try again.`);
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md">
          <div className="text-center">
            <div className="flex justify-center">
              <LayoutDashboard className="h-12 w-12 text-[#0166ce]" />
            </div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-neutral-900">
              {mode === 'signin' ? 'Sign in to SaaS Launcher' : 'Create your account'}
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                className="font-medium text-[#0166ce] hover:text-[#3B82F6]"
              >
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          <div className="mt-8">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              {/* Social Auth Buttons */}
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => handleSocialAuth('google')}
                  isLoading={socialLoading === 'google'}
                >
                  <Mail className="h-5 w-5" />
                  Continue with Google
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => handleSocialAuth('github')}
                  isLoading={socialLoading === 'github'}
                >
                  <Github className="h-5 w-5" />
                  Continue with GitHub
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => handleSocialAuth('apple')}
                  isLoading={socialLoading === 'apple'}
                >
                  <Apple className="h-5 w-5" />
                  Continue with Apple
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => handleSocialAuth('linkedin')}
                  isLoading={socialLoading === 'linkedin'}
                >
                  <Linkedin className="h-5 w-5" />
                  Continue with LinkedIn
                </Button>
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-neutral-500">Or continue with</span>
                </div>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                {mode === 'signup' && (
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-neutral-700">
                      Name
                    </label>
                    <div className="mt-1">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="block w-full appearance-none rounded-md border border-neutral-300 px-3 py-2 placeholder-neutral-400 shadow-sm focus:border-[#0166ce] focus:outline-none focus:ring-[#0166ce] sm:text-sm"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full appearance-none rounded-md border border-neutral-300 px-3 py-2 placeholder-neutral-400 shadow-sm focus:border-[#0166ce] focus:outline-none focus:ring-[#0166ce] sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full appearance-none rounded-md border border-neutral-300 px-3 py-2 placeholder-neutral-400 shadow-sm focus:border-[#0166ce] focus:outline-none focus:ring-[#0166ce] sm:text-sm"
                    />
                  </div>
                </div>

                {mode === 'signin' && (
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <a href="#" className="font-medium text-[#0166ce] hover:text-[#3B82F6]">
                        Forgot your password?
                      </a>
                    </div>
                  </div>
                )}

                <div>
                  <Button
                    type="submit"
                    isLoading={isLoading}
                    className="w-full bg-[#0166ce] hover:bg-[#3B82F6]"
                  >
                    {mode === 'signin' ? 'Sign in' : 'Sign up'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 h-full w-full bg-[#0166ce]">
          <div className="flex h-full items-center justify-center p-8">
            <div className="max-w-md text-white">
              <h2 className="text-3xl font-bold mb-4">Launch your SaaS faster</h2>
              <p className="text-white/80 text-lg mb-6">
                SaaS Launcher guides you through every step of building your software business — from idea validation to marketing and launch.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="flex h-6 w-6 rounded-full bg-white/20 items-center justify-center mr-2">
                    1
                  </span>
                  <span>Research & plan your SaaS idea</span>
                </li>
                <li className="flex items-center">
                  <span className="flex h-6 w-6 rounded-full bg-white/20 items-center justify-center mr-2">
                    2
                  </span>
                  <span>Build with recommended no-code tools</span>
                </li>
                <li className="flex items-center">
                  <span className="flex h-6 w-6 rounded-full bg-white/20 items-center justify-center mr-2">
                    3
                  </span>
                  <span>Market & get paying customers</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}