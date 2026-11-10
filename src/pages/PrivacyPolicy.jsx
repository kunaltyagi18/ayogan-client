import React from 'react';
import { ArrowUpRight, Mail, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const sections = [
  { title: 'Information we collect', body: 'When you use Ayojan, we may collect the account details you provide, such as your name, email address, college details, and profile information. We also store event registrations and organizer-created event information so the platform can work correctly.' },
  { title: 'How we use your information', body: 'We use this information to create and secure your account, show relevant event details, process registrations, help organizers manage capacity, and respond to support requests. We do not use your information for unrelated advertising.' },
  { title: 'What other users can see', body: 'Event information is intended to be visible to people using the college platform. Organizer details may appear on an event listing. Your private account credentials are not displayed publicly, and your password should never be shared with anyone.' },
  { title: 'Security and retention', body: 'We take reasonable steps to protect account and registration information. Information is retained while it is needed to operate the platform, maintain event records, resolve issues, or meet college administration requirements. Ask the college team if you need help with a specific record.' },
  { title: 'Your choices', body: 'You can review and update profile information from your account. You can also ask the college team about correcting or removing information, subject to records that the college is required to retain for administration or safety.' },
  { title: 'Contact us', body: 'For privacy questions, corrections, or account concerns, contact the college team at contact@ayojan.example. Replace this placeholder address with the official institution privacy contact before publishing the platform for real users.' }
];

export default function PrivacyPolicy() {
  const { isDark } = useTheme();

  return (
    <div className={`legal-page ${isDark ? 'is-dark' : ''}`}>
      <section className="legal-hero"><div className="site-container legal-hero-inner"><p className="faq-kicker"><span /> Ayojan / Privacy policy</p><h1>Your data should feel <em>safe here.</em></h1><p>Our plain-language privacy overview for students, organizers, and college administrators using Ayojan.</p><span className="legal-updated">Last updated: 9 November 2026</span></div></section>
      <section className="legal-content">
        <div className="site-container legal-layout">
          <aside className="legal-side"><div className="legal-side-icon"><ShieldCheck size={24} /></div><strong>Privacy, without the legal fog.</strong><span>Use this page to understand what the platform needs and why.</span><Link to="/faq">Read FAQs <ArrowUpRight size={14} /></Link></aside>
          <article className="legal-copy"><p className="legal-intro">Ayojan is a college event discovery and registration platform. This policy explains the information we handle when you browse events, create an account, register, or publish events as an approved organizer.</p>{sections.map((section, index) => <section key={section.title} className="legal-section"><span className="legal-section-number">0{index + 1}</span><div><h2>{section.title}</h2><p>{section.body}</p></div></section>)}<div className="legal-contact-box"><Mail size={18} /><div><strong>Questions about this policy?</strong><p>Contact the college team at <a href="mailto:contact@ayojan.example">contact@ayojan.example</a>.</p></div></div></article>
        </div>
      </section>
    </div>
  );
}
