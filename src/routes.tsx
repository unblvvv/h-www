"use client";

import { createBrowserRouter, createMemoryRouter } from 'react-router';
import { Outlet } from 'react-router';
import HomePage from './widgets/animals-catalog/HomePage';
import AnimalDetailsPage from './widgets/animals-catalog/AnimalDetailsPage';
import AdoptionFormPage from './features/adopt-animal/AdoptionFormPage';
import DonatePage from './features/donate/DonatePage';
import AdminPage from './widgets/volunteer-dashboard/AdminPage';
import ProfilePage from './widgets/volunteer-dashboard/ProfilePage';
import { Navbar } from './widgets/header/Navbar';
import { Footer } from './widgets/footer/Footer';
import { AuthProvider } from './features/volunteer-auth/AuthContext';

function Layout() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
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
