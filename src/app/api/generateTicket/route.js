import { doc, setDoc, collection, getDocs, query, where, limit } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { db } from '../../firebase';
import qrcode from 'qrcode';

export async function POST(req, res) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      new Response(JSON.stringify({ message: 'Unauthorized - No Bearer token provided' }), { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      new Response(JSON.stringify({ message: 'Unauthorized - Bearer token is empty' }), { status: 401 });
    }

    const options = {
      method: "GET",
      url: "https://qr-ticket-app-main.vercel.app/",
      headers: { "authorization": authHeader },
    };

    axios(options)
      .then()
      .catch(error => {
        return new Response(error, { status: 500 });
      });

    const { vatin, firstName, lastName, userSub } = await req.json();

    if (!vatin || !firstName || !lastName) {
      return new Response(JSON.stringify({ message: 'Please give all info needed' }), { status: 400 });
    }

    const ticketsRef = collection(db, 'tickets');
    const q = query(ticketsRef, where('vatin', '==', vatin), limit(3));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.size >= 3) {
      return new Response(JSON.stringify({ message: 'Limit of 3 tickets reached for this user.' }), { status: 400 });
    }

    const ticketId = uuidv4();
    const newTicket = {
      vatin,
      firstName,
      lastName,
      createdAt: new Date().toISOString(),
      userSub,
    };

    await setDoc(doc(db, 'tickets', ticketId), newTicket);
    const ticketURL = `https://qr-ticket-app-main.vercel.app/${ticketId}`;
    const qrCodeBuffer = await qrcode.toBuffer(ticketURL, {
      type: 'image/png',
      quality: 0.3,
      margin: 1,
      width: 200,
      scale: 4
    });
    return new Response(qrCodeBuffer, {
      headers: { 'Content-Type': 'image/png' },
      status: 200
    });
  } catch (error) {
    console.error('Error creating ticket:', error);
    return new Response(JSON.stringify({ message: 'Error creating ticket' }), { status: 500 });
  }
}