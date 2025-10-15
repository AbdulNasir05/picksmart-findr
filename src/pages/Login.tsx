import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Smartphone, Mail } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { signIn, signUp, signInWithPhone, signInWithGoogle, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/categories");
    }
  }, [user, navigate]);

  const handleEmailAuth = async () => {
    if (!email || !password) {
      return;
    }
    
    if (isSignUp) {
      await signUp(email, password);
    } else {
      await signIn(email, password);
    }
  };

  const handlePhoneAuth = async () => {
    if (!phone) {
      return;
    }
    await signInWithPhone(phone);
  };

  const handleGoogleAuth = async () => {
    await signInWithGoogle();
  };

  const handleGuest = () => {
    navigate("/categories");
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      {/* Header */}
      <header className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">PickSmart</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 pb-20">
        <Card className="w-full max-w-md p-8 shadow-xl animate-scale-in">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h2>
            <p className="text-muted-foreground">Sign in to find your perfect tech match</p>
          </div>

          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="email" className="gap-2">
                <Mail className="w-4 h-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="phone" className="gap-2">
                <Smartphone className="w-4 h-4" />
                Phone
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email Address</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12"
                />
              </div>
              <Button 
                onClick={handleEmailAuth}
                className="w-full h-12 bg-gradient-primary hover:opacity-90 transition-opacity"
              >
                {isSignUp ? 'Sign Up' : 'Sign In'} with Email
              </Button>
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-muted-foreground hover:text-foreground w-full text-center"
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            </TabsContent>

            <TabsContent value="phone" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Phone Number</label>
                <Input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-12"
                />
              </div>
              <Button 
                onClick={handlePhoneAuth}
                className="w-full h-12 bg-gradient-primary hover:opacity-90 transition-opacity"
              >
                Send OTP
              </Button>
            </TabsContent>
          </Tabs>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            onClick={handleGoogleAuth}
            className="w-full h-12 mb-3"
          >
            Continue with Google
          </Button>

          <Button 
            variant="outline" 
            onClick={handleGuest}
            className="w-full h-12"
          >
            Continue as Guest
          </Button>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white/10 backdrop-blur-sm border-t border-white/20 py-6 px-4">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-6 text-sm text-white/90">
          <a href="#" className="hover:text-white transition-colors">About</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
};

export default Login;
