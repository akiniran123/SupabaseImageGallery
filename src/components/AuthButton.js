import { Button } from 'react-bootstrap';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';

export default function AuthButton() {
  const user = useUser();
  const supabase = useSupabaseClient();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) {
      console.error("OAuth error:", error.message);
      alert("Đăng nhập thất bại!");
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Sign out error:", error.message);
    }
  };

  if (!user) {
    return (
      <>
        <h1>Welcome to ImageWall</h1>
        <Button variant="danger" onClick={handleLogin}>
          Đăng nhập bằng Google
        </Button>
      </>
    );
  }

  return (
    <>
      <h1>Your ImageWall</h1>
      <Button onClick={handleLogout}>Đăng xuất</Button>
      <p>Current user: {user.email}</p>
    </>
  );
}
