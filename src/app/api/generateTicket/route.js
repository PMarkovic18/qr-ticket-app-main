import { doc, setDoc, collection, getDocs, query, where, limit } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { db } from '../../firebase'; 

const getAccessToken = async () => {
  try {
    const response = await axios.post(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
      client_id: process.env.AUTH0_M2M_CLIENT_ID,
      client_secret: process.env.AUTH0_M2M_CLIENT_SECRET,
      audience: process.env.AUTH0_M2M_AUDIENCE,
      grant_type: 'client_credentials',
      scope: 'create:tickets',
    });
    return response.data.access_token; 
  } catch (error) {
    if (error.response) {
      console.error('Error response from Auth0:', error.response.data);
    } else {
      console.error('Error fetching access token:', error.message);
    }
    throw new Error('Unable to fetch access token');
  }
};

export async function POST(req, res) {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401});
      
    }

    const { vatin, firstName, lastName, userSub } = await req.json();

    if (!vatin || !firstName || !lastName) {
        return new Response(JSON.stringify({ message: 'Missing required fields: vatin, firstName, lastName' }), { status: 400 });
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

    return new Response(JSON.stringify({ ticketId }), { status: 200 });
  } catch (error) {
    console.error('Error creating ticket:', error);
    return new Response(JSON.stringify({ message: 'Error creating ticket' }), { status: 500 });
  }
}
