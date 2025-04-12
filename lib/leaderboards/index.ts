import "server-only";
import env from "@/env";
import { createClient } from "../bigquery";
import { unstable_cacheLife } from "next/cache";

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

export const getCachedTopHoldersByTokenAddress = async (address: string) => {
  "use cache";
  unstable_cacheLife("weeks");

  const res = await leaderboards.getTopHoldersByTokenAddress(address);
  if (!res.success) {
    throw Error(res.reason);
  }
  return {
    data: res.data,
    timestamp: Date.now(),
  };
};

export const getCachedTopSendersByTokenAddress = async (address: string) => {
  "use cache";
  unstable_cacheLife("weeks");

  const res = await leaderboards.getSenderLeadersByTokenAddress(address);
  if (!res.success) {
    throw Error(res.reason);
  }
  return {
    data: res.data,
    timestamp: Date.now(),
  };
};

export const getCachedTopReceiversByTokenAddress = async (address: string) => {
  "use cache";
  unstable_cacheLife("weeks");

  const res = await leaderboards.getReceiverLeadersByTokenAddress(address);
  if (!res.success) {
    throw Error(res.reason);
  }
  return {
    data: res.data,
    timestamp: Date.now(),
  };
};

export const getCachedTopBurnersByTokenAddress = async (address: string) => {
  "use cache";
  unstable_cacheLife("weeks");

  const res = await leaderboards.getBurnLeadersByTokenAddress(address);
  if (!res.success) {
    throw Error(res.reason);
  }
  return {
    data: res.data,
    timestamp: Date.now(),
  };
};
