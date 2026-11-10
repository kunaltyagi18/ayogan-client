import React from 'react';
import { ArrowUpRight, Instagram, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer site-footer-dark">
      <div className="site-container footer-main">
        <div className="footer-brand">
          <Link to="/" className="wordmark wordmark-footer"><span className="wordmark-mark">A</span><span>Ayojan</span></Link>
          <p>College events, registrations, and campus participation - all in one place.</p>
        </div>
        <div className="footer-links">
          <div>
            <span className="footer-label">Explore</span>
            <Link to="/events">All events</Link>
            <Link to="/categories">Categories</Link>
            <Link to="/gallery">Event gallery</Link>
          </div>
          <div>
            <span className="footer-label">Your account</span>
            <Link to="/my-registrations">My registrations</Link>
            <Link to="/profile">My profile</Link>
            <Link to="/faq">Help & FAQ</Link>
          </div>
          <div>
            <span className="footer-label">Get in touch</span>
            <Link to="/contact">Contact the college team <ArrowUpRight size={13} /></Link>
            <a href="mailto:contact@ayojan.example">contact@ayojan.example <ArrowUpRight size={13} /></a>
            <span className="social-links">
              <a href="https://www.instagram.com" aria-label="Instagram"><Instagram size={17} /></a>
              <a href="https://www.linkedin.com" aria-label="LinkedIn"><Linkedin size={17} /></a>
              <a href="mailto:contact@ayojan.example" aria-label="Email"><Mail size={17} /></a>
            </span>
          </div>
        </div>
      </div>
      <div className="site-container footer-bottom"><span>(c) {new Date().getFullYear()} Ayojan</span><span>For students, clubs, and college organizers.</span><span><Link to="/privacy">Privacy policy</Link> <span className="footer-terms-separator">-</span> <Link to="/terms">Terms</Link></span></div>
    </footer>
  );
}
