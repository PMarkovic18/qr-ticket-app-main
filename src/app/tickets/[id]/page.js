"use client";
import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './../../firebase'; 
import { useParams, useRouter } from 'next/navigation'; 
import withAuth from '../../../components/withAuth';

const TicketDetailPage = () => {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const { id } = useParams(); 
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTicket = async () => {
      if (id) {
        try {
          const ticketRef = doc(db, 'tickets', id);
          const ticketSnapshot = await getDoc(ticketRef);

          if (ticketSnapshot.exists()) {
            setTicket({ id: ticketSnapshot.id, ...ticketSnapshot.data() });
          } else {
            setError('Ticket not found');
          }
        } catch (err) {
          console.error('Error fetching ticket details:', err);
          setError('Failed to fetch ticket details');
        } finally {
          setLoading(false);
        }}
    };

    fetchTicket();
  }, [user, id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="p-8 flex justify-center h-fit">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">Ticket Details</h1>
        <h2 className="text-2xl font-semibold">
            Ticket for:
          {ticket.firstName} {ticket.lastName}
        </h2>
        <p className="text-lg">VATIN (OIB): {ticket.vatin}</p>
        <p className="text-gray-600">
          Created At: {new Date(ticket.createdAt).toLocaleString()}
        </p>
        <p className="mt-4">Logged in as: {user.name} </p>
        <button
          onClick={() => router.push('/tickets')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          Back to Tickets
        </button>
      </div>
    </div>
  );
};

export default withAuth(TicketDetailPage);
