"use client";

import { createBrowserRouter, createMemoryRouter } from 'react-router';
import { Outlet, useLocation } from 'react-router';
import { useEffect } from 'react';
import HomePage from './pages/HomePage/HomePage';
import FindPetPage from './pages/FindPetPage/FindPetPage';
import AnimalDetailsPage from './pages/AnimalDetails/AnimalDetailsPage';
import AdoptionFormPage from './pages/AdopFormPage/AdoptionFormPage';
import DonatePage from './pages/DonatePage/DonatePage';
import AdminPage from './pages/AdminPage/AdminPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import MailBox from './pages/MailBox/MailBox';
import { Navbar } from './widgets/header/ui/Navbar';
import { Footer } from './widgets/footer/ui/Footer';
import { AuthProvider } from './features/auth';
import { LoginPage } from './features/auth/ui/Login/LoginModal';
import { RegisterPage } from './features/auth/ui/Register/RegisterModal';
import { PrivateRoute } from '@/shared/lib/PrivateRoute';

function Layout() {
  const location = useLocation();
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';
  const isMailboxRoute = location.pathname.startsWith('/mailbox');

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  return (
    <AuthProvider>
      <div className="app-layout">
        {!isAuthRoute ? <Navbar /> : null}
        <main className="app-layout__main">
          <Outlet />
        </main>
        {!isAuthRoute && !isMailboxRoute ? <Footer /> : null}
      </div>
    </AuthProvider>
  );
}

const routes = [
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: 'find-pet', Component: FindPetPage },
      { path: 'animal/:id', Component: AnimalDetailsPage },
      { path: 'adopt/:id', Component: AdoptionFormPage },
      { path: 'donate', Component: DonatePage },
      { path: 'admin', Component: AdminPage },
      { path: 'mailbox', Component: MailBox },
      {
        element: <PrivateRoute />,
        children: [{ path: 'profile', Component: ProfilePage }],
      },
      { path: 'login', Component: LoginPage },
      { path: 'register', Component: RegisterPage },
    ],
  },
];

export const router =
  typeof window === 'undefined'
    ? createMemoryRouter(routes)
    : createBrowserRouter(routes);
