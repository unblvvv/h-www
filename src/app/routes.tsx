import { createBrowserRouter } from 'react-router';
import { Outlet } from 'react-router';
import HomePage from './pages/HomePage';
import AnimalDetailsPage from './pages/AnimalDetailsPage';
import AdoptionFormPage from './pages/AdoptionFormPage';
import DonatePage from './pages/DonatePage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthProvider } from './contexts/AuthContext';

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

export const router = createBrowserRouter([
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
]);
