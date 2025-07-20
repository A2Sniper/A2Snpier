'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  BarChart3, 
  Target, 
  Settings, 
  Users, 
  DollarSign,
  Menu,
  X,
  LogOut,
  Home
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, setUser, setAuthenticated, isAuthenticated } = useAppStore();

  const navigationItems = [
    {
      name: 'Accueil',
      href: '/',
      icon: Home,
      requiresAuth: false
    },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3, requiresAuth: true },
    { name: 'Signaux', href: '/signals', icon: Target, requiresAuth: false },
    { name: 'Performance', href: '/performance', icon: TrendingUp, requiresAuth: false },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, requiresAuth: false },
    { name: 'Forex & Deriv', href: '/forex-deriv', icon: DollarSign, requiresAuth: false },
    { name: 'Backtesting', href: '/backtesting', icon: Target, requiresAuth: false },
    { name: 'Courtiers', href: '/brokers', icon: Users, requiresAuth: false },
    { name: 'Telegram', href: '/telegram', icon: Users, requiresAuth: false },
    { name: 'Tarifs', href: '/pricing', icon: DollarSign, requiresAuth: false },
    { name: 'Paramètres', href: '/settings', icon: Settings, requiresAuth: false },
  ];

  const filteredItems = navigationItems.filter(item => 
    !item.requiresAuth || (item.requiresAuth && isAuthenticated)
  );

  const handleLogout = () => {
    setUser(null);
    setAuthenticated(false);
    window.location.href = '/';
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow pt-5 bg-card border-r border-border overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">A2Sniper</h1>
                <p className="text-xs text-blue-400">AI Trading Platform</p>
              </div>
            </div>
          </div>
          
          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {filteredItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 flex-shrink-0 h-5 w-5 ${
                        isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Profile */}
          {user && (
            <div className="flex-shrink-0 flex border-t border-border p-4">
              <div className="flex items-center w-full">
                <div>
                  <img
                    className="inline-block h-9 w-9 rounded-full"
                    src={user.avatar || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150'}
                    alt=""
                  />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-3 p-1 text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden">
        <div className="flex items-center justify-between p-4 bg-card border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">A2Sniper</h1>
              <p className="text-xs text-blue-400">AI Trading Platform</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-card border-b border-border"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {filteredItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`group flex items-center px-3 py-2 text-base font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 flex-shrink-0 h-5 w-5 ${
                        isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </div>
            
            {user && (
              <div className="pt-4 pb-3 border-t border-border">
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={user.avatar || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150'}
                      alt=""
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-foreground">{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="ml-auto p-2 text-muted-foreground hover:text-foreground"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </>
  );
}