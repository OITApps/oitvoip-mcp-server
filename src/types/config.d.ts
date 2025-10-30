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
}
//# sourceMappingURL=config.d.ts.map