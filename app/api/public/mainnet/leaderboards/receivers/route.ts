import { api, InferApiResponse, limiter } from "@/lib/api.helpers";
import { getCachedTopReceiversByTokenAddress } from "@/lib/leaderboards";
import { primaryTokenAddressSchema } from "@/lib/validator";
import { Ratelimit } from "@upstash/ratelimit";
import { z } from "zod";

const querySchema = z.object({
  tokenAddress: primaryTokenAddressSchema,
});

export type GetRecieverLeaderboardApiResponse = InferApiResponse<typeof GET>;
export type GetRecieverLeaderboardQuerySchema = z.infer<typeof querySchema>;

export const GET = limiter(
  api(async (req, { data, error }) => {
    const validation = querySchema.safeParse({
      tokenAddress: req.nextUrl.searchParams.get("tokenAddress"),
    });

    if (!validation.success) {
      return error(
        {
          name: "validation_error",
        },
        {
          status: 400,
        },
      );
    }

    const query = validation.data;
    return data(await getCachedTopReceiversByTokenAddress(query.tokenAddress));
  }),
  {
    algo: Ratelimit.slidingWindow(1, "21600s"),
  },
);
