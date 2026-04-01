"use client";

import { Button } from "@/components/atoms/Buttons";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Home, Info, Package, Star, History, User, LogOut, Sparkles, PartyPopper } from "lucide-react";

interface HeaderProps {
  userName?: string;
  onLogout: () => void;
  isLoggedIn: boolean;
}

export const Header = ({ userName, onLogout, isLoggedIn }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    // { href: "/about", label: "About", icon: Info },
    // { href: "/dashboard/katalog", label: "Product", icon: Package },
    { href: "/dashboard/sewa/review", label: "Review", icon: Star },
    { href: "/riwayat", label: "History", icon: History },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-orange-100 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Navigation - Desktop */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                <PartyPopper className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent group-hover:from-orange-500 group-hover:to-pink-500 transition-all">
                EventRental
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-orange-600 font-medium transition-all duration-200 rounded-lg hover:bg-orange-50"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Actions - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {userName && isLoggedIn && (
              <div className="flex items-center gap-3 px-3 py-1.5 bg-gradient-to-r from-orange-50 to-pink-50 rounded-full border border-orange-100">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-sm">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-semibold text-gray-800">Halo, {userName}</p>
                </div>
              </div>
            )}

            <Link
              href="/dashboard/profile"
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-orange-600 transition-colors font-medium rounded-lg hover:bg-orange-50"
            >
              <User className="w-4 h-4" />
              <span>Profil</span>
            </Link>

            <Button
              size="sm"
              onClick={onLogout}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg
                ${isLoggedIn 
                  ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white" 
                  : "bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
                }
              `}
            >
              <LogOut className="w-4 h-4" />
              {isLoggedIn ? "Logout" : "Login"}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-orange-100 animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
              
              {/* Divider */}
              <div className="h-px bg-orange-100 my-2" />
              
              {/* User Info - Mobile */}
              {userName && isLoggedIn && (
                <div className="px-4 py-3 bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{userName}</p>
                      <p className="text-xs text-gray-500">Event Organizer</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Profile Link - Mobile */}
              <Link
                href="/dashboard/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Profil</span>
              </Link>
              
              {/* Logout Button - Mobile */}
              <button
                onClick={() => {
                  onLogout();
                  setIsMobileMenuOpen(false);
                }}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all mt-2
                  ${isLoggedIn 
                    ? "text-red-600 hover:bg-red-50" 
                    : "text-orange-600 hover:bg-orange-50"
                  }
                `}
              >
                <LogOut className="w-5 h-5" />
                <span>{isLoggedIn ? "Logout" : "Login"}</span>
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Decorative Gradient Bar */}
      <div className="h-0.5 bg-gradient-to-r from-orange-500 via-pink-500 to-orange-500" />
    </header>
  );
};