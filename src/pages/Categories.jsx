import React from 'react';
import { ArrowUpRight, BookOpen, Cpu, Music2, Sparkles, Trophy, UsersRound, Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const categories = [
  { name: 'Academic', eyebrow: 'Think deeper', description: 'Talks, seminars, paper presentations, debates, and the conversations that stay with you.', image: '/hero-workshop.png', icon: BookOpen, tone: 'sage' },
  { name: 'Cultural', eyebrow: 'Make some noise', description: 'Music, theatre, dance, and campus traditions that turn an ordinary evening into a memory.', image: '/hero-cultural-night.png', icon: Music2, tone: 'coral' },
  { name: 'Technical', eyebrow: 'Build what is next', description: 'Hackathons, coding contests, robotics, and project showcases for curious makers.', image: '/College-Event.jpg', icon: Cpu, tone: 'ink' },
  { name: 'Sports', eyebrow: 'Get in the game', description: 'Tournaments, fitness challenges, and the good kind of competition across campus.', image: '/hero-club-fair.png', icon: Trophy, tone: 'blue' },
  { name: 'Workshop', eyebrow: 'Learn by doing', description: 'Hands-on sessions where new skills become something you can actually take with you.', image: '/hero-workshop.png', icon: Wrench, tone: 'sand' },
];

export default function Categories() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const openCategory = (name) => navigate(`/events?category=${encodeURIComponent(name)}`);

  return (
    <div className={`categories-page ${isDark ? 'is-dark' : ''}`}>
      <section className="categories-hero">
        <div className="categories-shell categories-hero-grid">
          <div className="categories-hero-copy">
            <p className="categories-kicker"><Sparkles size={14} /> Explore campus life</p>
            <h1>Find the kind of <em>energy</em> that feels like yours.</h1>
            <p className="categories-hero-lede">Ayojan makes the busy campus feel easier to explore. Start with a category, follow your curiosity, and find your next good room.</p>
            <div className="categories-stat-row"><span><strong>05</strong><small>ways to spend a day</small></span><span><strong>18+</strong><small>events this week</small></span><span><strong>01</strong><small>place to start</small></span></div>
          </div>
          <div className="categories-hero-art">
            <img src="/hero-cultural-night.png" alt="Students sharing a cultural evening on campus" />
            <div className="categories-hero-overlay" />
            <div className="categories-hero-note"><span className="categories-live-dot" /> Happening around you</div>
            <div className="categories-hero-caption"><span>01 / 05</span><strong>There is always a seat for you.</strong></div>
          </div>
        </div>
      </section>

      <main className="categories-content"><div className="categories-shell">
        <div className="categories-section-heading"><div><p className="categories-kicker categories-kicker-dark"><span /> Choose your corner</p><h2>Different interests.<br /><em>One shared campus.</em></h2></div><p>Whether you want to learn, compete, create, or simply meet someone new, there is a starting point here.</p></div>
        <div className="categories-grid">
          {categories.map((category, index) => { const Icon = category.icon; return <button type="button" className={`category-card category-card-${category.tone} ${index === 0 ? 'category-card-featured' : ''}`} key={category.name} onClick={() => openCategory(category.name)} aria-label={`View ${category.name} events`}><img src={category.image} alt="" /><span className="category-card-shade" /><span className="category-card-number">0{index + 1}</span><span className="category-card-icon"><Icon size={20} /></span><span className="category-card-copy"><small>{category.eyebrow}</small><strong>{category.name}</strong><span>{category.description}</span><i>View events <ArrowUpRight size={15} /></i></span></button>; })}
        </div>
        <section className="categories-bottom-note"><div className="categories-bottom-icon"><UsersRound size={22} /></div><div><p className="categories-kicker categories-kicker-dark"><span /> Still deciding?</p><h3>Start with this week’s calendar.</h3><p>See what is actually happening next, then let the right category find you.</p></div><button type="button" className="categories-bottom-link" onClick={() => navigate('/events')}>Browse all events <ArrowUpRight size={17} /></button></section>
      </div></main>
    </div>
  );
}
