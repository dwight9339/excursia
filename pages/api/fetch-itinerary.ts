import { NextApiRequest, NextApiResponse } from 'next';
import { fetchItinerary } from '../../lib/dbFetch';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const itinerary = await fetchItinerary(req.query.id as string);

      res.status(200).json(itinerary);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Unable to fetch itinerary" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}