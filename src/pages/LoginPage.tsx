import { useEffect } from 'react';
import { Button, Card, CardContent, Container } from '@blinkdotnew/ui';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../lib/i18n';
import { LanguageToggle } from '../components/LanguageToggle';
import { ArrowLeft, Lock } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

const LOGO_URL = 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL86L6RLm6BeSo4Rxn2DE4Mgo1bd2%2FTomoe2__edea70e9.svg?alt=media&token=7d18eabc-e786-400e-a9d2-7a3e7526b163';

export function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const t = translations[language];
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/dashboard' });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <nav className="h-16 flex items-center px-4 md:px-8">
        <Button variant="ghost" size="sm" onClick={() => navigate({ to: '/' })} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Button>
        <div className="flex-1" />
        <LanguageToggle />
      </nav>

      <Container className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <img src={LOGO_URL} alt="TOMOE Logo" className="h-12 w-auto mx-auto mb-6" />
            <h1 className="text-3xl font-serif font-bold text-primary">{t.login.title}</h1>
            <p className="text-muted-foreground">{t.login.subtitle}</p>
          </div>

          <Card className="border-none shadow-2xl bg-background/50 backdrop-blur-sm">
            <CardContent className="pt-8 pb-8 px-8 space-y-6">
              <div className="bg-primary/5 rounded-xl p-8 flex flex-col items-center text-center space-y-4 border border-primary/10">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                  <Lock className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-primary">Managed Access</p>
                  <p className="text-xs text-muted-foreground">Secure Single Sign-On</p>
                </div>
              </div>

              <Button 
                onClick={login} 
                size="lg" 
                className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
              >
                {t.login.button}
              </Button>

              <div className="text-center">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t.login.disclaimer}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-muted-foreground">
            <p>© 2026 TOMOE SRP Platform. Academic Integrity First.</p>
          </div>
        </div>
      </Container>
    </div>
  );
}
