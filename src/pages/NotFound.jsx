import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return <main className="site-container" style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', textAlign: 'center', padding: '80px 0' }}><div><p className="eyebrow eyebrow-dark">404 · Wrong turn</p><h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(48px, 8vw, 92px)', margin: 0 }}>This room is empty.</h1><p style={{ color: 'var(--muted)', maxWidth: 430, margin: '22px auto 28px', lineHeight: 1.6 }}>The page you’re looking for has moved, or it never made it onto the calendar.</p><Link to="/" className="button button-primary"><ArrowLeft size={17} /> Back to Ayojan</Link></div></main>;
}
