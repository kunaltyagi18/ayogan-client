import React from 'react';
import { ArrowUpRight, CalendarDays, Compass, Heart, ShieldCheck, Sparkles, Target, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const principles = [
  { number: '01', icon: Compass, title: 'Make discovery feel human', text: 'A good event should not get lost in a noisy feed. Ayojan keeps the useful details close and the feeling of the event intact.' },
  { number: '02', icon: ShieldCheck, title: 'Keep the details dependable', text: 'Clear timing, clear places, clear next steps. Less chasing organisers in group chats, more confidence about showing up.' },
  { number: '03', icon: Users, title: 'Give every community a home', text: 'Clubs, classrooms, teams, and first-time hosts all deserve a simple way to invite people in.' },
];

const values = [
  { icon: Target, title: 'Useful by default', text: 'Every screen earns its place and helps you get somewhere.' },
  { icon: Heart, title: 'Made with care', text: 'The small details matter when people are giving their time.' },
  { icon: CalendarDays, title: 'Built for real days', text: 'From the first sign-up to the last photo, the whole rhythm counts.' },
];

export default function About() {
  const { isDark } = useTheme();

  return (
    <div className={`about-page ${isDark ? 'is-dark' : ''}`}>
      <section className="about-hero">
        <div className="about-shell about-hero-grid">
          <div className="about-hero-copy">
            <p className="about-kicker"><Sparkles size={14} /> The idea behind Ayojan</p>
            <h1>College is more than a timetable. It is a <em>shared rhythm.</em></h1>
            <p className="about-hero-lede">Ayojan is a personal project built around one simple thought: the best campus moments should be easier to find, join, and remember.</p>
            <div className="about-hero-actions"><Link to="/events" className="about-primary-link">Explore events <ArrowUpRight size={17} /></Link><span>Designed for curious people.</span></div>
          </div>
          <div className="about-hero-art">
            <img src="/College-Event.jpg" alt="Students connecting at a college event" />
            <div className="about-hero-overlay" />
            <div className="about-note about-note-top"><span>Built around people</span><strong>Not just programmes.</strong></div>
            <div className="about-note about-note-bottom"><span>AYOJAN / 2026</span><strong>Make room for good things.</strong></div>
          </div>
        </div>
      </section>

      <main className="about-main">
        <section className="about-shell about-intro"><div className="about-intro-heading"><p className="about-kicker about-kicker-dark"><span /> Why this exists</p><h2>A calmer way to be part of <em>campus life.</em></h2></div><div className="about-intro-copy"><p>There is always something happening: a club meeting in a borrowed room, a workshop that fills up fast, a performance you almost missed.</p><p>Ayojan brings those moments into one thoughtful place, so finding your people feels less like work and more like a good start.</p><div className="about-mini-stats"><span><strong>01</strong><small>shared calendar</small></span><span><strong>05</strong><small>ways to explore</small></span><span><strong>∞</strong><small>reasons to show up</small></span></div></div></section>

        <section className="about-principles"><div className="about-shell"><div className="about-section-top"><div><p className="about-kicker about-kicker-dark"><span /> Our approach</p><h2>Simple enough to use.<br /><em>Thoughtful enough to keep.</em></h2></div><p>Good event software should feel like a helpful teammate: present when you need it, invisible when you do not.</p></div><div className="about-principle-list">{principles.map((principle) => { const Icon = principle.icon; return <article className="about-principle" key={principle.number}><span className="about-principle-number">{principle.number}</span><span className="about-principle-icon"><Icon size={22} /></span><div><h3>{principle.title}</h3><p>{principle.text}</p></div><ArrowUpRight className="about-principle-arrow" size={19} /></article>; })}</div></div></section>

        <section className="about-values"><div className="about-shell"><div className="about-values-heading"><p className="about-kicker"><Sparkles size={14} /> What we care about</p><h2>The details that make a place feel <em>welcoming.</em></h2></div><div className="about-values-grid">{values.map((value) => { const Icon = value.icon; return <article key={value.title}><Icon size={22} /><h3>{value.title}</h3><p>{value.text}</p></article>; })}</div></div></section>

        <section className="about-cta"><div className="about-shell about-cta-inner"><div><p className="about-kicker about-kicker-dark"><span /> Your next good idea</p><h2>There is a place for you here.</h2></div><Link to="/events" className="about-primary-link">See what is happening <ArrowUpRight size={17} /></Link></div></section>
      </main>
    </div>
  );
}
