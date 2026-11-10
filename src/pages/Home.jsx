import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Compass,
  Layers3,
  ShieldCheck,
  Sparkles,
  Ticket,
  UsersRound,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const highlights = [
  { icon: Compass, number: '01', title: 'Discover college events', description: 'Find academic, cultural, sports, technical, workshop, and social events happening around your campus.', link: '/events', linkLabel: 'Browse events' },
  { icon: Ticket, number: '02', title: 'Register without the rush', description: 'Check the date, time, venue, available seats, and requirements before registering in a few simple steps.', link: '/events', linkLabel: 'Find an event' },
  { icon: ShieldCheck, number: '03', title: 'Organize with clarity', description: 'Organizers and admins can publish event details, manage capacity, and keep registrations in one place.', link: '/register', linkLabel: 'Host an event' },
];

const agenda = [
  { time: '09:30', title: 'Coding Club Orientation', type: 'Technical', tone: 'coral' },
  { time: '12:15', title: 'Inter-College Sports Meet', type: 'Sports', tone: 'sage' },
  { time: '16:00', title: 'Design Thinking Workshop', type: 'Workshop', tone: 'blue' },
];

const heroSlides = [
  { eyebrow: 'Your college event platform', tags: ['COLLEGE EVENTS', 'DISCOVER & REGISTER'], title: <>Every college event, <em>one clear place.</em></>, description: 'Browse what is happening on campus, understand the details, and register for the events you actually want to attend.', primary: 'Browse events', primaryHref: '/events', secondary: 'Host an event', secondaryHref: '/register', image: '/College-Event.jpg', position: 'center center', proof: 'Made for campus life.', proofDetail: 'One calendar for every student.' },
  { eyebrow: 'Find what interests you', tags: ['CLUBS & ACTIVITIES', 'SIMPLE REGISTRATION'], title: <>Your next campus experience <em>is closer than you think.</em></>, description: 'Explore events by category and find the talks, competitions, cultural programs, and workshops that fit your interests.', primary: 'Explore categories', primaryHref: '/categories', secondary: 'View events', secondaryHref: '/events', image: '/hero-cultural-night.png', position: 'center center', proof: 'Something for every student.', proofDetail: 'Academic, cultural, sports, and more.' },
  { eyebrow: 'For college organizers', tags: ['PUBLISH EVENTS', 'MANAGE REGISTRATIONS'], title: <>Plan it. Publish it. <em>Fill the room.</em></>, description: 'Create an event with the right date, venue, capacity, images, and requirements, then let students register with confidence.', primary: 'Create an event', primaryHref: '/register', secondary: 'See all events', secondaryHref: '/events', image: '/hero-workshop.png', position: 'center center', proof: 'Built for organizers.', proofDetail: 'Clear details, fewer follow-ups.' },
  { eyebrow: 'Never miss what matters', tags: ['UPCOMING EVENTS', 'CAMPUS COMMUNITY'], title: <>Do more than attend class. <em>Take part in campus.</em></>, description: 'Keep up with upcoming college events and make time for the experiences, people, and opportunities beyond the timetable.', primary: 'See upcoming events', primaryHref: '/events', secondary: 'About Ayojan', secondaryHref: '/about', image: '/hero-club-fair.png', position: 'center center', proof: 'One campus, many possibilities.', proofDetail: 'Find your next reason to show up.' },
];

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [backgroundSlide, setBackgroundSlide] = useState(0);
  const [isBackgroundTransitioning, setIsBackgroundTransitioning] = useState(false);
  const transitionTimer = useRef(null);
  const { user } = useAuth();
  const canManageEvents = ['admin', 'organizer'].includes(user?.role);
  const slide = heroSlides[activeSlide];

  const goToSlide = useCallback((nextIndex) => {
    if (nextIndex === activeSlide) return;
    if (transitionTimer.current) window.clearTimeout(transitionTimer.current);
    setActiveSlide(nextIndex);
    setIsBackgroundTransitioning(true);
    transitionTimer.current = window.setTimeout(() => {
      setBackgroundSlide(nextIndex);
      setIsBackgroundTransitioning(false);
    }, 1100);
  }, [activeSlide]);

  useEffect(() => {
    const timer = window.setInterval(() => goToSlide((activeSlide + 1) % heroSlides.length), 6500);
    return () => window.clearInterval(timer);
  }, [activeSlide, goToSlide]);

  useEffect(() => () => {
    if (transitionTimer.current) window.clearTimeout(transitionTimer.current);
  }, []);

  const previousSlide = () => goToSlide((activeSlide - 1 + heroSlides.length) % heroSlides.length);
  const nextSlide = () => goToSlide((activeSlide + 1) % heroSlides.length);
  const secondaryAction = slide.secondary === 'Host an event' && !canManageEvents ? { label: 'Explore events', href: '/events' } : { label: slide.secondary, href: slide.secondaryHref };

  return (
    <div className="home-page">
      <section className="hero-section site-container">
        <div className="hero-background" aria-hidden="true">
          <div className="hero-background-layer" style={{ backgroundImage: `url(${heroSlides[backgroundSlide].image})`, backgroundPosition: heroSlides[backgroundSlide].position }} />
          {isBackgroundTransitioning && <div className="hero-background-layer hero-background-transition" style={{ backgroundImage: `url(${slide.image})`, backgroundPosition: slide.position }} />}
        </div>
        <div className="hero-copy">
          <p className="eyebrow"><Sparkles size={14} /> {slide.eyebrow}</p>
          <div className="hero-tags">{slide.tags.map((tag, index) => <span key={tag}>{index === 0 ? <Compass size={13} /> : <Layers3 size={13} />} {tag}</span>)}</div>
          <h1 key={activeSlide} className="hero-slide-title">{slide.title}</h1>
          <p className="hero-lede">{slide.description}</p>
          <div className="hero-actions"><Link to={slide.primaryHref} className="button button-primary">{slide.primary} <ArrowUpRight size={18} /></Link><Link to={secondaryAction.href} className="button button-outline">{secondaryAction.label} <ChevronRight size={16} /></Link></div>
          <div className="hero-proof"><div className="proof-avatars" aria-hidden="true"><img src="/hero-cultural-night.png" alt="" /><img src="/hero-workshop.png" alt="" /><img src="/hero-club-fair.png" alt="" /><span>+</span></div><p><strong>{slide.proof}</strong><br />{slide.proofDetail}</p></div>
        </div>
        <div className="hero-visual" aria-label="Students participating in a college event">
          <div className="hero-image-frame"><img src="/College-Event.jpg" alt="Students gathering at a college event" /><div className="image-grain" /></div>
          <div className="hero-float-card hero-float-card-top"><span className="status-dot" /><div><strong>Live on campus</strong><small>Upcoming events</small></div></div>
          <div className="hero-float-card hero-float-card-bottom"><div className="float-icon"><Ticket size={18} /></div><div><small>Register for</small><strong>College events</strong></div><ArrowUpRight size={17} /></div>
          <span className="hero-sticker">Show up<br />curious.</span>
        </div>
        <div className="hero-slider-ui" aria-label="Hero slides"><button type="button" onClick={previousSlide} aria-label="Previous slide"><ChevronLeft size={17} /></button><div className="hero-dots">{heroSlides.map((item, index) => <button type="button" key={item.eyebrow} className={index === activeSlide ? 'active' : ''} onClick={() => goToSlide(index)} aria-label={`Go to slide ${index + 1}`} />)}</div><span className="hero-slide-count">0{activeSlide + 1} <i>/ 0{heroSlides.length}</i></span><button type="button" onClick={nextSlide} aria-label="Next slide"><ChevronRight size={17} /></button></div>
      </section>

      <section className="product-showcase"><div className="site-container showcase-grid"><div className="showcase-copy"><p className="eyebrow eyebrow-light">How Ayojan helps</p><h2>From event listings to <em>confirmed registrations.</em></h2><p>Students get the information they need. Organizers get one reliable place to publish and manage college events.</p><div className="showcase-note"><span className="showcase-line" /><span>Built for the way college events actually run.</span></div></div><div className="showcase-visual" aria-label="Preview of the Ayojan event platform"><div className="mockup mockup-left"><div className="mockup-topbar"><span className="mockup-brand">ayojan.</span><span className="mockup-mini-dot" /></div><div className="mockup-hero pale"><small>THIS WEEK AT COLLEGE</small><strong>Find an<br />event to join.</strong><span className="mockup-pill">Explore -&gt;</span></div><div className="mockup-stat-row"><span><b>18</b><small>events</small></span><span><b>06</b><small>categories</small></span><span><b>120+</b><small>students</small></span></div><div className="mockup-section-title">Upcoming events <span>View all -&gt;</span></div><div className="mockup-event-row"><img src="/College-Event.jpg" alt="" /><div><b>Tech Club Orientation</b><small>Today - Seminar Hall</small></div></div><div className="mockup-event-row"><div className="mockup-color-block" /><div><b>Cultural Evening</b><small>Tomorrow - Main Lawn</small></div></div></div><div className="showcase-connector"><span>Find an event<br />worth showing up for.</span><svg viewBox="0 0 180 80" fill="none" aria-hidden="true"><path d="M2 52 C55 0, 70 75, 112 33 C132 13, 145 22, 175 22" stroke="currentColor" strokeWidth="1.5" /><path d="M167 15 L175 22 L166 29" stroke="currentColor" strokeWidth="1.5" /></svg></div><div className="mockup mockup-right"><div className="mockup-topbar"><span className="mockup-brand">ayojan.</span><span className="mockup-nav-lines" /></div><div className="mockup-hero dark"><small>TECH TALK 2026</small><strong>Learn more.<br />Build better.</strong><span className="mockup-pill">Register now</span></div><div className="mockup-wide-image"><img src="/hero-workshop.png" alt="Students attending a workshop" /></div><div className="mockup-details"><span><b>06:30 PM</b><small>Friday</small></span><span><b>Main Hall</b><small>College campus</small></span><span><b>120 seats</b><small>available</small></span></div><div className="mockup-body-lines"><i /><i /><i /><i /></div></div></div></div></section>

      <section className="signal-strip"><div className="site-container signal-inner"><span>One platform for</span><div className="signal-items"><span><CalendarDays size={16} /> Discover events</span><span><UsersRound size={16} /> Join campus life</span><span><Ticket size={16} /> Register online</span></div></div></section>

      <section className="section section-warm"><div className="site-container"><div className="section-heading split-heading"><div><p className="eyebrow eyebrow-dark">Everything in one place</p><h2>Less searching. More <em>taking part.</em></h2></div><p>See the complete event details before you leave your room, then register and keep track of the events you joined.</p></div><div className="highlight-grid">{highlights.map((highlight) => <article className="highlight-card" key={highlight.number}><div className="highlight-top"><span>{highlight.number}</span>{React.createElement(highlight.icon, { size: 22 })}</div><h3>{highlight.title}</h3><p>{highlight.description}</p><Link to={highlight.link} className="card-link">{highlight.linkLabel} <ArrowUpRight size={15} /></Link></article>)}</div></div></section>

      <section className="section section-dark"><div className="site-container story-grid"><div className="story-copy"><p className="eyebrow eyebrow-light"><Clock3 size={14} /> The complete event flow</p><h2>Know what is happening. <em>Show up ready.</em></h2><p>Ayojan keeps event discovery, registration, and organizer updates connected so your college experience does not get lost in scattered messages.</p><ul className="check-list"><li><Check size={16} /> Clear date, time, venue, and capacity</li><li><Check size={16} /> Quick registration for students</li><li><Check size={16} /> Organizer-managed event details</li></ul><Link to="/events" className="button button-light">Browse college events <ArrowUpRight size={18} /></Link></div><div className="agenda-card"><div className="agenda-header"><span>This week's campus plan</span><span className="agenda-live">LIVE</span></div><div className="agenda-list">{agenda.map((item) => <div className="agenda-item" key={item.time}><span className="agenda-time">{item.time}</span><span className={`agenda-marker ${item.tone}`} /><div><strong>{item.title}</strong><small>{item.type}</small></div><ArrowUpRight size={16} /></div>)}</div><div className="agenda-footer"><span>Ayojan</span><span>Updated by organizers</span></div></div></div></section>

      <section className="section final-cta"><div className="site-container cta-panel"><div><p className="eyebrow eyebrow-dark">Your next college event</p><h2>Find something worth attending.</h2></div><div className="cta-side"><p>Browse events, check the details, and register for the next thing happening on your campus.</p><Link to="/events" className="button button-primary">Explore events <ArrowUpRight size={18} /></Link></div><div className="cta-image"><img src="/hero-club-fair.png" alt="Students enjoying a college event" /></div></div></section>
    </div>
  );
}
