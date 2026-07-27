import Header from '@/components/Header';
import Seo from '@/components/Seo';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import ContactSection from '@/components/ContactSection';
import { useLanguage } from '@/lib/i18n';
import { motion } from 'framer-motion';

const Contact = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background">
      <Seo title={t('seo.contact.title')} description={t('seo.contact.description')} />
      <Header />
      <main className="pt-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.75 }}
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
