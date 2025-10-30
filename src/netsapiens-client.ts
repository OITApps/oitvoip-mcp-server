/**
 * NetSapiens API Client for OITVOIP MCP Server
 * Handles all interactions with the NetSapiens platform
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  NetSapiensConfig, 
  NetSapiensApiResponse, 
  NetSapiensUser, 
  NetSapiensDomain, 
  NetSapiensCDR, 
  NetSapiensDevice,
  NetSapiensPhoneNumber,
  NetSapiensCallQueue,
  NetSapiensAgent,
  NetSapiensAutoAttendant,
  NetSapiensAnswerRule,
  NetSapiensGreeting,
  NetSapiensVoicemail,
  NetSapiensMusicOnHold,
  NetSapiensBilling
} from './types/config.js';

export class NetSapiensClient {
  private client: AxiosInstance;
  private config: NetSapiensConfig;

  constructor(config: NetSapiensConfig) {
    this.config = config;
    
    this.client = axios.create({
      baseURL: `${config.apiUrl}/ns-api/v2`,
      timeout: config.timeout || 30000,
      headers: {
        'Authorization': `Bearer ${config.apiToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'OITVOIP-MCP-Server/1.0.0'
      }
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('NetSapiens API Error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url
        });
        return Promise.reject(error);
      }
    );
  }

  /**
   * Search for users across all domains in NetSapiens
   */
  async searchUsers(query: string, domain?: string, limit: number = 20): Promise<NetSapiensApiResponse<NetSapiensUser[]>> {
    try {
      let endpoint = '/domains/~/users/~';
      if (domain) {
        endpoint = `/domains/${domain}/users`;
      }

      const response: AxiosResponse = await this.client.get(endpoint, {
        params: {
          user: query,
          limit
        }
      });

      return {
        success: true,
        data: Array.isArray(response.data) ? response.data : [response.data]
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to search users',
        data: []
      };
    }
  }

  /**
   * Get user details by user ID and domain
   */
  async getUser(userId: string, domain: string): Promise<NetSapiensApiResponse<NetSapiensUser>> {
    try {
      const response: AxiosResponse = await this.client.get(`/domains/${domain}/users/${userId}`);

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get user',
        data: undefined
      };
    }
  }

  /**
   * Get call detail records (CDR)
   */
  async getCDRRecords(params: {
    startDate?: string;
    endDate?: string;
    user?: string;
    domain?: string;
    limit?: number;
  }): Promise<NetSapiensApiResponse<NetSapiensCDR[]>> {
    try {
      let endpoint = '/cdrs';
      
      // If specific user and domain provided, use user-specific endpoint
      if (params.user && params.domain) {
        endpoint = `/domains/${params.domain}/users/${params.user}/cdrs`;
      } else if (params.domain) {
        endpoint = `/domains/${params.domain}/cdrs`;
      }

      const response: AxiosResponse = await this.client.get(endpoint, {
        params: {
          start_time: params.startDate,
          end_time: params.endDate,
          limit: params.limit || 100
        }
      });

      return {
        success: true,
        data: Array.isArray(response.data) ? response.data : [response.data]
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get CDR records',
        data: []
      };
    }
  }

  /**
   * Get domain information
   */
  async getDomains(): Promise<NetSapiensApiResponse<NetSapiensDomain[]>> {
    try {
      const response: AxiosResponse = await this.client.get('/domains');

      return {
        success: true,
        data: Array.isArray(response.data) ? response.data : [response.data]
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get domains',
        data: []
      };
    }
  }

  /**
   * Get specific domain information
   */
  async getDomain(domain: string): Promise<NetSapiensApiResponse<NetSapiensDomain>> {
    try {
      const response: AxiosResponse = await this.client.get(`/domains/${domain}`);

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get domain',
        data: undefined
      };
    }
  }

  /**
   * Get user devices
   */
  async getUserDevices(userId: string, domain: string): Promise<NetSapiensApiResponse<NetSapiensDevice[]>> {
    try {
      const response: AxiosResponse = await this.client.get(`/domains/${domain}/users/${userId}/devices`);

      return {
        success: true,
        data: Array.isArray(response.data) ? response.data : [response.data]
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get user devices',
        data: []
      };
    }
  }

  // ==================== PHONE NUMBER MANAGEMENT ====================
  
  /**
   * Get phone numbers for a domain
   */
  async getPhoneNumbers(domain: string, limit?: number): Promise<NetSapiensApiResponse<NetSapiensPhoneNumber[]>> {
    try {
      const response: AxiosResponse = await this.client.get(`/domains/${domain}/phonenumbers`, {
        params: { limit }
      });

      return {
        success: true,
        data: Array.isArray(response.data) ? response.data : [response.data]
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get phone numbers',
        data: []
      };
    }
  }

  /**
   * Get specific phone number details
   */
  async getPhoneNumber(domain: string, phoneNumber: string): Promise<NetSapiensApiResponse<NetSapiensPhoneNumber>> {
    try {
      const response: AxiosResponse = await this.client.get(`/domains/${domain}/phonenumbers/${phoneNumber}`);

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get phone number',
        data: undefined
      };
    }
  }

  // ==================== CALL QUEUE MANAGEMENT ====================
  
  /**
   * Get call queues for a domain
   */
  async getCallQueues(domain: string): Promise<NetSapiensApiResponse<NetSapiensCallQueue[]>> {
    try {
      const response: AxiosResponse = await this.client.get(`/domains/${domain}/callqueues`);

      return {
        success: true,
        data: Array.isArray(response.data) ? response.data : [response.data]
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get call queues',
        data: []
      };
    }
  }

  /**
   * Get specific call queue details
   */
  async getCallQueue(domain: string, queueId: string): Promise<NetSapiensApiResponse<NetSapiensCallQueue>> {
    try {
      const response: AxiosResponse = await this.client.get(`/domains/${domain}/callqueues/${queueId}`);

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get call queue',
        data: undefined
      };
    }
  }

  /**
   * Get agents for a call queue
   */
  async getCallQueueAgents(domain: string, queueId: string): Promise<NetSapiensApiResponse<NetSapiensAgent[]>> {
    try {
      const response: AxiosResponse = await this.client.get(`/domains/${domain}/callqueues/${queueId}/agents`);

      return {
        success: true,
        data: Array.isArray(response.data) ? response.data : [response.data]
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get call queue agents',
        data: []
      };
    }
  }

  // ==================== AGENT MANAGEMENT ====================
  
  /**
   * Get agents for a domain
   */
  async getAgents(domain: string): Promise<NetSapiensApiResponse<NetSapiensAgent[]>> {
    try {
      const response: AxiosResponse = await this.client.get(`/domains/${domain}/agents`);

      return {
        success: true,
        data: Array.isArray(response.data) ? response.data : [response.data]
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get agents',
        data: []
      };
    }
  }

  /**
   * Login an agent to a call queue
   */
  async loginAgent(domain: string, queueId: string, agentId: string): Promise<NetSapiensApiResponse<any>> {
    try {
      const response: AxiosResponse = await this.client.post(`/domains/${domain}/callqueues/${queueId}/agents/${agentId}/login`);

      return {
        success: true,
        data: response.data,
        message: 'Agent logged in successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to login agent',
        data: undefined
      };
    }
  }

  /**
   * Logout an agent from a call queue
   */
  async logoutAgent(domain: string, queueId: string, agentId: string): Promise<NetSapiensApiResponse<any>> {
    try {
      const response: AxiosResponse = await this.client.post(`/domains/${domain}/callqueues/${queueId}/agents/${agentId}/logout`);

      return {
        success: true,
        data: response.data,
        message: 'Agent logged out successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to logout agent',
        data: undefined
      };
    }
  }

  // ==================== AUTO ATTENDANT ====================
  
  /**
   * Get auto attendants for a domain
   */
  async getAutoAttendants(domain: string): Promise<NetSapiensApiResponse<NetSapiensAutoAttendant[]>> {
    try {
      const response: AxiosResponse = await this.client.get(`/domains/${domain}/autoattendants`);

      return {
        success: true,
        data: Array.isArray(response.data) ? response.data : [response.data]
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get auto attendants',
        data: []
      };
    }
  }

  // ==================== ANSWER RULES ====================
  
  /**
   * Get answer rules for a user
   */
  async getUserAnswerRules(userId: string, domain: string): Promise<NetSapiensApiResponse<NetSapiensAnswerRule[]>> {
    try {
      const response: AxiosResponse = await this.client.get(`/domains/${domain}/users/${userId}/answerrules`);

      return {
        success: true,
        data: Array.isArray(response.data) ? response.data : [response.data]
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get answer rules',
        data: []
      };
    }
  }

  /**
   * Get specific answer rule for a user
   */
  async getUserAnswerRule(userId: string, domain: string, timeframe: string): Promise<NetSapiensApiResponse<NetSapiensAnswerRule>> {
    try {
      const response: AxiosResponse = await this.client.get(`/domains/${domain}/users/${userId}/answerrules/${timeframe}`);

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get answer rule',
        data: undefined
      };
    }
  }

  // ==================== GREETINGS & VOICEMAIL ====================
  
  /**
   * Get user greetings
   */
  async getUserGreetings(userId: string, domain: string): Promise<NetSapiensApiResponse<NetSapiensGreeting[]>> {
    try {
      const response: AxiosResponse = await this.client.get(`/domains/${domain}/users/${userId}/greetings`);

      return {
        success: true,
        data: Array.isArray(response.data) ? response.data : [response.data]
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get user greetings',
        data: []
      };
    }
  }

  /**
   * Get user voicemails
   */
  async getUserVoicemails(userId: string, domain: string): Promise<NetSapiensApiResponse<NetSapiensVoicemail[]>> {
    try {
      const response: AxiosResponse = await this.client.get(`/domains/${domain}/users/${userId}/voicemail`);

      return {
        success: true,
        data: Array.isArray(response.data) ? response.data : [response.data]
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get user voicemails',
        data: []
      };
    }
  }

  // ==================== MUSIC ON HOLD ====================
  
  /**
   * Get music on hold files for a domain
   */
  async getMusicOnHold(domain: string): Promise<NetSapiensApiResponse<NetSapiensMusicOnHold[]>> {
    try {
      const response: AxiosResponse = await this.client.get(`/domains/${domain}/moh`);

      return {
        success: true,
        data: Array.isArray(response.data) ? response.data : [response.data]
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get music on hold',
        data: []
      };
    }
  }

  // ==================== BILLING ====================
  
  /**
   * Get billing information for a domain
   */
  async getBilling(domain: string): Promise<NetSapiensApiResponse<NetSapiensBilling>> {
    try {
      const response: AxiosResponse = await this.client.get(`/domains/${domain}/billing`);

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get billing information',
        data: undefined
      };
    }
  }

  // ==================== STATISTICS ====================
  
  /**
   * Get agent statistics
   */
  async getAgentStatistics(domain: string, agentId?: string): Promise<NetSapiensApiResponse<any>> {
    try {
      const endpoint = agentId 
        ? `/domains/${domain}/statistics/agent/${agentId}`
        : `/domains/${domain}/statistics/agent`;
      
      const response: AxiosResponse = await this.client.get(endpoint);

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get agent statistics',
        data: undefined
      };
    }
  }

  /**
   * Test API connectivity
   */
  async testConnection(): Promise<NetSapiensApiResponse<boolean>> {
    try {
      const response = await this.client.get('/domains', {
        params: {
          limit: 1
        }
      });

      return {
        success: true,
        data: true,
        message: 'Connection successful'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Connection failed',
        data: false
      };
    }
  }
}