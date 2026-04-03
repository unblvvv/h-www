"use client";

import { Link, useLocation } from 'react-router';
import { Heart, User, LogIn } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LoginModal } from './LoginModal';
import './Navbar.scss';

export function Navbar() {
  const location = useLocation();
  const { isAuthenticated, user, login } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const isActive = (path: string) => {
    if (path === '/find-pet' && location.pathname.startsWith('/animal/')) {
      return true;
    }
    return location.pathname === path;
  };

  return (
    <>
      <header className="site-header">
        <nav className="site-nav app-container" aria-label="Main navigation">
          <Link to="/" className="site-brand" aria-label="Animal shelter home page">
            <Heart size={22} />
            <span>Shelter</span>
          </Link>

          <div className="site-nav__links">
            <Link to="/" className={isActive('/') ? 'is-active' : ''}>
              Home
            </Link>
            <Link to="/find-pet" className={isActive('/find-pet') ? 'is-active' : ''}>
              Find a pet
            </Link>
            <Link to="/donate" className={isActive('/donate') ? 'is-active' : ''}>
              Donate
            </Link>
            <Link to="/admin" className={isActive('/admin') ? 'is-active' : ''}>
              Admin
            </Link>
          </div>

          <div className="site-nav__auth">
            {isAuthenticated ? (
              <Link to="/profile" className={isActive('/profile') ? 'profile-chip profile-chip--active' : 'profile-chip'}>
                <User size={16} />
                <span>{user?.name || 'Profile'}</span>
              </Link>
            ) : (
              <button className="login-chip" onClick={() => setShowLoginModal(true)}>
                <LogIn size={16} />
                <span>Log in</span>
              </button>
            )}
          </div>
        </nav>
      </header>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={login}
      />
    </>
  );
}
