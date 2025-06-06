import { motion } from 'framer-motion';
import { Star, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

const testimonials = [
  {
    quote:
      'SaaS Launcher completely changed how I approached my SaaS project. I went from feeling overwhelmed to having clear, actionable steps every day.',
    author: 'Sarah J.',
    role: 'Founder, TaskFlow',
    avatar:
      'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    stars: 5,
  },
  {
    quote:
      'As someone with zero coding skills, I never thought I could build a SaaS. With SaaS Launcher, I launched in just 6 weeks and got my first paying customers!',
    author: 'Mark T.',
    role: 'Creator, ContentPulse',
    avatar:
      'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    stars: 5,
  },
  {
    quote:
      'The interactive checklist kept me accountable, and the curated resources saved me countless hours of research. Worth every penny.',
    author: 'Elena K.',
    role: 'Founder, DesignVault',
    avatar:
      'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    stars: 5,
  },
  {
    quote:
      'Finally, a platform that understands what no-code founders really need. The step-by-step guidance is invaluable.',
    author: 'David R.',
    role: 'Founder, AutomatePro',
    avatar:
      'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    stars: 5,
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-b from-[#0166ce]/10 to-white">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
            <div className="max-w-2xl">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl"
              >
                Launch Your SaaS
                <span className="block text-[#0166ce]">Faster Than Ever</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-6 text-lg leading-8 text-gray-600"
              >
                SaaS Launcher guides you through every step of building your software business — from idea validation to marketing and launch.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-10 flex items-center gap-x-6"
              >
                <Button size="lg" className="group">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <a href="#how-it-works" className="text-sm font-semibold leading-6 text-gray-900">
                  Learn more <span aria-hidden="true">→</span>
                </a>
              </motion.div>
            </div>
            <div className="relative">
              <motion.img
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                src="https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,quality=80/uploads/publication/logo/7a680e01-2555-4abb-9fea-1ba9a926eeed/thumb_Saas_Launcher_Logo_transparent.png"
                alt="SaaS Launcher"
                className="w-full max-w-lg mx-auto"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-white to-[#0166ce]/5">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1 rounded-full bg-[#3B82F6]/10 text-[#0166ce] font-medium text-sm mb-4"
            >
              TESTIMONIALS
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#0166ce] to-[#3B82F6] bg-clip-text text-transparent"
            >
              Loved by Founders
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg text-gray-600"
            >
              Join hundreds of founders who've successfully launched their SaaS using our platform
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-lg shadow-[#0166ce]/5 hover:shadow-xl hover:shadow-[#0166ce]/10 transition-all duration-300"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.stars)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className="text-[#3B82F6] fill-[#3B82F6]"
                    />
                  ))}
                </div>

                <p className="text-gray-700 mb-6 italic">
                  "{testimonial.quote}"
                </p>

                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-[#3B82F6]/20"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
                    <p className="text-sm text-[#0166ce]">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}