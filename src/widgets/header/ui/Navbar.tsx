"use client";

import { Link, useLocation } from 'react-router';
import { User, LogIn } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import './Navbar.scss';

export function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { isAuthenticated, user } = useAuth();
  const [isOnLightBackground, setIsOnLightBackground] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setIsOnLightBackground(false);
      return;
    }

    const updateHeaderContrast = () => {
      const heroEnd = window.innerHeight - 96;
      setIsOnLightBackground((prev) => {
        if (!prev && window.scrollY > heroEnd + 24) {
          return true;
        }
        if (prev && window.scrollY < heroEnd - 24) {
          return false;
        }
        return prev;
      });
    };

    updateHeaderContrast();
    window.addEventListener('scroll', updateHeaderContrast, { passive: true });
    window.addEventListener('resize', updateHeaderContrast);

    return () => {
      window.removeEventListener('scroll', updateHeaderContrast);
      window.removeEventListener('resize', updateHeaderContrast);
    };
  }, [isHome]);

  const isActive = (path: string) => {
    if (path === '/find-pet' && location.pathname.startsWith('/animal/')) {
      return true;
    }
    return location.pathname === path;
  };

  return (
    <>
      <header className={`site-header${isHome ? ' site-header--hero' : ''}${isHome && isOnLightBackground ? ' site-header--hero-light' : ''}`}>
        <nav className="site-nav app-container" aria-label="Main navigation">
          <Link to="/" className="site-brand" aria-label="Animal shelter home page">
            <img src="/logo.png" alt="" className="site-brand__logo" />
            <span>Dnipro Animals</span>
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
              <>
                <Link to="/register" className={isActive('/register') ? 'signup-chip signup-chip--active' : 'signup-chip'}>
                  Sign up
                </Link>
                <Link to="/login" className={isActive('/login') ? 'login-chip login-chip--active' : 'login-chip'}>
                  <LogIn size={16} />
                  <span>Log in</span>
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
    </>
  );
}
