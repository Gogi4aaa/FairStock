import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "69485ea1cbee75e2a958af43",
  requiresAuth: false, // We will handle auth redirects manually for custom logic
  // Add more config here to disable autoInitAuth if available in SDK
});
