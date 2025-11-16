import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

const LoginPage = () => {
  const [email, setEmail] = useState("demo@example.com");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/app";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    login(email);
    navigate(from, { replace: true });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md rounded-xl border bg-card p-8 shadow-lg space-y-6">
        <h1 className="text-2xl font-semibold text-center">
          Exequte Hotel Analytics – Sign in
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            Continue (mock login)
          </Button>
        </form>
        <p className="text-xs text-muted-foreground text-center">
          This uses local mock auth. Supabase auth can replace it later.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
