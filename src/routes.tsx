"use client";

import { createBrowserRouter, createMemoryRouter } from 'react-router';
import { Outlet } from 'react-router';
import HomePage from './pages/HomePage/HomePage';
import FindPetPage from './pages/FindPetPage/FindPetPage';
import AnimalDetailsPage from './pages/AnimalDetails/AnimalDetailsPage';
import AdoptionFormPage from './pages/AdopFormPage/AdoptionFormPage';
import DonatePage from './pages/DonatePage/DonatePage';
import AdminPage from './pages/AdminPage/AdminPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthProvider } from './features/auth/AuthContext';

function Layout() {
  return (
    <AuthProvider>
      <div className="app-layout">
        <Navbar />
        <main className="app-layout__main">
          <Outlet />
        </main>
        <Footer />
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
    ],
  },
];

export const router =
  typeof window === 'undefined'
    ? createMemoryRouter(routes)
    : createBrowserRouter(routes);
