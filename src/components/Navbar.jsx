import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowUpRight, LogOut, Menu, Moon, Sun, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const navLinks = [{ path: '/', label: 'Home' }, { path: '/events', label: 'Events' }, { path: '/categories', label: 'Categories' }, { path: '/about', label: 'About' }, { path: '/gallery', label: 'Gallery' }];

const resolveProfileImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const serverUrl = apiUrl.replace(/\/api\/?$/, '');
  return `${serverUrl}${imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`}`;
};

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [avatarImageError, setAvatarImageError] = useState(false);
  const profileMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const canManageEvents = ['admin', 'organizer'].includes(user?.role);
  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.name || 'Account';
  const initials = displayName.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  const profileImageUrl = resolveProfileImageUrl(user?.profilePicture);
  const closeMenu = () => setMenuOpen(false);
  const handleLogout = async () => { await logout(); setProfileOpen(false); navigate('/'); };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) setProfileOpen(false);
    };
    const handleEscape = (event) => {
      if (event.key === 'Escape') setProfileOpen(false);
    };
    document.addEventListener('pointerdown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('pointerdown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    setAvatarImageError(false);
  }, [profileImageUrl]);

  return <header className={`site-nav ${isDark ? 'site-nav-dark' : ''}`}><div className="site-container nav-inner">
    <Link to="/" className="wordmark" onClick={closeMenu} aria-label="Ayojan home"><span className="wordmark-mark">A</span><span>Ayojan</span></Link>
    <nav className={`nav-links ${menuOpen ? 'nav-links-open' : ''}`} aria-label="Primary navigation">{navLinks.map((link) => <Link key={link.path} to={link.path} onClick={closeMenu} className={location.pathname === link.path ? 'active' : ''}>{link.label}</Link>)}<Link to="/contact" onClick={closeMenu} className={location.pathname === '/contact' ? 'active' : ''}>Contact</Link>{canManageEvents && <Link to="/admin" onClick={closeMenu} className={location.pathname === '/admin' ? 'active' : ''}>Dashboard</Link>}<div className="mobile-nav-actions"><Link to="/events" className="button button-primary" onClick={closeMenu}>Explore events <ArrowUpRight size={16} /></Link></div></nav>
    <div className="nav-actions"><button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle colour theme">{isDark ? <Sun size={17} /> : <Moon size={17} />}</button>{isAuthenticated ? <div className="profile-menu" ref={profileMenuRef}><button className="profile-trigger" onClick={() => setProfileOpen((open) => !open)} aria-expanded={profileOpen} aria-label={`Open profile menu for ${displayName}`}>{profileImageUrl && !avatarImageError ? <img className="avatar avatar-image" src={profileImageUrl} alt="" onError={() => setAvatarImageError(true)} /> : <span className="avatar">{initials}</span>}<span className="profile-name">{displayName}</span></button>{profileOpen && <div className="profile-dropdown"><Link to="/profile" onClick={() => setProfileOpen(false)}>My profile</Link><Link to="/my-registrations" onClick={() => setProfileOpen(false)}>My registrations</Link>{canManageEvents && <Link to="/admin" onClick={() => setProfileOpen(false)}>Dashboard</Link>}{canManageEvents && <Link to="/register" onClick={() => setProfileOpen(false)}>Create an event</Link>}<button onClick={handleLogout}><LogOut size={15} /> Log out</button></div>}</div> : <Link to="/login" className="login-link">Sign in</Link>}<Link to={isAuthenticated ? (canManageEvents ? '/admin' : '/events') : '/signup'} className="button button-small">{isAuthenticated ? (canManageEvents ? 'Manage events' : 'Explore events') : 'Join us'} <ArrowUpRight size={15} /></Link></div>
    <button className="menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation menu" aria-expanded={menuOpen}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
  </div></header>;
}
