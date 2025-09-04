import Pricing from "@/components/subscription-plans/pricing";
import { BookOpen, Users, Shield, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <header className="navbar fixed top-0 z-10 bg-base-100/80 backdrop-blur border-b border-base-300">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-info" />
            <span className="text-xl font-bold text-info">DocSpire</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="link link-hover hover:text-info">
              Features
            </a>
            <a href="#pricing" className="link link-hover hover:text-info">
              Pricing
            </a>
            <Link href="/sign-in" className="link link-hover hover:text-info">
              Sign In
            </Link>
            <Link href="/sign-up">
              <button className="btn btn-primary hover:bg-success hover:text-success-content">Get Started</button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6 text-primary">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-pink-500">Beautiful Documentation Hub for Teams</span>
            </h1>
            <p className="text-xl text-base-content/70 mb-8">
              Create, organize, and share your team's knowledge in one beautiful space.
              Built for modern teams who value clarity and collaboration.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/sign-up">
                <button className="btn btn-primary btn-lg hover:bg-success hover:text-success-content">
                  Start Free Trial
                </button>
              </Link>
              <a href="#features">
                <button className="btn btn-outline btn-lg">
                  Learn More
                </button>
              </a>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Everything You Need for Documentation
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="card bg-base-200 shadow-md">
                <div className="card-body items-start">
                  <Users className="w-12 h-12 text-primary mb-4" />
                  <h3 className="card-title">Team Collaboration</h3>
                  <p>
                    Invite team members, assign roles, and work together seamlessly.
                  </p>
                </div>
              </div>
              <div className="card bg-base-200 shadow-md">
                <div className="card-body items-start">
                  <Shield className="w-12 h-12 text-primary mb-4" />
                  <h3 className="card-title">Secure Access</h3>
                  <p>
                    Control who can view and edit your documentation with fine-grained permissions.
                  </p>
                </div>
              </div>
              <div className="card bg-base-200 shadow-md">
                <div className="card-body items-start">
                  <Sparkles className="w-12 h-12 text-primary mb-4" />
                  <h3 className="card-title">Beautiful Interface</h3>
                  <p>
                    Modern, clean design with dark mode support and responsive layouts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Pricing Section */}
        <section id="pricing" className="py-20">
          <Pricing />
        </section>

      </main>

      {/* Footer */}
      <footer className="footer border-t border-base-300 bg-base-100 py-8">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="font-semibold">DocSpire</span>
          </div>
          <div className="text-sm text-base-content/70">
            © 2025 DocSpire. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
