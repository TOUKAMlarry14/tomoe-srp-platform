import { Button, Card, CardContent, Container, Stat, StatGroup } from '@blinkdotnew/ui';
import { LayoutDashboard, Brain, Layers, ArrowRight, GraduationCap, Users, BookOpen } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../lib/i18n';
import { LanguageToggle } from '../components/LanguageToggle';
import { useNavigate } from '@tanstack/react-router';

const LOGO_URL = 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL86L6RLm6BeSo4Rxn2DE4Mgo1bd2%2FTomoe2__edea70e9.svg?alt=media&token=7d18eabc-e786-400e-a9d2-7a3e7526b163';

export function LandingPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <Container className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={LOGO_URL} alt="TOMOE Logo" className="h-8 w-auto" />
            <span className="font-serif text-xl font-bold tracking-tight text-primary hidden sm:block">TOMOE</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#features" className="hover:text-primary transition-colors">{t.nav.features}</a>
            <a href="#about" className="hover:text-primary transition-colors">{t.nav.about}</a>
          </div>

          <div className="flex items-center gap-4">
            <LanguageToggle />
            <Button variant="ghost" size="sm" onClick={() => navigate({ to: '/login' })}>
              {t.nav.login}
            </Button>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => navigate({ to: '/login' })}>
              {t.nav.getStarted}
            </Button>
          </div>
        </Container>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,hsl(var(--primary)/0.05)_0%,transparent_100%)]" />
        <Container>
          <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-secondary/10 text-secondary-foreground border border-secondary/20 animate-fade-in">
              <GraduationCap className="w-4 h-4 mr-2" />
              Academic Excellence Reimagined
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary tracking-tight leading-tight">
              {t.hero.title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
              {t.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="h-14 px-8 text-lg font-semibold gap-2" onClick={() => navigate({ to: '/login' })}>
                {t.hero.cta} <ArrowRight className="w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-semibold border-primary/20 hover:bg-primary/5">
                Learn More
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-muted/30">
        <Container>
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary">{t.features.title}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Discover the specialized modules built to empower student researchers and academic leads.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-elegant hover:translate-y-[-4px] transition-transform duration-300">
              <CardContent className="pt-8 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <LayoutDashboard className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-primary">{t.features.dashboard.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{t.features.dashboard.description}</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-elegant hover:translate-y-[-4px] transition-transform duration-300">
              <CardContent className="pt-8 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary-foreground">
                  <Brain className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-primary">{t.features.ai.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{t.features.ai.description}</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-elegant hover:translate-y-[-4px] transition-transform duration-300">
              <CardContent className="pt-8 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-primary">{t.features.management.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{t.features.management.description}</p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-24 border-y">
        <Container>
          <StatGroup className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <Stat 
              label={t.stats.students} 
              value="1,250+" 
              icon={<Users className="text-secondary" />}
              className="border-none shadow-none"
            />
            <Stat 
              label={t.stats.programs} 
              value="45" 
              icon={<GraduationCap className="text-secondary" />}
              className="border-none shadow-none"
            />
            <Stat 
              label={t.stats.publications} 
              value="380" 
              icon={<BookOpen className="text-secondary" />}
              className="border-none shadow-none"
            />
          </StatGroup>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <Container className="relative">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-serif font-bold">{t.cta.title}</h2>
            <p className="text-primary-foreground/80 text-lg">{t.cta.button}</p>
            <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 h-14 px-12 text-lg font-bold" onClick={() => navigate({ to: '/login' })}>
              {t.nav.getStarted}
            </Button>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <Container className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <img src={LOGO_URL} alt="TOMOE Logo" className="h-6 w-auto grayscale" />
            <span className="font-serif text-lg font-bold text-muted-foreground">TOMOE</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 TOMOE SRP Platform. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary">Privacy</a>
            <a href="#" className="hover:text-primary">Terms</a>
            <a href="#" className="hover:text-primary">Contact</a>
          </div>
        </Container>
      </footer>
    </div>
  );
}
