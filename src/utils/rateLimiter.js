/**
 * Executes an async function with exponential backoff retry on 429 quota errors.
 */
export async function callWithRetry(fn, retries = 3, delayMs = 2000) {
  try {
    return await fn();
  } catch (error) {
    const isRateLimit = 
      error?.status === 429 || 
      error?.message?.includes('429') || 
      error?.message?.includes('RESOURCE_EXHAUSTED');

    if (isRateLimit && retries > 0) {
      console.warn(`⏳ Rate limit reached. Retrying in ${delayMs / 1000}s... (${retries} retries left)`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      return callWithRetry(fn, retries - 1, delayMs * 2); // Exponential backoff
    }
    throw error;
  }
}

/**
 * Small delay helper to space out consecutive API requests.
 */
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));