import { Link, useLocation } from 'react-router';
import { Heart, User, LogIn } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../../features/auth/AuthContext';
import { LoginModal } from '@/features/auth/ui/Login/LoginModal';

export function Navbar() {
  const location = useLocation();
  const { isAuthenticated, user, login } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      <nav className="bg-white border-b-2 border-[#E5E7EB] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <Heart className="w-8 h-8 text-[#22C55E]" />
              <span className="text-[#111827]">Shelter</span>
            </Link>

            <div className="flex items-center gap-6">
              <Link
                to="/"
                className={cn(
                  'transition-colors duration-200',
                  isActive('/') ? 'text-[#22C55E]' : 'text-[#111827] hover:text-[#22C55E]'
                )}
              >
                Home
              </Link>
              <Link
                to="/donate"
                className={cn(
                  'transition-colors duration-200',
                  isActive('/donate') ? 'text-[#22C55E]' : 'text-[#111827] hover:text-[#22C55E]'
                )}
              >
                Donate
              </Link>
              <Link
                to="/admin"
                className={cn(
                  'transition-colors duration-200',
                  isActive('/admin') ? 'text-[#22C55E]' : 'text-[#6B7280] hover:text-[#111827]'
                )}
              >
                Admin
              </Link>

              {isAuthenticated ? (
                <Link
                  to="/profile"
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl transition-colors duration-200',
                    isActive('/profile')
                      ? 'bg-[#22C55E] text-white'
                      : 'bg-[#F9FAFB] text-[#111827] hover:bg-[#22C55E]/10'
                  )}
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user?.name}</span>
                </Link>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F9FAFB] text-[#111827] hover:bg-[#22C55E]/10 transition-colors duration-200"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Log in</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={login}
      />
    </>
  );
}

function cn(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}
