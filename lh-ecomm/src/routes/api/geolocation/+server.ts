import { json, type RequestHandler } from '@sveltejs/kit';
import { geolocation } from '@vercel/functions';
 
export const GET: RequestHandler = async ({ request: req }) => {
    const location = geolocation(req);
    
    return json({
        location
    });
}