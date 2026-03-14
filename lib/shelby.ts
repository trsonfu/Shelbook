// Legacy re-exports for backward compatibility
// New code should use @/utils/client instead
export {
  aptosClient,
  getAptosClient,
  getShelbyClient,
} from "@/utils/client";

// Re-export shelbyClient instance for legacy code
import { getShelbyClient } from "@/utils/client";
export const shelbyClient = getShelbyClient();
