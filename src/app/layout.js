"use client";

import '../styles/globals.css';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import Link from 'next/link';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <div className="min-h-screen flex flex-col">
            <header className="bg-blue-600 text-white p-4">
              <div className="container mx-auto">
                <h1 className="text-3xl font-bold">
                  <Link href="/">Personal Finance Tracker</Link>
                </h1>
              </div>
            </header>
            <nav className="bg-blue-500 text-white p-4">
              <div className="container mx-auto flex space-x-4 font-bold">
                <Link href="/" className="hover:underline">Dashboard</Link>
                <Link href="/transactions" className="hover:underline">Transactions</Link>
                <Link href="/budget" className="hover:underline">Budget Goals</Link>
              </div>
            </nav>
            <main className="flex-grow container mx-auto p-4">
              {children}
            </main>
            <footer className="bg-blue-600 text-white p-4">
              <div className="container mx-auto text-center">
                <p>&copy; 2024 Personal Finance Tracker. All rights reserved.</p>
              </div>
            </footer>
          </div>
        </Provider>
      </body>
    </html>
  );
}
