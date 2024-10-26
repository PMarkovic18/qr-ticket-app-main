"use client"; 
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import Link from 'next/link'

export default function HomePage() {
  const [totalTickets, setTotalTickets] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTotalTickets() {
      try {
        const ticketsCol = collection(db, 'tickets');
        const ticketsSnapshot = await getDocs(ticketsCol);
        setTotalTickets(ticketsSnapshot.size);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTotalTickets();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-200 to-indigo-600 text-white">
      <div className="text-center space-y-8">
        <h1 className="text-5xl font-extrabold drop-shadow-lg">
          Welcome to <span className="text-white">QR Ticket App</span>
        </h1>
        <p className="text-2xl">
          Generate and manage your tickets effortlessly!
        </p>

        {loading ? (
          <p className="text-lg">Loading total tickets...</p>
        ) : (
          <p className="text-3xl font-semibold">
            Total Tickets Generated: {totalTickets}
          </p>
        )}

        <div>
          <Link
            href="/tickets"
            className="mt-12 px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg shadow-md hover:bg-yellow-500 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
