/**
 * Configuration types for OITVOIP MCP Server
 */

export interface NetSapiensConfig {
  /** NetSapiens API server base URL */
  apiUrl: string;
  /** API authentication token */
  apiToken: string;
  /** Optional timeout for API requests (milliseconds) */
  timeout?: number;
  /** Optional rate limiting configuration */
  rateLimit?: {
    requests: number;
    perMilliseconds: number;
  };
}

export interface MCPServerConfig {
  /** Server name */
  name: string;
  /** Server version */
  version: string;
  /** NetSapiens configuration */
  netsapiens: NetSapiensConfig;
  /** Debug mode */
  debug?: boolean;
}

export interface NetSapiensApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface NetSapiensUser {
  user: string;
  domain: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  status?: string;
  subscriber_id?: string;
  caller_id?: string;
  extension?: string;
  forward?: string;
  voicemail?: boolean;
  timezone?: string;
}

export interface NetSapiensDomain {
  domain: string;
  description?: string;
  customer?: string;
  status?: string;
  subscription?: string;
  territory?: string;
  timezone?: string;
}

export interface NetSapiensCDR {
  call_id?: string;
  caller?: string;
  callee?: string;
  start_time?: string;
  end_time?: string;
  duration?: number;
  disposition?: string;
  direction?: string;
  realm?: string;
  customer?: string;
}

export interface NetSapiensDevice {
  object: string;
  mac?: string;
  template?: string;
  user?: string;
  domain?: string;
  status?: string;
  model?: string;
}

export interface NetSapiensPhoneNumber {
  phonenumber: string;
  domain?: string;
  user?: string;
  object?: string;
  description?: string;
  status?: string;
  routing?: string;
}

export interface NetSapiensCallQueue {
  object: string;
  domain: string;
  name?: string;
  description?: string;
  status?: string;
  max_wait_time?: number;
  strategy?: string;
  music_on_hold?: string;
}

export interface NetSapiensAgent {
  object: string;
  agent?: string;
  domain?: string;
  user?: string;
  status?: string;
  skills?: string[];
  login_status?: string;
}

export interface NetSapiensAutoAttendant {
  object: string;
  domain: string;
  name?: string;
  prompt?: string;
  timeout?: number;
  options?: any;
}

export interface NetSapiensAnswerRule {
  object: string;
  timeframe: string;
  user?: string;
  domain?: string;
  forward?: string;
  voicemail?: boolean;
  status?: string;
}

export interface NetSapiensGreeting {
  object: string;
  index: number;
  user?: string;
  domain?: string;
  type?: string;
  filename?: string;
  duration?: number;
}

export interface NetSapiensVoicemail {
  object: string;
  user?: string;
  domain?: string;
  caller?: string;
  timestamp?: string;
  duration?: number;
  status?: string;
}

export interface NetSapiensMusicOnHold {
  object: string;
  index: number;
  domain?: string;
  filename?: string;
  description?: string;
  duration?: number;
}

export interface NetSapiensBilling {
  domain: string;
  period?: string;
  charges?: number;
  usage?: any;
  details?: any;
}