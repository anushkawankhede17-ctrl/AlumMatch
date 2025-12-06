import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search, Users, CreditCard, CheckCircle2 } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container-page py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Match with alumni who once stood where you stand.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground md:text-xl">
            Get personalized, paid 1:1 mentorship for your study-abroad journey from India. 
            Connect with Indian graduates from top universities worldwide who've walked the path you're about to take.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="gap-2">
              <Link to="/auth/signup">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/auth/login">Log in</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="border-t border-border bg-muted/30 py-24">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold text-foreground">How it works</h2>
            <p className="mt-4 text-muted-foreground">
              Three simple steps to connect with the perfect mentor for your journey.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="relative rounded-xl border border-border bg-card p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <div className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
                1
              </div>
              <h3 className="mt-6 text-lg font-semibold text-foreground">Share your profile</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Paste your LinkedIn URL and tell us about your goals. We'll understand your background and aspirations.
              </p>
            </div>

            <div className="relative rounded-xl border border-border bg-card p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
                2
              </div>
              <h3 className="mt-6 text-lg font-semibold text-foreground">Get matched</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Our system finds your top 3 alumni matches based on your profile, goals, and their expertise.
              </p>
            </div>

            <div className="relative rounded-xl border border-border bg-card p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
                3
              </div>
              <h3 className="mt-6 text-lg font-semibold text-foreground">Connect & learn</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Send a request, pay for the session, and have your 1:1 mentorship call with someone who's been there.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border py-24">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold text-foreground">Why AlumMatch?</h2>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Verified Alumni', desc: 'All mentors are verified graduates from top universities worldwide.' },
              { title: 'Smart Matching', desc: 'Our algorithm finds mentors whose journey aligns with your goals.' },
              { title: 'Flexible Sessions', desc: 'Book 30, 45, or 60-minute sessions at times that work for you.' },
              { title: 'Transparent Pricing', desc: 'See rates upfront. No hidden fees. Pay only for sessions you book.' },
            ].map((feature, i) => (
              <div key={i} className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <h3 className="font-medium text-foreground">{feature.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-muted/30 py-24">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold text-foreground">Ready to find your mentor?</h2>
            <p className="mt-4 text-muted-foreground">
              Join thousands of students who've found guidance from alumni who understand their journey.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link to="/auth/signup">Create your free account</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container-page">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
                <span className="text-xs font-bold text-primary-foreground">A</span>
              </div>
              <span className="text-sm font-medium text-foreground">AlumMatch</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} AlumMatch. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
