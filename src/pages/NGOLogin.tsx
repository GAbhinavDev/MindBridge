import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Mail, Lock, ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const NGOLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, user, isNGOAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (user && isNGOAdmin) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        toast({ title: "Login failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Welcome to NGO Intelligence Portal", description: "Accessing anonymized youth wellbeing data." });
        navigate("/dashboard");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4" style={{ background: "linear-gradient(135deg, hsl(200 40% 6%), hsl(200 35% 12%))" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-warm/20 flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-warm" />
          </div>
          <h1 className="font-heading text-3xl font-bold mb-2 text-white">NGO Intelligence Portal</h1>
          <p className="text-white/60">Access anonymized youth wellbeing data</p>
        </div>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-white/40" />
                <Input
                  type="email"
                  placeholder="NGO admin email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-white/40" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />
              </div>
              <Button type="submit" className="w-full gap-2 bg-warm hover:bg-warm/90 text-white" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>Access Dashboard <ArrowRight className="w-4 h-4" /></>
                )}
              </Button>
            </form>
            <div className="mt-4 flex items-center justify-center gap-2 text-white/40 text-xs">
              <Shield className="w-3 h-3" /> Zero personal data exposed
            </div>
            <div className="mt-4 text-center">
              <Link to="/auth" className="text-xs text-white/40 hover:text-white/60 transition-colors">
                ← Back to User Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default NGOLogin;
