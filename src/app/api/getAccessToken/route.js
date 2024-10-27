import axios from 'axios';

export async function GET() {
    try {
        const response = await axios.post(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
            client_id: process.env.AUTH0_M2M_CLIENT_ID,
            client_secret: process.env.AUTH0_M2M_CLIENT_SECRET,
            audience: process.env.AUTH0_M2M_AUDIENCE,
            grant_type: 'client_credentials',
            scope: 'create:tickets',
        });
        return new Response(JSON.stringify({ token: response.data.access_token }), { status: 200 });
    } catch (error) {
        if (error.response) {
            return new Response(JSON.stringify({ message: 'Error response from Auth0' }), { status: 400 });
        }
    }
};