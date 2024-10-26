"use client"; 
import { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import withAuth from '../../components/withAuth';
import { useQRCode } from 'next-qrcode';
import { useRouter } from 'next/navigation'; 

const GenerateTicket = () => {
  const { user, error: authError, isLoading } = useUser();
  const [vatin, setVatin] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [ticketId, setTicketId] = useState(null);
  const [error, setError] = useState(null);
  const { Canvas } = useQRCode();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/generateTicket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vatin, firstName, lastName, userSub: user.sub }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData.message);
        throw new Error(errorData.message || 'Failed to create ticket.');
      }

      const data = await response.json();
      setTicketId(data.ticketId);
      setError(null); 
    } catch (err) {
      setError(err.message);
      setTicketId(null);
    }
  };

  const ticketUrl = ticketId ? `${window.location.origin}/tickets/${ticketId}` : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-200 to-indigo-600">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Generate Ticket</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-600">VATIN</label>
            <input
              type="text"
              value={vatin}
              onChange={(e) => setVatin(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your VATIN"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-600">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your First Name"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-600">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your Last Name"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition duration-300"
          >
            Create Ticket
          </button>
        </form>

        {ticketId && (
          <div className="mt-6 p-4 bg-green-100 text-green-700 rounded-lg text-center">
            <p className="font-medium">Ticket created successfully with ID: {ticketId}</p>

            <div className="mt-4 flex justify-center">
              <Canvas text={ticketUrl} options={{
                  errorCorrectionLevel: 'M',
                  margin: 3,
                  scale: 4,
                  width: 200
                }} />
              <p className="mt-2 text-sm text-gray-600">Scan the QR code to view your ticket details.</p>
            </div>
            <button
          onClick={() => router.push('/tickets')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          Back to Tickets
        </button>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-lg text-center">
            <p className="font-medium">Error: {error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default withAuth(GenerateTicket);
