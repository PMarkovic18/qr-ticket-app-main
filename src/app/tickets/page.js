"use client"; 
import { useState, useEffect } from 'react';
import { useUser, signIn } from '@auth0/nextjs-auth0/client';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useRouter } from 'next/navigation';
import withAuth from '../../components/withAuth';

const TicketsPage = () => {
  const router = useRouter();
  const { user, isLoading, error } = useUser();
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);

  useEffect(() => {
    async function fetchTickets() {
      if (user) {
        try {
          const ticketsRef = collection(db, 'tickets');
          const q = query(ticketsRef, where('userSub', '==', user.sub)); 
          const ticketsSnapshot = await getDocs(q);
          const userTickets = ticketsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setTickets(userTickets);
        } catch (error) {
          console.error('Error fetching user tickets:', error);
        } finally {
          setLoadingTickets(false);
        }
      }
    }

    if (!isLoading) {
      fetchTickets();
    }
  }, [user, isLoading]);

  // if (!user) {
  //   return (
  //     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
  //       <h1 className="text-3xl font-bold">You must be signed in to view this page</h1>
  //       <a
  //         href="/api/auth/login?returnTo=/tickets"
  //         className="mt-6 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg"
  //       >
  //         Sign In
  //       </a>
  //     </div>
  //   );
  // }

  const handleClick = () => {
    // window.location.href = '/generateTicket';
    router.push('/generateTicket');
  };


  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-400">
          Your Tickets
        </h1> 
        <button className="rounded-[10px] bg-white p-4 m-4 font-bold" onClick={handleClick}>Create new ticket</button>
        <ul className="space-y-6">
          {tickets.map((ticket) => (
            <li key={ticket.id} className="bg-white p-6 rounded-[30px] shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800">
                {ticket.id}
              </h2>
              <a href={`/tickets/${ticket.id}`} className="text-indigo-500 hover:text-indigo-700 font-medium">
              View Details
            </a>
              {/* <p className="text-gray-600">Created At: {ticket.createdAt?.toDate().toLocaleString()}</p> */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default withAuth(TicketsPage);