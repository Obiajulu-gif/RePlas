/**
 * Configuration and environment variables
 */

interface Config {
  gemini: {
    apiKey: string | undefined;
    enabled: boolean;
  };
}

// Get the environment variables with safety checks
const config: Config = {
  gemini: {
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    enabled: process.env.NEXT_PUBLIC_GEMINI_API_KEY !== undefined,
  },
};

// Validate essential configuration
export function validateConfig() {
  const missingVars = [];

  if (!config.gemini.apiKey) {
    missingVars.push('NEXT_PUBLIC_GEMINI_API_KEY');
  }

  if (missingVars.length > 0) {
    console.warn(`Missing environment variables: ${missingVars.join(', ')}`);
    return false;
  }

  return true;
}

export default config; 