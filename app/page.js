import { BookOpen, Users, Shield, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="fixed top-0 w-full border-b bg-white/80 backdrop-blur-sm dark:bg-gray-950/80 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-bold">DocSpire</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Pricing</a>
            <Link href="/sign-in" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Sign In</Link>
            <Link href="/sign-up" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
              Beautiful Documentation Hub for Teams
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Create, organize, and share your team's knowledge in one beautiful space. 
              Built for modern teams who value clarity and collaboration.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/auth/register" 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg">
                Start Free Trial
              </Link>
              <a href="#features" 
                className="border border-gray-300 dark:border-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-lg">
                Learn More
              </a>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Everything You Need for Documentation</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-xl bg-white dark:bg-gray-900 shadow-sm">
                <Users className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Invite team members, assign roles, and work together seamlessly.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-white dark:bg-gray-900 shadow-sm">
                <Shield className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Secure Access</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Control who can view and edit your documentation with fine-grained permissions.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-white dark:bg-gray-900 shadow-sm">
                <Sparkles className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Beautiful Interface</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Modern, clean design with dark mode support and responsive layouts.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t dark:border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span className="font-semibold">DocSpire</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              © 2025 DocSpire. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
