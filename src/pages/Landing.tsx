import { LayoutDashboard, ArrowRight, CheckCircle2 } from 'lucide-react';

import { Button } from '../components/ui/Button';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex items-center">
              <LayoutDashboard className="h-8 w-8 text-[#007a33]" />
              <span className="ml-2 font-semibold text-xl">SaaS Launcher</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/auth" className="text-neutral-600 hover:text-neutral-900">
                Sign in
              </a>
              <Button 
                onClick={() => window.location.href = '/auth'} 
                size="sm"
              >
                Start Now
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-white pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl md:text-6xl">
            <span className="block">Launch Your SaaS Faster,</span>
            <span className="block text-[#007a33]">Without Code</span>
          </h1>
          <p className="mx-auto mt-6 max-w-md text-lg text-neutral-500 sm:max-w-xl md:mt-8 md:text-xl">
            The ultimate platform guiding non-technical founders through research,
            building, and marketing their SaaS business.
          </p>
          <div className="mx-auto mt-10 flex max-w-md justify-center">
            <Button 
              onClick={() => window.location.href = '/auth'} 
              size="lg"
              className="flex items-center gap-2"
            >
              Start Your SaaS Journey
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Phases Overview */}
      <div className="bg-neutral-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              Three Phases to SaaS Success
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-xl text-neutral-500">
              We guide you through every step of building your software business
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {/* Phase 1 */}
            <div className="relative rounded-lg border border-neutral-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="absolute -top-4 left-6 rounded-full bg-blue-100 p-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                  1
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-neutral-900">Research & Planning</h3>
                <p className="mt-2 text-neutral-600">
                  Validate your idea, analyze competitors, and define your unique value proposition.
                </p>
                <ul className="mt-4 space-y-2">
                  {['Keyword research', 'Competitor analysis', 'User personas', 'Feature planning'].map((item) => (
                    <li key={item} className="flex items-start">
                      <CheckCircle2 className="mr-2 h-5 w-5 text-[#007a33]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Phase 2 */}
            <div className="relative rounded-lg border border-neutral-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="absolute -top-4 left-6 rounded-full bg-purple-100 p-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-white">
                  2
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-neutral-900">Build with No-Code Tools</h3>
                <p className="mt-2 text-neutral-600">
                  Use recommended no-code tools to build your SaaS product without programming.
                </p>
                <ul className="mt-4 space-y-2">
                  {['App builder selection', 'Backend setup', 'Authentication', 'Payment integration'].map((item) => (
                    <li key={item} className="flex items-start">
                      <CheckCircle2 className="mr-2 h-5 w-5 text-[#007a33]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Phase 3 */}
            <div className="relative rounded-lg border border-neutral-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="absolute -top-4 left-6 rounded-full bg-amber-100 p-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-600 text-white">
                  3
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-neutral-900">Marketing & Launch</h3>
                <p className="mt-2 text-neutral-600">
                  Create your go-to-market strategy and acquire your first paying customers.
                </p>
                <ul className="mt-4 space-y-2">
                  {['Landing page setup', 'Social marketing', 'Email sequences', 'Product directories'].map((item) => (
                    <li key={item} className="flex items-start">
                      <CheckCircle2 className="mr-2 h-5 w-5 text-[#007a33]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              Trusted by SaaS Founders
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-xl text-neutral-500">
              See what our community is saying about SaaS Launcher
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg" 
                    alt="Alex" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-neutral-900">Alex Chen</h3>
                  <p className="text-neutral-500">Founder, TaskFlow</p>
                </div>
              </div>
              <p className="mt-4 text-neutral-600">
                "SaaS Launcher saved me months of research and helped me launch my productivity tool without writing a single line of code."
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg" 
                    alt="Sarah" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-neutral-900">Sarah Johnson</h3>
                  <p className="text-neutral-500">Co-founder, MarketBuddy</p>
                </div>
              </div>
              <p className="mt-4 text-neutral-600">
                "The guided phases and tool recommendations were exactly what I needed. I went from idea to paying customers in just 8 weeks."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg" 
                    alt="Miguel" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-neutral-900">Miguel Rodriguez</h3>
                  <p className="text-neutral-500">Creator, DesignVault</p>
                </div>
              </div>
              <p className="mt-4 text-neutral-600">
                "As a designer with zero coding skills, SaaS Launcher was the perfect platform to turn my idea into a real business."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-[#007a33] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-[#006128] px-6 py-10 sm:px-12 sm:py-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to launch your SaaS?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg text-[#007a33]/80">
                Join thousands of founders who've successfully launched their SaaS business without coding skills.
              </p>
              <Button 
                onClick={() => window.location.href = '/auth'} 
                size="lg"
                className="mt-10 bg-white text-[#007a33] hover:bg-neutral-100"
              >
                Start Now — It's Free
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex items-center">
              <LayoutDashboard className="h-6 w-6 text-[#007a33]" />
              <span className="ml-2 font-semibold">SaaS Launcher</span>
            </div>
            <div className="mt-8 md:mt-0">
              <div className="flex space-x-6">
                <a href="#" className="text-neutral-400 hover:text-neutral-900">
                  About
                </a>
                <a href="#" className="text-neutral-400 hover:text-neutral-900">
                  Contact
                </a>
                <a href="#" className="text-neutral-400 hover:text-neutral-900">
                  Terms
                </a>
                <a href="#" className="text-neutral-400 hover:text-neutral-900">
                  Privacy
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-neutral-200 pt-8 md:flex md:items-center md:justify-between">
            <div className="text-sm text-neutral-500">
              &copy; {new Date().getFullYear()} SaaS Launcher. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}