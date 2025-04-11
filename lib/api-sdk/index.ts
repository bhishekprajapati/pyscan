/**
 * This module exports api sdk for all,
 * the backend api routes for the frontend.
 */

/**
 * NOTE: To future me
 * Sole purpose of writing get functions using POST methods
 * is make my little life easier while serializing and parsing
 * nested query objects in body since using body in GET fetch calls
 * and i couldn't find any other easier way to serialize nested object as search params
 */

import { createMainnetAnalytics } from "./analytics";
import { createMainnetExplorer } from "./explorer";
import { createURL } from "./fetcher";

type CreateClientOptions = {
  baseUrl?: string;
};

function createClient(opts: CreateClientOptions = {}) {
  const { baseUrl } = opts;
  const publicBase = createURL(baseUrl, "/api/public");
  const privateBase = createURL(baseUrl, "/api/private");

  return {
    public: {
      explorer: createMainnetExplorer(publicBase),
      analytics: createMainnetAnalytics(publicBase),
    },
    private: {
      explorer: createMainnetExplorer(privateBase),
      analytics: createMainnetAnalytics(privateBase),
    },
  };
}

const api = createClient();
export default api;
