"use client";

import { Link, useLocation, useNavigate } from 'react-router';
import { User, LogIn, Moon, Sun } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import './Navbar.scss';

type NotificationType = 'adoption' | 'donation' | 'system' | 'message';

interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  text: string;
  time: string;
  isRead: boolean;
}

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHeroStyledPage = true;
  const { isAuthenticated, isAdmin, user } = useAuth();
  const [isOnLightBackground, setIsOnLightBackground] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'adoption-demo-1',
      type: 'adoption',
      title: 'Нова заявка на усиновлення',
      text: 'Луна отримала нову заявку на усиновлення.',
      time: '5 хв тому',
      isRead: false,
    },
  ]);
  const notificationsWrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateHeaderContrast = () => {
      const anchor = document.querySelector<HTMLElement>('[data-header-anchor]');
      if (!anchor) {
        setIsOnLightBackground(true);
        return;
      }

      const anchorTop = anchor.getBoundingClientRect().top + window.scrollY - 96;
      const anchorBottom = anchorTop + anchor.offsetHeight;

      setIsOnLightBackground((prev) => {
        if (!prev && (window.scrollY < anchorTop - 24 || window.scrollY > anchorBottom + 24)) {
          return true;
        }
        if (prev && window.scrollY > anchorTop + 24 && window.scrollY < anchorBottom - 24) {
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
  }, [location.pathname]);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = savedTheme ? savedTheme === 'dark' : prefersDark;

    document.documentElement.classList.toggle('dark', shouldUseDark);
    setIsDarkTheme(shouldUseDark);
  }, []);

  useEffect(() => {
    if (!isNotificationsOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!notificationsWrapRef.current?.contains(target)) {
        setIsNotificationsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isNotificationsOpen]);

  const isActive = (routePath: string) => {
    if (routePath === '/find-pet' && location.pathname.startsWith('/animal/')) {
      return true;
    }
    return location.pathname === routePath;
  };

  const handleThemeToggle = () => {
    setIsDarkTheme((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      window.localStorage.setItem('theme', next ? 'dark' : 'light');
      return next;
    });
  };

  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })));
  };

  const handleOpenMailbox = (focusMessageId?: string) => {
    setIsNotificationsOpen(false);
    if (focusMessageId) {
      navigate('/mailbox', { state: { focusMessageId } });
      return;
    }

    navigate('/mailbox');
  };

  const getTypeClassName = (type: NotificationType) => {
    if (type === 'adoption') return 'notifications-item--adoption';
    if (type === 'donation') return 'notifications-item--donation';
    if (type === 'system') return 'notifications-item--system';
    return 'notifications-item--message';
  };

  return (
    <header
      className={`site-header${isHeroStyledPage ? ' site-header--hero' : ''}${isHeroStyledPage && isOnLightBackground ? ' site-header--hero-light' : ''}`}
    >
      <nav className="site-nav app-container" aria-label="Головна навігація">
        <Link to="/" className="site-brand" aria-label="Головна сторінка притулку для тварин">
          <img src="/logo.png" alt="" className="site-brand__logo" />
          <span>Dnipro Animals</span>
        </Link>

        <div className="site-nav__links">
          <Link to="/" className={isActive('/') ? 'is-active' : ''}>
            Головна
          </Link>
          <Link to="/find-pet" className={isActive('/find-pet') ? 'is-active' : ''}>
            Знайти улюбленця
          </Link>
          <Link to="/donate" className={isActive('/donate') ? 'is-active' : ''}>
            Підтримати
          </Link>
          {isAuthenticated && isAdmin ? (
            <Link to="/admin" className={isActive('/admin') ? 'is-active' : ''}>
              Адмін
            </Link>
          ) : null}
        </div>

        <div className="site-nav__auth">
          <div className="site-nav__notifications" ref={notificationsWrapRef}>
            <button
              type="button"
              className={isNotificationsOpen ? 'notifications-chip notifications-chip--active' : 'notifications-chip'}
              onClick={() => setIsNotificationsOpen((prev) => !prev)}
              aria-label="Сповіщення"
              aria-expanded={isNotificationsOpen}
              aria-controls="notifications-panel"
            >
              <svg width="17" height="19" viewBox="0 0 17 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9.94179 16.8333C9.79528 17.0859 9.58499 17.2955 9.33198 17.4413C9.07896 17.587 8.7921 17.6637 8.50012 17.6637C8.20814 17.6637 7.92128 17.587 7.66827 17.4413C7.41525 17.2955 7.20496 17.0859 7.05846 16.8333M13.5001 6C13.5001 4.67392 12.9733 3.40215 12.0357 2.46447C11.098 1.52678 9.8262 1 8.50012 1C7.17404 1 5.90227 1.52678 4.96459 2.46447C4.02691 3.40215 3.50012 4.67392 3.50012 6C3.50012 11.8333 1.00012 13.5 1.00012 13.5H16.0001C16.0001 13.5 13.5001 11.8333 13.5001 6Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {unreadCount > 0 ? (
                <span className="notifications-chip__badge" aria-label={`${unreadCount} непрочитаних сповіщень`}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              ) : null}
            </button>

            <section
              id="notifications-panel"
              className={isNotificationsOpen ? 'notifications-panel is-open' : 'notifications-panel'}
              aria-label="Панель сповіщень"
            >
              <header className="notifications-panel__head">
                <h3>Сповіщення</h3>
                <div className="notifications-panel__actions">
                  <button
                    type="button"
                    className="notifications-panel__full-screen"
                    onClick={() => handleOpenMailbox()}
                  >
                    На весь екран
                  </button>
                  <button
                    type="button"
                    className="notifications-panel__mark-read"
                    onClick={handleMarkAllAsRead}
                    disabled={unreadCount === 0}
                  >
                    Позначити всі як прочитані
                  </button>
                </div>
              </header>

              <div className="notifications-panel__body">
                {notifications.length === 0 ? (
                  <p className="notifications-panel__empty">Поки що немає сповіщень</p>
                ) : (
                  <ul className="notifications-list">
                    {notifications.map((notification) => (
                      <li key={notification.id}>
                        <button
                          type="button"
                          className={`notifications-item ${getTypeClassName(notification.type)}${notification.isRead ? ' is-read' : ' is-unread'}`}
                          onClick={() => handleOpenMailbox(notification.id)}
                        >
                          <span className="notifications-item__marker" aria-hidden="true" />
                          <div className="notifications-item__content">
                            <p className="notifications-item__title">{notification.title}</p>
                            <p className="notifications-item__text">{notification.text}</p>
                            <span className="notifications-item__time">{notification.time}</span>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          </div>

          <button
            type="button"
            className={isDarkTheme ? 'theme-chip theme-chip--active' : 'theme-chip'}
            onClick={handleThemeToggle}
            aria-label={isDarkTheme ? 'Увімкнути світлу тему' : 'Увімкнути темну тему'}
            title={isDarkTheme ? 'Світла тема' : 'Темна тема'}
          >
            {isDarkTheme ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {isAuthenticated ? (
            <Link to="/profile" className={isActive('/profile') ? 'profile-chip profile-chip--active' : 'profile-chip'}>
              <User size={16} />
              <span>{user?.name || 'Профіль'}</span>
            </Link>
          ) : (
            <>
              <Link to="/register" className={isActive('/register') ? 'signup-chip signup-chip--active' : 'signup-chip'}>
                Зареєструватися
              </Link>
              <Link to="/login" className={isActive('/login') ? 'login-chip login-chip--active' : 'login-chip'}>
                <LogIn size={16} />
                <span>Увійти</span>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
