import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        toast({
          title: "Login Successful",
          description: `Welcome back, ${result.user?.name}!`,
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Login Failed",
          description: result.error || "Invalid email or password",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (userEmail: string) => {
    setEmail(userEmail);
    setPassword('password123'); // Demo password
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">RxNexus Login</CardTitle>
          <CardDescription>
            Access your pharmacy management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6">
            <div className="text-center text-sm text-muted-foreground mb-3">
              Demo Accounts
            </div>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => handleDemoLogin('admin@rxnexus.com')}
              >
                Admin (admin@rxnexus.com)
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => handleDemoLogin('pharmacist@rxnexus.com')}
              >
                Pharmacist (pharmacist@rxnexus.com)
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => handleDemoLogin('tech@rxnexus.com')}
              >
                Technician (tech@rxnexus.com)
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Password: password123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;