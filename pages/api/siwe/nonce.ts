import { NextApiRequest, NextApiResponse } from 'next';
import { randomBytes } from 'crypto';

// Store nonces temporarily (in production, use Redis or similar)
const nonces = new Map<string, { nonce: string; timestamp: number }>();

// Clean up old nonces (older than 10 minutes)
const cleanupNonces = () => {
  const now = Date.now();
  for (const [key, value] of nonces) {
    if (now - value.timestamp > 10 * 60 * 1000) { // 10 minutes
      nonces.delete(key);
    }
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Clean up old nonces
    cleanupNonces();

    // Generate a new nonce
    const nonce = randomBytes(16).toString('hex');
    const sessionId = req.headers['x-session-id'] as string || randomBytes(8).toString('hex');
    
    // Store the nonce with timestamp
    nonces.set(sessionId, {
      nonce,
      timestamp: Date.now(),
    });

    // Set session ID in response headers for client to track
    res.setHeader('X-Session-Id', sessionId);

    res.status(200).json({ 
      nonce,
      sessionId,
      expiresIn: 600 // 10 minutes
    });
  } catch (error) {
    console.error('Error generating nonce:', error);
    res.status(500).json({ error: 'Failed to generate nonce' });
  }
}

// Export the nonces map for use in verify endpoint
export { nonces };