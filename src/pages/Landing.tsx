import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

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
  {
    quote:
      "The community support and resource library are game-changers. I've learned so much from other founders.",
    author: 'Michelle L.',
    role: 'Creator, LearnSpace',
    avatar:
      'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    stars: 5,
  },
  {
    quote:
      'SaaS Launcher helped me validate my idea and find my first customers before writing a single line of code.',
    author: 'James W.',
    role: 'Founder, MarketPulse',
    avatar:
      'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    stars: 5,
  },
  {
    quote:
      "The no-code tools recommendation saved me thousands in development costs. Couldn't be happier!",
    author: 'Lisa M.',
    role: 'Creator, DataFlow',
    avatar:
      'https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    stars: 5,
  },
];

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="section bg-gray-50 overflow-hidden">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-700 font-medium text-sm mb-4"
          >
            TESTIMONIALS
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Why People Love SaaS Launcher
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-600"
          >
            Hear from founders who've built successful SaaS products using our
            platform
          </motion.p>
        </div>

        {/* Infinite Scroll */}
        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-6 w-max"
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              x: {
                duration: 30,
                ease: 'linear',
                repeat: Infinity,
              },
            }}
          >
            {/* Duplicate list to ensure smooth loop */}
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[350px] bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all duration-300"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.stars)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className="text-yellow-400 fill-yellow-400"
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
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.author}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
