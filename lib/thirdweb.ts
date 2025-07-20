import { createThirdwebClient, getContract, prepareContractCall, sendTransaction } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { privateKeyToAccount } from "thirdweb/wallets";

// Initialize Thirdweb client
export const client = createThirdwebClient({
  clientId: process.env.THIRDWEB_CLIENT_ID!,
});

// Define Arbitrum chain
export const arbitrum = defineChain(42161);

// Admin account for contract interactions
export const adminAccount = privateKeyToAccount({
  client,
  privateKey: process.env.ADMIN_WALLET_PRIVATE_KEY!,
});

// Factory contract configuration
export const FACTORY_CONTRACT_ADDRESS = process.env.FACTORY_CONTRACT_ADDRESS!;

// Get the factory contract instance
export const getFactoryContract = () => {
  return getContract({
    address: FACTORY_CONTRACT_ADDRESS,
    chain: arbitrum,
    client,
  });
};

// Token contract interaction utilities
export class TokenContractManager {
  private contract: any;

  constructor(tokenAddress: string) {
    this.contract = getContract({
      address: tokenAddress,
      chain: arbitrum,
      client,
    });
  }

  // Mint tokens to a specific address
  async mintTo(to: string, amount: string) {
    const transaction = prepareContractCall({
      contract: this.contract,
      method: "mintTo",
      params: [to, amount],
    });

    return await sendTransaction({
      transaction,
      account: adminAccount,
    });
  }

  // Update follower count (oracle function)
  async updateFollowerCount(newCount: number) {
    const transaction = prepareContractCall({
      contract: this.contract,
      method: "updateFollowerCount",
      params: [newCount],
    });

    return await sendTransaction({
      transaction,
      account: adminAccount,
    });
  }

  // Get token details
  async getTokenInfo() {
    try {
      const [name, symbol, totalSupply, decimals] = await Promise.all([
        this.contract.call("name"),
        this.contract.call("symbol"),
        this.contract.call("totalSupply"),
        this.contract.call("decimals"),
      ]);

      return {
        name,
        symbol,
        totalSupply: totalSupply.toString(),
        decimals: Number(decimals),
      };
    } catch (error) {
      console.error("Error fetching token info:", error);
      throw error;
    }
  }

  // Get balance of an address
  async balanceOf(address: string) {
    try {
      const balance = await this.contract.call("balanceOf", [address]);
      return balance.toString();
    } catch (error) {
      console.error("Error fetching balance:", error);
      throw error;
    }
  }

  // Transfer tokens (for distributions)
  async transfer(to: string, amount: string) {
    const transaction = prepareContractCall({
      contract: this.contract,
      method: "transfer",
      params: [to, amount],
    });

    return await sendTransaction({
      transaction,
      account: adminAccount,
    });
  }

  // Batch transfer for airdrops
  async batchTransfer(recipients: string[], amounts: string[]) {
    if (recipients.length !== amounts.length) {
      throw new Error("Recipients and amounts arrays must have the same length");
    }

    const transaction = prepareContractCall({
      contract: this.contract,
      method: "airdrop",
      params: [recipients, amounts],
    });

    return await sendTransaction({
      transaction,
      account: adminAccount,
    });
  }
}

// Factory contract utilities
export class FactoryContractManager {
  private factory: any;

  constructor() {
    this.factory = getFactoryContract();
  }

  // Create a new token
  async createToken(
    name: string,
    symbol: string,
    initialFollowerCount: number,
    tokensPerFollower: string
  ) {
    const transaction = prepareContractCall({
      contract: this.factory,
      method: "createToken",
      params: [name, symbol, initialFollowerCount, tokensPerFollower],
    });

    return await sendTransaction({
      transaction,
      account: adminAccount,
    });
  }

  // Get deployed token address from transaction receipt
  async getTokenAddressFromTx(txHash: string) {
    // This would need to parse the transaction logs to extract the token address
    // Implementation depends on the specific factory contract events
    throw new Error("Implementation needed based on factory contract events");
  }
}

// Utility functions
export const parseTokenAmount = (amount: string, decimals: number = 18): string => {
  // Convert human-readable amount to wei format
  const factor = BigInt(10 ** decimals);
  return (BigInt(Math.floor(parseFloat(amount) * 1e6)) * factor / BigInt(1e6)).toString();
};

export const formatTokenAmount = (amount: string, decimals: number = 18): string => {
  // Convert wei format to human-readable amount
  const factor = BigInt(10 ** decimals);
  const value = BigInt(amount);
  const whole = value / factor;
  const fractional = value % factor;
  return `${whole}.${fractional.toString().padStart(decimals, '0').slice(0, 6)}`;
};

// Network utilities
export const switchToArbitrum = async () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xA4B1' }], // Arbitrum One
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0xA4B1',
                chainName: 'Arbitrum One',
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://arb1.arbitrum.io/rpc'],
                blockExplorerUrls: ['https://arbiscan.io/'],
              },
            ],
          });
        } catch (addError) {
          console.error('Error adding Arbitrum network:', addError);
          throw addError;
        }
      } else {
        console.error('Error switching to Arbitrum:', switchError);
        throw switchError;
      }
    }
  }
};

export default {
  client,
  arbitrum,
  adminAccount,
  TokenContractManager,
  FactoryContractManager,
  parseTokenAmount,
  formatTokenAmount,
  switchToArbitrum,
};