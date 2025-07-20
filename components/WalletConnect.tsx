'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';
import { SiweMessage } from 'siwe';
import { switchToArbitrum } from '@/lib/thirdweb';

interface WalletConnectProps {
  onWalletVerified: (address: string) => void;
  onError?: (error: string) => void;
}

export default function WalletConnect({ onWalletVerified, onError }: WalletConnectProps) {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if we're on Arbitrum
  const isCorrectNetwork = chain?.id === 42161;

  useEffect(() => {
    // Clear verification status when wallet changes
    if (!isConnected) {
      setIsVerified(false);
      setError(null);
    }
  }, [isConnected, address]);

  const handleConnect = async () => {
    try {
      setError(null);
      const connector = connectors[0]; // Use first available connector (usually MetaMask)
      if (connector) {
        connect({ connector });
      }
    } catch (err) {
      const errorMsg = 'Failed to connect wallet';
      setError(errorMsg);
      onError?.(errorMsg);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setIsVerified(false);
    setError(null);
  };

  const switchNetwork = async () => {
    try {
      await switchToArbitrum();
    } catch (err) {
      const errorMsg = 'Failed to switch to Arbitrum network';
      setError(errorMsg);
      onError?.(errorMsg);
    }
  };

  const signInWithEthereum = async () => {
    if (!address) return;

    setIsVerifying(true);
    setError(null);

    try {
      // Get nonce from backend
      const nonceRes = await fetch('/api/siwe/nonce');
      const { nonce } = await nonceRes.json();

      // Create SIWE message
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in to XMenity Social Token Factory to verify your wallet and create your community token.',
        uri: window.location.origin,
        version: '1',
        chainId: chain?.id || 42161,
        nonce,
        issuedAt: new Date().toISOString(),
      });

      // Sign the message
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });

      // Verify signature with backend
      const verifyRes = await fetch('/api/siwe/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message.prepareMessage(),
          signature,
          address,
        }),
      });

      const verifyResult = await verifyRes.json();

      if (verifyResult.success) {
        setIsVerified(true);
        onWalletVerified(address);
      } else {
        throw new Error(verifyResult.error || 'Signature verification failed');
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to verify wallet signature';
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsVerifying(false);
    }
  };

  const getStatusColor = () => {
    if (error) return 'text-red-600';
    if (isVerified) return 'text-green-600';
    if (isConnected) return 'text-blue-600';
    return 'text-gray-600';
  };

  const getStatusText = () => {
    if (error) return error;
    if (isVerified) return `✅ Verified: ${address?.slice(0, 6)}...${address?.slice(-4)}`;
    if (isConnected && !isCorrectNetwork) return '⚠️ Please switch to Arbitrum network';
    if (isConnected) return `Connected: ${address?.slice(0, 6)}...${address?.slice(-4)}`;
    return 'Connect your wallet to continue';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Wallet Connection</h3>
        {isVerified && (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600 font-medium">Verified</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {/* Status Display */}
        <div className={`text-sm font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-3">
          {!isConnected ? (
            <button
              onClick={handleConnect}
              disabled={isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Connect Wallet</span>
                </>
              )}
            </button>
          ) : (
            <div className="space-y-3">
              {!isCorrectNetwork && (
                <button
                  onClick={switchNetwork}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  <span>Switch to Arbitrum</span>
                </button>
              )}

              {isCorrectNetwork && !isVerified && (
                <button
                  onClick={signInWithEthereum}
                  disabled={isVerifying}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  {isVerifying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Sign-In With Ethereum</span>
                    </>
                  )}
                </button>
              )}

              <button
                onClick={handleDisconnect}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>

        {/* Helper Text */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Connect your wallet to create and manage social tokens</p>
          <p>• You'll need to sign a message to verify ownership</p>
          <p>• Make sure you're on the Arbitrum network for low fees</p>
        </div>

        {/* Network Info */}
        {isConnected && (
          <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Network:</span>
              <span className={isCorrectNetwork ? 'text-green-600' : 'text-orange-600'}>
                {chain?.name || 'Unknown'}
              </span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Chain ID:</span>
              <span>{chain?.id || 'N/A'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}