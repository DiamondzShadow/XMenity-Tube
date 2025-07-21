import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface InsightIQProfile {
  accountId: string;
  username: string;
  displayName: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  engagementScore?: number;
  verified: boolean;
  profileImageUrl?: string;
  bio?: string;
  location?: string;
  website?: string;
  joinDate?: string;
}

export interface InsightIQConnectResponse {
  success: boolean;
  accountId: string;
  accessToken: string;
  profile: InsightIQProfile;
}

export interface InsightIQEngagementData {
  accountId: string;
  period: string; // "7d", "30d", "90d"
  metrics: {
    likes: number;
    retweets: number;
    replies: number;
    mentions: number;
    impressions?: number;
    engagementRate: number;
  };
  topPosts: Array<{
    id: string;
    text: string;
    likes: number;
    retweets: number;
    replies: number;
    createdAt: string;
  }>;
  followers: {
    newFollowers: number;
    unfollowers: number;
    netGrowth: number;
    growthRate: number;
  };
}

export interface InsightIQFollowerData {
  accountId: string;
  topFollowers: Array<{
    username: string;
    displayName: string;
    followersCount: number;
    engagementScore: number;
    isInfluencer: boolean;
  }>;
  engagedFollowers: Array<{
    username: string;
    engagementCount: number;
    lastEngagement: string;
  }>;
}

class InsightIQClient {
  private client: AxiosInstance;
  private baseURL: string;
  private apiKey?: string;
  private clientId: string;
  private clientSecret: string;

  constructor() {
    this.baseURL = process.env.INSIGHTIQ_BASE_URL || 'https://api.staging.insightiq.ai/v1';
    this.apiKey = process.env.INSIGHTIQ_API_KEY; // Optional for OAuth flow
    this.clientId = process.env.INSIGHTIQ_CLIENT_ID!;
    this.clientSecret = process.env.INSIGHTIQ_CLIENT_SECRET!;

    // Configure axios with OAuth credentials
    const authHeader = this.apiKey 
      ? `Bearer ${this.apiKey}`
      : `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`;

    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    // Request interceptor for logging
    this.client.interceptors.request.use((config) => {
      console.log(`InsightIQ API Request: ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('InsightIQ API Error:', error.response?.data || error.message);
        throw new Error(`InsightIQ API Error: ${error.response?.status} ${error.response?.statusText}`);
      }
    );
  }

  // Initialize OAuth flow for Twitter connection
  async initiateTwitterConnect(redirectUri: string): Promise<{ authUrl: string; state: string }> {
    try {
      const response = await this.client.post('/connect/twitter/initiate', {
        redirectUri,
        scope: ['profile', 'followers', 'engagement'],
      });

      return {
        authUrl: response.data.authUrl,
        state: response.data.state,
      };
    } catch (error) {
      console.error('Error initiating Twitter connect:', error);
      throw error;
    }
  }

  // Complete OAuth flow and get profile data
  async completeTwitterConnect(
    code: string,
    state: string,
    redirectUri: string
  ): Promise<InsightIQConnectResponse> {
    try {
      const response = await this.client.post('/connect/twitter/complete', {
        code,
        state,
        redirectUri,
      });

      return response.data;
    } catch (error) {
      console.error('Error completing Twitter connect:', error);
      throw error;
    }
  }

  // Get profile data for a connected account
  async getProfile(accountId: string): Promise<InsightIQProfile> {
    try {
      const response = await this.client.get(`/profiles/${accountId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  // Get multiple profiles by account IDs
  async getProfiles(accountIds: string[]): Promise<InsightIQProfile[]> {
    try {
      const response = await this.client.post('/profiles/batch', {
        accountIds,
      });
      return response.data.profiles;
    } catch (error) {
      console.error('Error fetching profiles:', error);
      throw error;
    }
  }

  // Get engagement data for an account
  async getEngagementData(
    accountId: string,
    period: string = '30d'
  ): Promise<InsightIQEngagementData> {
    try {
      const response = await this.client.get(`/analytics/${accountId}/engagement`, {
        params: { period },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching engagement data:', error);
      throw error;
    }
  }

  // Get follower analytics
  async getFollowerData(accountId: string): Promise<InsightIQFollowerData> {
    try {
      const response = await this.client.get(`/analytics/${accountId}/followers`);
      return response.data;
    } catch (error) {
      console.error('Error fetching follower data:', error);
      throw error;
    }
  }

  // Check if account meets specific milestones
  async checkMilestones(
    accountId: string,
    milestones: {
      minFollowers?: number;
      minEngagementRate?: number;
      minPostsCount?: number;
      verifiedRequired?: boolean;
    }
  ): Promise<{ meets: boolean; details: Record<string, boolean> }> {
    try {
      const profile = await this.getProfile(accountId);
      const engagement = await this.getEngagementData(accountId);

      const checks = {
        followers: !milestones.minFollowers || profile.followersCount >= milestones.minFollowers,
        engagement: !milestones.minEngagementRate || engagement.metrics.engagementRate >= milestones.minEngagementRate,
        posts: !milestones.minPostsCount || profile.postsCount >= milestones.minPostsCount,
        verified: !milestones.verifiedRequired || profile.verified,
      };

      return {
        meets: Object.values(checks).every(Boolean),
        details: checks,
      };
    } catch (error) {
      console.error('Error checking milestones:', error);
      throw error;
    }
  }

  // Search for accounts by username
  async searchAccounts(query: string, limit: number = 10): Promise<InsightIQProfile[]> {
    try {
      const response = await this.client.get('/search/accounts', {
        params: { q: query, limit },
      });
      return response.data.accounts;
    } catch (error) {
      console.error('Error searching accounts:', error);
      throw error;
    }
  }

  // Get account growth history
  async getGrowthHistory(
    accountId: string,
    period: string = '90d'
  ): Promise<Array<{ date: string; followers: number; following: number; posts: number }>> {
    try {
      const response = await this.client.get(`/analytics/${accountId}/growth`, {
        params: { period },
      });
      return response.data.history;
    } catch (error) {
      console.error('Error fetching growth history:', error);
      throw error;
    }
  }

  // Webhook verification for real-time updates
  async verifyWebhook(signature: string, payload: string): Promise<boolean> {
    try {
      const response = await this.client.post('/webhooks/verify', {
        signature,
        payload,
      });
      return response.data.valid;
    } catch (error) {
      console.error('Error verifying webhook:', error);
      return false;
    }
  }

  // Get supported platforms
  async getSupportedPlatforms(): Promise<string[]> {
    try {
      const response = await this.client.get('/platforms');
      return response.data.platforms;
    } catch (error) {
      console.error('Error fetching platforms:', error);
      throw error;
    }
  }
}

// Singleton instance
export const insightiq = new InsightIQClient();

// Utility functions
export const calculateEngagementScore = (
  likes: number,
  retweets: number,
  replies: number,
  followers: number
): number => {
  if (followers === 0) return 0;
  const totalEngagement = likes + retweets * 2 + replies * 3; // Weight different types
  return (totalEngagement / followers) * 100;
};

export const isInfluencer = (profile: InsightIQProfile): boolean => {
  return (
    profile.followersCount >= 10000 ||
    (profile.engagementScore && profile.engagementScore >= 2.0) ||
    profile.verified
  );
};

export const formatFollowerCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

export const getMilestoneProgress = (
  current: number,
  milestones: number[]
): { next: number | null; progress: number; achieved: number[] } => {
  const achieved = milestones.filter(m => current >= m);
  const remaining = milestones.filter(m => current < m).sort((a, b) => a - b);
  const next = remaining[0] || null;
  
  const progress = next ? (current / next) * 100 : 100;
  
  return { next, progress, achieved };
};

// Error classes
export class InsightIQError extends Error {
  constructor(message: string, public statusCode?: number, public code?: string) {
    super(message);
    this.name = 'InsightIQError';
  }
}

export class InsightIQAuthError extends InsightIQError {
  constructor(message: string) {
    super(message, 401, 'AUTH_ERROR');
    this.name = 'InsightIQAuthError';
  }
}

export class InsightIQRateLimitError extends InsightIQError {
  constructor(message: string) {
    super(message, 429, 'RATE_LIMIT');
    this.name = 'InsightIQRateLimitError';
  }
}

export default insightiq;