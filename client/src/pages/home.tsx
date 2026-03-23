import { useState } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { SubjectsSection } from '@/components/SubjectsSection';
import { AboutSection } from '@/components/AboutSection';
import { TutorsSection } from '@/components/TutorsSection';
import { PackagesSection } from '@/components/PackagesSection';
import { VideoSection } from '@/components/VideoSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { RegisterModal } from '@/components/RegisterModal';

export default function Home() {
  const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <Hero onRegisterClick={() => setRegisterOpen(true)} />
        <SubjectsSection />
        <AboutSection />
        <TutorsSection />
        <PackagesSection />
        <VideoSection />
        <ContactSection />
      </main>
      
      <Footer />

      <RegisterModal open={registerOpen} onClose={() => setRegisterOpen(false)} />
    </div>
  );
}
