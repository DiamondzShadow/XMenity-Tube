import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAccount } from 'wagmi';
import WalletConnect from '@/components/WalletConnect';
import { insightiq, formatFollowerCount } from '@/lib/insightiq';

interface UserProfile {
  id: string;
  walletAddress: string;
  socialAccounts: Array<{
    platform: string;
    platformUsername: string;
    followersCount: number;
    verified: boolean;
  }>;
  tokens: Array<{
    contractAddress: string;
    name: string;
    symbol: string;
    totalSupply: string;
  }>;
}

interface SocialProfile {
  accountId: string;
  username: string;
  displayName: string;
  followersCount: number;
  verified: boolean;
  profileImageUrl?: string;
}

export default function Dashboard() {
  const { address } = useAccount();
  const [isWalletVerified, setIsWalletVerified] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [socialProfile, setSocialProfile] = useState<SocialProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'social' | 'tokens' | 'rewards'>('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user profile when wallet is verified
  useEffect(() => {
    if (isWalletVerified && address) {
      loadUserProfile();
    }
  }, [isWalletVerified, address]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/user/profile?address=${address}`);
      const data = await response.json();
      
      if (data.success) {
        setUserProfile(data.user);
      } else {
        setError('Failed to load user profile');
      }
    } catch (err) {
      setError('Error loading profile');
      console.error('Profile loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleWalletVerified = (walletAddress: string) => {
    setIsWalletVerified(true);
    setError(null);
  };

  const handleConnectTwitter = async () => {
    try {
      setLoading(true);
      // Initiate Twitter OAuth flow
      const response = await fetch('/api/social/connect/twitter', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Redirect to InsightIQ OAuth
        window.location.href = data.authUrl;
      } else {
        setError('Failed to initiate Twitter connection');
      }
    } catch (err) {
      setError('Error connecting Twitter account');
      console.error('Twitter connect error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateToken = () => {
    // Navigate to token creation flow
    window.location.href = '/create-token';
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome to XMenity Social Token Factory</h2>
        <p className="text-blue-100">
          Create and manage your community tokens backed by real social influence
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Tokens</p>
              <p className="text-2xl font-semibold text-gray-900">
                {userProfile?.tokens?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Followers</p>
              <p className="text-2xl font-semibold text-gray-900">
                {socialProfile ? formatFollowerCount(socialProfile.followersCount) : '0'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Verified</p>
              <p className="text-2xl font-semibold text-gray-900">
                {socialProfile?.verified ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Getting Started */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Getting Started</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isWalletVerified ? 'bg-green-500' : 'bg-gray-300'}`}>
                {isWalletVerified ? (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-white font-semibold">1</span>
                )}
              </div>
              <div className="ml-4">
                <h4 className="font-medium text-gray-900">Connect & Verify Wallet</h4>
                <p className="text-sm text-gray-600">Sign in with your Ethereum wallet</p>
              </div>
            </div>
            {isWalletVerified && (
              <span className="text-green-600 font-medium">✓ Complete</span>
            )}
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${socialProfile ? 'bg-green-500' : 'bg-gray-300'}`}>
                {socialProfile ? (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-white font-semibold">2</span>
                )}
              </div>
              <div className="ml-4">
                <h4 className="font-medium text-gray-900">Connect Social Media</h4>
                <p className="text-sm text-gray-600">Link your Twitter account via InsightIQ</p>
              </div>
            </div>
            {socialProfile ? (
              <span className="text-green-600 font-medium">✓ Complete</span>
            ) : (
              <button
                onClick={handleConnectTwitter}
                disabled={!isWalletVerified || loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                {loading ? 'Connecting...' : 'Connect Twitter'}
              </button>
            )}
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${userProfile?.tokens?.length ? 'bg-green-500' : 'bg-gray-300'}`}>
                {userProfile?.tokens?.length ? (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-white font-semibold">3</span>
                )}
              </div>
              <div className="ml-4">
                <h4 className="font-medium text-gray-900">Create Your Token</h4>
                <p className="text-sm text-gray-600">Launch your community token with custom rules</p>
              </div>
            </div>
            {userProfile?.tokens?.length ? (
              <span className="text-green-600 font-medium">✓ Complete</span>
            ) : (
              <button
                onClick={handleCreateToken}
                disabled={!socialProfile || loading}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Create Token
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSocialTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media Accounts</h3>
        {socialProfile ? (
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            {socialProfile.profileImageUrl && (
              <img 
                src={socialProfile.profileImageUrl} 
                alt={socialProfile.displayName}
                className="w-12 h-12 rounded-full"
              />
            )}
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{socialProfile.displayName}</h4>
              <p className="text-sm text-gray-600">@{socialProfile.username}</p>
              <p className="text-sm text-gray-600">{formatFollowerCount(socialProfile.followersCount)} followers</p>
            </div>
            {socialProfile.verified && (
              <div className="text-blue-500">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                </svg>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <svg className="mx-auto w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No social accounts connected</h3>
            <p className="mt-1 text-sm text-gray-500">Connect your Twitter account to get started</p>
            <button
              onClick={handleConnectTwitter}
              disabled={loading}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              {loading ? 'Connecting...' : 'Connect Twitter'}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  if (!isWalletVerified) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Head>
          <title>XMenity Social Token Factory - Dashboard</title>
          <meta name="description" content="Create and manage your social tokens" />
        </Head>

        <div className="max-w-md mx-auto pt-20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">XMenity Dashboard</h1>
            <p className="text-gray-600 mt-2">Connect your wallet to access your creator dashboard</p>
          </div>
          
          <WalletConnect 
            onWalletVerified={handleWalletVerified}
            onError={setError}
          />
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>XMenity Social Token Factory - Dashboard</title>
        <meta name="description" content="Create and manage your social tokens" />
      </Head>

      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">XMenity Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: '📊' },
              { id: 'social', name: 'Social Media', icon: '🐦' },
              { id: 'tokens', name: 'My Tokens', icon: '🪙' },
              { id: 'rewards', name: 'Rewards', icon: '🎁' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'social' && renderSocialTab()}
        {activeTab === 'tokens' && <div>Tokens tab - Coming soon</div>}
        {activeTab === 'rewards' && <div>Rewards tab - Coming soon</div>}
      </main>
    </div>
  );
}