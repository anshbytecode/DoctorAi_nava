import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

type SignupStatus = "idle" | "error";

const SignupPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "patient" as "patient" | "doctor",
    specialty: "",
    licenseNumber: "",
    updates: true,
  });
  const [status, setStatus] = useState<SignupStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const passwordChecklist = useMemo(
    () => [
      { label: "8+ characters", met: form.password.length >= 8 },
      { label: "Includes a number", met: /\d/.test(form.password) },
      { label: "Upper & lower case", met: /[A-Z]/.test(form.password) && /[a-z]/.test(form.password) },
    ],
    [form.password],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdatesChange = (checked: boolean | "indeterminate") => {
    setForm({ ...form, updates: Boolean(checked) });
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("idle");
    setErrorMessage("");

    if (form.password !== form.confirmPassword) {
      setErrorMessage("Passwords do not match. Please double-check and try again.");
      setStatus("error");
      return;
    }

    // Check password requirements
    if (form.password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      setStatus("error");
      return;
    }

    setIsSubmitting(true);

    try {
      await signup(
        form.name, 
        form.email, 
        form.password, 
        form.role,
        form.role === 'doctor' ? form.specialty : undefined,
        form.role === 'doctor' ? form.licenseNumber : undefined
      );
      toast({
        title: "Account created",
        description: `Welcome to DoctorAI${form.role === 'doctor' ? ' as a Doctor' : ''}!`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "We could not create your account. Please try again later.";
      setErrorMessage(message);
      setStatus("error");
      toast({
        title: "Signup failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 px-4 py-12 text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-x-0 top-0 mx-auto h-1/3 max-w-2xl bg-gradient-to-b from-cyan-500/40 via-transparent to-transparent opacity-70 blur-3xl" />
        <div className="absolute -right-24 bottom-12 h-64 w-64 rounded-full bg-blue-500/30 blur-3xl" />
      </div>
      <div className="relative z-10 mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-slate-800 bg-slate-900/80 text-white shadow-2xl shadow-cyan-500/20 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-3xl font-semibold">Create your DoctorAI account</CardTitle>
            <CardDescription className="text-base text-slate-300">
              Get personalized insights, continuous monitoring, and on-demand guidance from trusted providers.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-4">
            {status === "error" && errorMessage && (
              <Alert variant="destructive">
                <AlertTitle>We hit a snag</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            <form className="space-y-5" onSubmit={handleSignup}>
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Jane Doe"
                  value={form.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                  className="bg-slate-950/40 text-white placeholder:text-slate-400"
                />
              </div>

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
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  className="bg-slate-950/40 text-white placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  className="bg-slate-950/40 text-white placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">I am a</Label>
                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value as "patient" | "doctor" })}
                  className="w-full rounded-md border border-slate-800 bg-slate-950/40 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                >
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                </select>
              </div>

              {form.role === 'doctor' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Specialty</Label>
                    <Input
                      id="specialty"
                      name="specialty"
                      type="text"
                      placeholder="e.g., Cardiology, Pediatrics, General Medicine"
                      value={form.specialty}
                      onChange={handleChange}
                      required={form.role === 'doctor'}
                      className="bg-slate-950/40 text-white placeholder:text-slate-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">License Number (Optional)</Label>
                    <Input
                      id="licenseNumber"
                      name="licenseNumber"
                      type="text"
                      placeholder="Medical license number"
                      value={form.licenseNumber}
                      onChange={handleChange}
                      className="bg-slate-950/40 text-white placeholder:text-slate-400"
                    />
                  </div>
                </>
              )}

              <div className="grid gap-2 rounded-lg border border-slate-800/80 bg-slate-950/40 p-3 text-sm text-slate-300">
                <p className="text-xs uppercase tracking-wide text-slate-400">Password requirements</p>
                <ul className="space-y-1 text-sm">
                  {passwordChecklist.map((item) => (
                    <li key={item.label} className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${item.met ? "bg-emerald-400" : "bg-slate-600"}`}
                        aria-hidden
                      />
                      {item.label}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-slate-800/70 bg-slate-950/40 p-3 text-sm text-slate-300">
                <Checkbox
                  id="updates"
                  checked={form.updates}
                  onCheckedChange={handleUpdatesChange}
                  className="mt-1 border-slate-600 data-[state=checked]:bg-cyan-500"
                />
                <Label htmlFor="updates" className="text-sm font-normal leading-snug text-slate-300">
                  Keep me posted about clinical insights, new features, and beta programs. You can unsubscribe anytime.
                </Label>
              </div>

              <Button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400" disabled={isSubmitting}>
                {isSubmitting ? "Creating your account..." : "Sign up"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 border-t border-white/10 bg-slate-950/40 py-6 text-center">
            <p className="text-sm text-slate-400">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-cyan-300 hover:text-white">
                Sign in
              </Link>
            </p>
            <p className="text-xs text-slate-500">
              By continuing, you agree to our{" "}
              <Button variant="link" className="p-0 text-cyan-300 hover:text-white" type="button">
                Terms
              </Button>{" "}
              and{" "}
              <Button variant="link" className="p-0 text-cyan-300 hover:text-white" type="button">
                Privacy Policy
              </Button>
              .
            </p>
          </CardFooter>
        </Card>

        <div className="relative flex flex-col justify-between rounded-3xl border border-slate-800/70 bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-transparent p-8 text-slate-100 shadow-2xl shadow-cyan-500/20">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-300">Why DoctorAI</p>
            <h2 className="mt-4 text-4xl font-semibold text-white">Your AI copilot for proactive health</h2>
            <p className="mt-4 text-lg text-slate-200">
              Surface early risk signals, chat with board-certified clinicians, and connect with specialists without leaving the app.
            </p>
          </div>
          <div className="mt-10 space-y-5">
            {[
              "Evidence-backed triage and treatment plans",
              "Continuous vitals monitoring with wearable sync",
              "Instant referrals to trusted specialists",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <span className="mt-1 h-2 w-2 rounded-full bg-cyan-300" aria-hidden />
                <p className="text-base text-slate-100">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
