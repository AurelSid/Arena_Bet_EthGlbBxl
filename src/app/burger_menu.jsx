'use client';

import { useState } from 'react';
import ProfileClient from './userData/userProfile';
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';

export default function Burger() {
  const { user, error, isLoading } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <div className="relative">
      <div className="flex justify-end p-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="focus:outline-none"
        >
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </div>
      <div className={`absolute top-0 right-0 mt-12 ${isOpen ? 'block' : 'hidden'} bg-black text-white rounded-lg shadow-lg`}>
        <div className="p-4">
          {!user && (
            <a href="/api/auth/login" className='block bg-gradient-to-r from-sky-400 to-pink-600 px-10 py-2 rounded-full text-center'>
              Login
            </a>
          )}
          {user && (
            <a href="/api/auth/logout" className='block text-center text-xl py-2'>
              Logout
            </a>
          )}
        </div>
        <div className="p-4">
          <Link href="/bets">
            <a className="block px-4 py-2 hover:bg-gray-700 rounded">Bets</a>
          </Link>
          <Link href="/dashboard">
            <a className="block px-4 py-2 hover:bg-gray-700 rounded">Dashboard</a>
          </Link>
          <Link href="/profile">
            <a className="block px-4 py-2 hover:bg-gray-700 rounded">Profile</a>
          </Link>
          <Link href="/settings">
            <a className="block px-4 py-2 hover:bg-gray-700 rounded">Settings</a>
          </Link>
        </div>
        {user && (
          <div className="p-4 text-center">
            <img src={user.picture} alt={user.name} className="w-12 h-12 rounded-full mx-auto" />
            <h2 className="mt-2 text-lg">{user.name}</h2>
            <p className="text-sm">{user.email}</p>
          </div>
        )}
      </div>
    </div>
  );
}
