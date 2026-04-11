import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import ContactSection from '@/components/ContactSection';
import { motion } from 'framer-motion';

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ContactSection />
        </motion.div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Contact;
