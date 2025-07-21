'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { 
  Rocket, 
  Shield, 
  TrendingUp, 
  Users, 
  Zap, 
  Twitter, 
  Wallet,
  Database,
  LineChart,
  Settings,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Copy,
  RefreshCw
} from "lucide-react"
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { WalletConnect } from '@/components/WalletConnect'

interface TokenData {
  name: string
  symbol: string
  description: string
  supply: number
  price: number
  holders: number
  volume24h: number
}

interface SocialStats {
  followers: number
  engagement: number
  milestone: string
  verified: boolean
}

export default function DashboardPage() {
  const { address, isConnected } = useAccount()
  const [isCreating, setIsCreating] = useState(false)
  const [socialConnected, setSocialConnected] = useState(false)
  const [tokenData, setTokenData] = useState<TokenData>({
    name: '',
    symbol: '',
    description: '',
    supply: 1000000,
    price: 0.001,
    holders: 0,
    volume24h: 0
  })
  const [socialStats, setSocialStats] = useState<SocialStats>({
    followers: 0,
    engagement: 0,
    milestone: 'None',
    verified: false
  })

  const handleCreateToken = async () => {
    setIsCreating(true)
    // Simulate token creation process
    await new Promise(resolve => setTimeout(resolve, 3000))
    setIsCreating(false)
    // Add success toast here
  }

  const handleSocialConnect = async () => {
    // Implement InsightIQ OAuth flow
    setSocialConnected(true)
    setSocialStats({
      followers: 12500,
      engagement: 4.2,
      milestone: '10K Followers',
      verified: true
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Rocket className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              XMenity Dashboard
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {isConnected && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Wallet className="h-3 w-3 mr-1" />
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </Badge>
            )}
            <WalletConnect 
              onWalletVerified={(addr) => console.log('Wallet verified:', addr)}
              onError={(error) => console.error('Wallet error:', error)}
            />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {!isConnected ? (
          // Wallet Connection Required
          <div className="max-w-2xl mx-auto text-center py-16">
            <Wallet className="h-16 w-16 mx-auto mb-6 text-purple-600" />
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Connect Your Wallet</h2>
            <p className="text-gray-600 mb-8">
              Connect your wallet to start creating and managing your social tokens
            </p>
            <WalletConnect 
              onWalletVerified={(addr) => console.log('Wallet verified:', addr)}
              onError={(error) => console.error('Wallet error:', error)}
            />
          </div>
        ) : (
          // Main Dashboard
          <div className="space-y-8">
            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$12,345</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Tokens</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">
                    2 verified tokens
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Holders</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">
                    +12% this week
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Social Score</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">92</div>
                  <p className="text-xs text-muted-foreground">
                    InsightIQ verified
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Main Tabs */}
            <Tabs defaultValue="create" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="create">Create Token</TabsTrigger>
                <TabsTrigger value="manage">Manage</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              {/* Create Token Tab */}
              <TabsContent value="create" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Token Creation Form */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Rocket className="h-5 w-5 text-purple-600" />
                        Create Social Token
                      </CardTitle>
                      <CardDescription>
                        Launch your creator token with milestone-based rewards
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="token-name">Token Name</Label>
                        <Input
                          id="token-name"
                          placeholder="My Creator Token"
                          value={tokenData.name}
                          onChange={(e) => setTokenData({...tokenData, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="token-symbol">Symbol</Label>
                        <Input
                          id="token-symbol"
                          placeholder="MCT"
                          value={tokenData.symbol}
                          onChange={(e) => setTokenData({...tokenData, symbol: e.target.value.toUpperCase()})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe your token and its utility..."
                          value={tokenData.description}
                          onChange={(e) => setTokenData({...tokenData, description: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="supply">Initial Supply</Label>
                        <Input
                          id="supply"
                          type="number"
                          value={tokenData.supply}
                          onChange={(e) => setTokenData({...tokenData, supply: parseInt(e.target.value)})}
                        />
                      </div>
                      <Button 
                        onClick={handleCreateToken} 
                        disabled={isCreating || !tokenData.name || !tokenData.symbol}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        {isCreating ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Creating Token...
                          </>
                        ) : (
                          <>
                            <Rocket className="h-4 w-4 mr-2" />
                            Create Token
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Social Integration */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Twitter className="h-5 w-5 text-blue-500" />
                        Social Integration
                      </CardTitle>
                      <CardDescription>
                        Connect your X (Twitter) account for verified metrics
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {!socialConnected ? (
                        <>
                          <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                              Connect your X account to enable milestone-based token minting
                            </AlertDescription>
                          </Alert>
                          <Button onClick={handleSocialConnect} className="w-full" variant="outline">
                            <Twitter className="h-4 w-4 mr-2" />
                            Connect X Account
                          </Button>
                        </>
                      ) : (
                        <div className="space-y-4">
                          <Alert className="border-green-200 bg-green-50">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-800">
                              X account successfully connected and verified
                            </AlertDescription>
                          </Alert>
                          
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Followers</span>
                              <Badge variant="secondary">{socialStats.followers.toLocaleString()}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Engagement Rate</span>
                              <Badge variant="secondary">{socialStats.engagement}%</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Current Milestone</span>
                              <Badge className="bg-purple-100 text-purple-700">{socialStats.milestone}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Verification Status</span>
                              {socialStats.verified ? (
                                <Badge className="bg-green-100 text-green-700">Verified ✓</Badge>
                              ) : (
                                <Badge variant="secondary">Pending</Badge>
                              )}
                            </div>
                          </div>

                          <Separator />

                          <div className="space-y-2">
                            <Label>Milestone Progress</Label>
                            <Progress value={75} className="w-full" />
                            <p className="text-xs text-muted-foreground">
                              7,500 / 10,000 followers for next milestone
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Manage Tab */}
              <TabsContent value="manage">
                <Card>
                  <CardHeader>
                    <CardTitle>Token Management</CardTitle>
                    <CardDescription>View and manage your created tokens</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <Database className="h-12 w-12 mx-auto mb-4" />
                      <p>No tokens created yet. Create your first token to get started!</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics">
                <Card>
                  <CardHeader>
                    <CardTitle>Analytics</CardTitle>
                    <CardDescription>Track your token performance and social metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <LineChart className="h-12 w-12 mx-auto mb-4" />
                      <p>Analytics will appear here once you have active tokens</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Settings</CardTitle>
                    <CardDescription>Configure your account and preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive updates about your tokens
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Auto-mint on Milestones</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically mint tokens when reaching social milestones
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}