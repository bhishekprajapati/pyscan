import "server-only";
import env from "@/env";
import { createClient } from "../bigquery";
import { unstable_cache as cache } from "next/cache";
import { revalidate } from "@/utils/cache";

const creds = JSON.parse(
  Buffer.from(env.GOOGLE_CREDS_BASE64_1, "base64").toString(),
);

const client = createClient({
  bigQueryOptions: {
    credentials: creds,
    projectId: creds.projectId,
  },
});

const { leaderboards } = client.ethereum.mainnet;

export const getCachedTopHoldersByTokenAddress = cache(
  async (address: string) => {
    const res = await leaderboards.getTopHoldersByTokenAddress(address);
    if (!res.success) {
      throw Error(res.reason);
    }
    return {
      data: res.data,
      timestamp: Date.now(),
    };
  },
  [],
  {
    revalidate: revalidate["50GB"],
  },
);

export const getCachedTopSendersByTokenAddress = cache(
  async (address: string) => {
    const res = await leaderboards.getSenderLeadersByTokenAddress(address);
    if (!res.success) {
      throw Error(res.reason);
    }
    return {
      data: res.data,
      timestamp: Date.now(),
    };
  },
  [],
  {
    revalidate: revalidate["5GB"],
  },
);

export const getCachedTopReceiversByTokenAddress = cache(
  async (address: string) => {
    const res = await leaderboards.getReceiverLeadersByTokenAddress(address);
    if (!res.success) {
      throw Error(res.reason);
    }
    return {
      data: res.data,
      timestamp: Date.now(),
    };
  },
  [],
  {
    revalidate: revalidate["10GB"],
  },
);

export const getCachedTopBurnersByTokenAddress = cache(
  async (address: string) => {
    const res = await leaderboards.getBurnLeadersByTokenAddress(address);
    if (!res.success) {
      throw Error(res.reason);
    }
    return {
      data: res.data,
      timestamp: Date.now(),
    };
  },
  [],
  {
    revalidate: revalidate["10GB"],
  },
);
