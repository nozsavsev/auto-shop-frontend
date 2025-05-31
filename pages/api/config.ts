import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Return the API URL from environment variables
  return res.status(200).json({
    apiUrl: process.env.NEXT_PUBLIC_API_URL || '',
  });
} 