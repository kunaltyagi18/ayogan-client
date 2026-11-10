import React, { useState } from 'react';
import { ArrowUpRight, ChevronDown, CircleHelp, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const faqs = [
  { question: 'How do I register for a college event?', answer: 'Open an event from the Events page, review its date, venue, capacity, and requirements, then select Register Now. You must be signed in as a student to complete a registration.' },
  { question: 'Can I cancel my registration?', answer: 'Yes. Go to My registrations, open the registration you no longer need, and choose the cancellation option. Cancellation may be unavailable once an event has started or the organizer has closed registrations.' },
  { question: 'How do I see the events I have joined?', answer: 'After signing in, open My registrations from the navigation menu. You will find your upcoming and past registrations there, along with the event details shared by the organizer.' },
  { question: 'Who can publish an event?', answer: 'Only approved organizers and college administrators can create, update, or delete events. Students can browse events and participate, but they cannot publish an event.' },
  { question: 'What information should I check before registering?', answer: 'Check the event date and time, venue, organizer, available seats, registration deadline, and any requirements. If something is unclear, contact the organizer or the college team before registering.' },
  { question: 'Are events free for students?', answer: 'The event listing shows the details provided by its organizer. Most campus events are free, but any fee or special requirement should be clearly mentioned on the event page.' },
  { question: 'I forgot my password. What should I do?', answer: 'Use the sign-in page to contact the college team for help with account access. Do not share your password with an organizer or anyone claiming to provide support.' },
  { question: 'How can I report an incorrect event detail?', answer: 'Use the Contact page and include the event name, the incorrect detail, and the correction you expect. The college team can verify and update the listing.' }
];

export default function FAQ() {
  const { isDark } = useTheme();
  const [openIndex, setOpenIndex] = useState(0);
  const faqItems = faqs.map((faq, index) => ({ ...faq, index }));

  return (
    <div className={`faq-page ${isDark ? 'is-dark' : ''}`}>
      <section className="faq-hero">
        <div className="site-container faq-hero-grid">
          <div className="faq-hero-copy">
            <p className="faq-kicker"><span /> Ayojan help center</p>
            <h1>Questions? <em>Start here.</em></h1>
            <p className="faq-hero-lede">Clear answers for students, organizers, and administrators using the college event platform.</p>
          </div>
          <div className="faq-hero-card"><div className="faq-hero-icon"><CircleHelp size={25} /></div><span className="faq-card-label">Need a little more help?</span><strong>We are here to keep campus participation simple.</strong><Link to="/contact" className="faq-card-link">Talk to the college team <ArrowUpRight size={15} /></Link></div>
        </div>
      </section>

      <section className="faq-content">
        <div className="site-container faq-content-grid">
          <aside className="faq-side-note"><p className="faq-kicker faq-kicker-muted"><span /> Quick guide</p><h2>Make your next <em>step simple.</em></h2><p>Browse an event, understand the details, register once, and keep the plan in your account.</p><div className="faq-side-stat"><strong>{faqs.length}</strong><span>common questions<br />answered clearly</span></div><Link to="/events" className="faq-side-link">Browse events <ArrowUpRight size={15} /></Link></aside>
          <div className="faq-list-wrap">
            <div className="faq-list-heading"><div><p className="faq-kicker faq-kicker-muted"><span /> Common questions</p><h2>Everything you need to <em>show up ready.</em></h2></div><span>{faqItems.length} answers</span></div>
            <div className="faq-list">
              {faqItems.map((faq) => {
                const isOpen = openIndex === faq.index;
                return <article className={`faq-item ${isOpen ? 'is-open' : ''}`} key={faq.question}><button type="button" onClick={() => setOpenIndex(isOpen ? null : faq.index)} aria-expanded={isOpen}><span className="faq-item-number">0{faq.index + 1}</span><span className="faq-question">{faq.question}</span><span className="faq-toggle"><ChevronDown size={18} /></span></button><div className="faq-answer"><div className="faq-answer-inner"><p>{faq.answer}</p></div></div></article>;
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="faq-contact-strip"><div className="site-container faq-contact-inner"><div><p className="faq-kicker"><span /> Still need help?</p><h2>Let&apos;s find the right <em>answer together.</em></h2></div><a href="mailto:contact@ayojan.example" className="faq-contact-link"><Mail size={16} /> contact@ayojan.example <ArrowUpRight size={15} /></a></div></section>
    </div>
  );
}
