import React, { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';

const GoogleAuth = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Aqui você implementaria a autenticação real
      // Por enquanto, vamos simular um login básico
      if (credentials.email && credentials.password) {
        const user = {
          id: Date.now().toString(),
          name: 'Dr. Paulo Silva',
          email: credentials.email,
          picture: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face'
        };
        
        onLogin(user);
      } else {
        alert('Por favor, preencha email e senha');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      alert('Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-cover bg-center bg-no-repeat flex items-center justify-center" 
         style={{backgroundImage: 'url(/src/assets/bg.png)'}}>
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/80 via-teal-700/80 to-cyan-800/80"></div>
      
      {/* Floating Particles */}
      <div className="floating-particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>

      <Card className="glass-card w-full max-w-md mx-4 border-white/20">
        <CardHeader className="text-center pb-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 mx-auto mb-4">
            <img 
              src="/src/assets/logo.png" 
              alt="Tio Paulo Logo" 
              className="w-16 h-16 object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Tio Paulo</CardTitle>
          <p className="text-emerald-100">Sistema de Ficha de Anamnese</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-white font-medium text-sm mb-2 block">
                Email
              </label>
              <Input
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials(prev => ({...prev, email: e.target.value}))}
                className="glass-input text-white placeholder-white/60"
                placeholder="seu@email.com"
                required
              />
            </div>
            
            <div>
              <label className="text-white font-medium text-sm mb-2 block">
                Senha
              </label>
              <Input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({...prev, password: e.target.value}))}
                className="glass-input text-white placeholder-white/60"
                placeholder="••••••••"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white/10 backdrop-blur-sm border border-white/20 py-3 text-white font-semibold flex items-center justify-center space-x-3 hover:bg-white/20 transition-all disabled:opacity-50 rounded-md"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          <div className="text-center mt-4">
            <p className="text-emerald-100 text-xs">
              Ao fazer login, você concorda com nossos termos de uso
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleAuth;