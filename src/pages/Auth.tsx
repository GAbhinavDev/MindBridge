import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, signIn, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (user) {
    navigate("/", { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, displayName);
        if (error) {
          toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
        } else {
          toast({ title: "Welcome to Mana! 💚", description: "Check your email to confirm your account." });
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
        } else {
          navigate("/");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4 bg-gradient-calm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-heading text-3xl font-bold mb-2">
            {isSignUp ? "Join Mana" : "Welcome Back"}
          </h1>
          <p className="text-muted-foreground">
            {isSignUp ? "Create your safe space" : "Continue your wellness journey"}
          </p>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Display name (anonymous to others)"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="pl-10"
                  />
                </div>
              )}
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <Button type="submit" className="w-full gap-2" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {isSignUp ? "Create Account" : "Sign In"} <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
              </button>
            </div>

            <div className="mt-4 text-center">
              <Link to="/ngo-login" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                NGO Admin Login →
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          🔒 Your data is encrypted and anonymous. We never share personal information.
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
