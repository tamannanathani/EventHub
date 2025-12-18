import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Sparkles, Users, Ticket } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Landing = () => {
  return (
    <div className="min-h-screen gradient-hero">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
            >
              Find & Book
              <span className="text-gradient"> Unforgettable </span>
              Events
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            >
              Your one-stop platform for discovering concerts, conferences, workshops, and more. 
              Book tickets instantly and create memories that last a lifetime.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center justify-center"
            >
              <Link to="/signup">
                <Button size="lg" className="gradient-primary text-primary-foreground px-8 py-6 text-lg shadow-glow">
                  Get Started Free
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-3xl mx-auto"
          >
            {[
              { icon: Calendar, label: 'Events Hosted', value: '10,000+' },
              { icon: Users, label: 'Happy Attendees', value: '500K+' },
              { icon: Ticket, label: 'Tickets Sold', value: '1M+' },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="flex flex-col items-center p-6 rounded-2xl bg-card border border-border"
              >
                <stat.icon className="w-8 h-8 text-primary mb-3" />
                <span className="text-3xl font-bold text-foreground">{stat.value}</span>
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-card">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose EventHub?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to discover, book, and manage your event experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Easy Discovery',
                description: 'Find events by location, date, or category with our powerful search.',
                icon: '🔍',
              },
              {
                title: 'Instant Booking',
                description: 'Book your tickets in seconds with our streamlined checkout process.',
                icon: '⚡',
              },
              {
                title: 'Digital Tickets',
                description: 'Get QR code tickets delivered instantly to your device.',
                icon: '📱',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-8 rounded-2xl bg-background border border-border hover:shadow-lg transition-shadow"
              >
                <span className="text-4xl mb-4 block">{feature.icon}</span>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="relative overflow-hidden rounded-3xl gradient-primary p-12 md:p-20 text-center">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-6">
                Ready to Start Your Journey?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of event enthusiasts. Sign up today and never miss out on amazing experiences.
              </p>
              <Link to="/signup">
                <Button size="lg" variant="secondary" className="px-8 py-6 text-lg font-semibold">
                  Create Free Account
                </Button>
              </Link>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© 2024 EventHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
