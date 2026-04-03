import { createBrowserRouter, createMemoryRouter } from 'react-router';
import { Outlet } from 'react-router';
import HomePage from './pages/HomePage/HomePage';
import AnimalDetailsPage from './pages/PetPage/AnimalDetailsPage';
import AdoptionFormPage from './features/adopt-animal/ui/AdoptionFormPage';
import DonatePage from './features/donate/ui/DonatePage';
import AdminPage from './pages/ProfilePage/ui/AdminPage';
import ProfilePage from './pages/ProfilePage/ui/ProfilePage';
import { Navbar } from './widgets/header/ui/Navbar';
import { Footer } from './widgets/footer/ui/Footer';
import { AuthProvider } from './features/auth/AuthContext';

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
