import { NextApiRequest, NextApiResponse } from 'next';
import { SiweMessage } from 'siwe';
import { nonces } from './nonce';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, signature, address } = req.body;

    if (!message || !signature || !address) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: message, signature, and address' 
      });
    }

    // Parse the SIWE message
    const siweMessage = new SiweMessage(message);
    
    // Get session ID from headers or body
    const sessionId = req.headers['x-session-id'] as string || req.body.sessionId;
    
    // Verify the nonce exists and is valid
    const nonceData = nonces.get(sessionId);
    if (!nonceData) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid or expired nonce' 
      });
    }

    // Check if nonce matches
    if (siweMessage.nonce !== nonceData.nonce) {
      return res.status(400).json({ 
        success: false, 
        error: 'Nonce mismatch' 
      });
    }

    // Check if nonce is not expired (10 minutes)
    if (Date.now() - nonceData.timestamp > 10 * 60 * 1000) {
      nonces.delete(sessionId);
      return res.status(400).json({ 
        success: false, 
        error: 'Nonce expired' 
      });
    }

    // Verify the signature
    const result = await siweMessage.verify({ 
      signature,
      domain: req.headers.host,
      nonce: nonceData.nonce
    });

    if (!result.success) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid signature' 
      });
    }

    // Clean up the used nonce
    nonces.delete(sessionId);

    // Store or update user in database
    let user = await prisma.user.findUnique({
      where: { walletAddress: address.toLowerCase() }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          walletAddress: address.toLowerCase(),
        }
      });
    }

    // Generate JWT token for session
    const token = jwt.sign(
      { 
        userId: user.id, 
        walletAddress: address.toLowerCase(),
        verified: true
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Update user session
    await prisma.user.update({
      where: { id: user.id },
      data: {
        sessionToken: token,
        sessionExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      }
    });

    // Store SIWE verification in WalletXBinding for audit trail
    await prisma.walletXBinding.upsert({
      where: {
        platformUserId_walletAddress: {
          platformUserId: address.toLowerCase(),
          walletAddress: address.toLowerCase(),
        }
      },
      create: {
        platformUserId: address.toLowerCase(),
        platformUsername: address.toLowerCase(),
        walletAddress: address.toLowerCase(),
        siweSignature: signature,
        siweMessage: message,
        siweNonce: nonceData.nonce,
      },
      update: {
        siweSignature: signature,
        siweMessage: message,
        siweNonce: nonceData.nonce,
      }
    });

    // Set JWT as httpOnly cookie
    res.setHeader('Set-Cookie', [
      `auth-token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${7 * 24 * 60 * 60}`,
    ]);

    res.status(200).json({ 
      success: true, 
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        verified: true
      },
      token // Also return token for client-side storage if needed
    });

  } catch (error) {
    console.error('SIWE verification error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error during verification' 
    });
  }
}