import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

type LoginStatus = "idle" | "error";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [status, setStatus] = useState<LoginStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRememberChange = (checked: boolean | "indeterminate") => {
    setForm({ ...form, remember: Boolean(checked) });
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("idle");
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await login(form.email, form.password);
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      if (form.remember) {
        localStorage.setItem('rememberEmail', form.email);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed. Please try again.";
      setErrorMessage(message);
      setStatus("error");
      toast({
        title: "Login failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberEmail');
    if (rememberedEmail) {
      setForm(prev => ({ ...prev, email: rememberedEmail, remember: true }));
    }
  }, []);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-4 py-12 text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-cyan-500/40 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-500/30 blur-3xl" />
      </div>

      <Card className="relative z-10 w-full max-w-md border-slate-800 bg-slate-900/80 text-white shadow-2xl shadow-blue-500/20 backdrop-blur">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-semibold">Welcome back</CardTitle>
          <CardDescription className="text-slate-300">
            Enter your credentials to access DoctorAI.
          </CardDescription>
        </CardHeader>

        {status === "error" && errorMessage && (
          <div className="px-6">
            <Alert variant="destructive">
              <AlertTitle>Login failed</AlertTitle>
              <AlertDescription>
                {errorMessage}
              </AlertDescription>
            </Alert>
          </div>
        )}

        <CardContent className="space-y-4 pt-6">
          <form className="space-y-5" onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className="bg-slate-950/40 text-white placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-cyan-300 hover:text-white"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                className="bg-slate-950/40 text-white placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={form.remember}
                onCheckedChange={handleRememberChange}
                className="border-slate-600 data-[state=checked]:bg-cyan-500"
              />
              <Label htmlFor="remember" className="font-normal text-slate-300">
                Remember me for 30 days
              </Label>
            </div>

            <Button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 border-t border-white/10 bg-slate-950/40 py-6 text-center">
          <p className="text-sm text-slate-400">
            New to DoctorAI?{" "}
            <Link to="/signup" className="font-medium text-cyan-300 hover:text-white">
              Create an account
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
