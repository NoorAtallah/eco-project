"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Home, LogIn, UserPlus, LogOut, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/cartcontext';  // Make sure this import path is correct

const Header = () => {
  const router = useRouter();
  const { cartItemsCount } = useCart();


  const handleLogout = async () => {
    const response = await fetch('/api/auth/logout', { method: 'POST' });
    if (response.ok) {
      router.push('/login');
    }
  };

  return (
    <header className="bg-[#F7EED3] shadow-sm">
      <div className="container mx-auto px-4">
        <nav className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center space-x-2 text-[#674636]">
            <Home className="w-8 h-8" />
            <span className="text-xl font-bold">GreenGoals</span>
          </Link>
          
          <div className="hidden md:flex space-x-6">
            <Link href="/about" className="text-[#674636] hover:text-[#AAB396] transition-colors duration-300">
              About
            </Link>
            <Link href="/products" className="text-[#674636] hover:text-[#AAB396] transition-colors duration-300">
              Products
            </Link>
            <Link href="/challenges" className="text-[#674636] hover:text-[#AAB396] transition-colors duration-300">
              Challenges
            </Link>
            <Link href="/ContactUs" className="text-[#674636] hover:text-[#AAB396] transition-colors duration-300">
              Contact
            </Link>
            <Link href="/Community" className="text-[#674636] hover:text-[#AAB396] transition-colors duration-300">
              Community
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/cart" className="text-[#674636] hover:text-[#AAB396] transition-colors duration-300 flex items-center relative">
              <ShoppingCart className="mr-1" size={18} />
              Cart
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            <Link href="/login" className="text-[#674636] hover:text-[#AAB396] transition-colors duration-300 flex items-center">
              <LogIn className="mr-1" size={18} /> Login
            </Link>
            <Link href="/signup" className="text-[#674636] hover:text-[#AAB396] transition-colors duration-300 flex items-center">
              <UserPlus className="mr-1" size={18} /> Sign Up
            </Link>
            <button onClick={handleLogout} className="text-[#674636] hover:text-[#AAB396] transition-colors duration-300 flex items-center">
              <LogOut className="mr-1" size={18} /> Logout
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;