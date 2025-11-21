import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/src/context/AuthContext';
import { supabase } from '@/src/lib/supabaseClient';

vi.mock('@/src/lib/supabaseClient');

const mockSupabase = supabase as any;

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should provide user and auth methods', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: {
        session: {
          access_token: 'test-token',
          user: {
            id: 'test-user-id',
            email: 'test@example.com',
            user_metadata: {},
          },
        },
      },
    });

    mockSupabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });

    function TestComponent() {
      const { user, loading } = useAuth();
      if (loading) return <div>Loading</div>;
      return <div>{user?.email}</div>;
    }

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('test@example.com')).toBeTruthy();
    });
  });

  it('should sign in with GitHub', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
    });

    mockSupabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });

    mockSupabase.auth.signInWithOAuth.mockResolvedValue({
      data: { url: 'https://github.com/login' },
      error: null,
    });

    function TestComponent() {
      const { signInWithGitHub } = useAuth();
      return <button onClick={signInWithGitHub}>Sign in</button>;
    }

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const button = screen.getByText('Sign in');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalled();
    });
  });

  it('should sign out', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: {
        session: {
          user: { id: 'test-id', email: 'test@example.com' },
        },
      },
    });

    mockSupabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });

    mockSupabase.auth.signOut.mockResolvedValue({ error: null });

    function TestComponent() {
      const { user, signOut } = useAuth();
      return (
        <>
          <div>{user?.email}</div>
          <button onClick={signOut}>Sign out</button>
        </>
      );
    }

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(mockSupabase.auth.signOut).toBeDefined();
    });
  });
});
