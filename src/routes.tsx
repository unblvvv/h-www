"use client";

import { createBrowserRouter, createMemoryRouter } from 'react-router';
import { Outlet, useLocation } from 'react-router';
import HomePage from './pages/HomePage/HomePage';
import FindPetPage from './pages/FindPetPage/FindPetPage';
import AnimalDetailsPage from './pages/AnimalDetails/AnimalDetailsPage';
import AdoptionFormPage from './pages/AdopFormPage/AdoptionFormPage';
import DonatePage from './pages/DonatePage/DonatePage';
import AdminPage from './pages/AdminPage/AdminPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import { Navbar } from './widgets/header/ui/Navbar';
import { Footer } from './widgets/footer/ui/Footer';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import { AuthProvider } from './features/auth/AuthContext';

function Layout() {
  const location = useLocation();
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';

  return (
    <AuthProvider>
      <div className="app-layout">
        {!isAuthRoute ? <Navbar /> : null}
        <main className="app-layout__main">
          <Outlet />
        </main>
        {!isAuthRoute ? <Footer /> : null}
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
      { path: 'profile', Component: ProfilePage },
      { path: 'login', Component: LoginPage },
      { path: 'register', Component: RegisterPage },
    ],
  },
];

export const router =
  typeof window === 'undefined'
    ? createMemoryRouter(routes)
    : createBrowserRouter(routes);
