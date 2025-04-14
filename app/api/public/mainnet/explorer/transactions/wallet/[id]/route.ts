import { api, InferApiResponse } from "@/lib/api.helpers";
import { getCachedWalletTransactionByTokenAddress } from "@/lib/explorer";
import { primaryTokenAddressSchema } from "@/lib/validator";
import { z } from "zod";

export type GetWalletTransactionApiResponse = InferApiResponse<typeof GET>;
export type GetWalletTransactionQuerySchema = z.infer<typeof querySchema>;

const querySchema = z.object({
  tokenAddress: primaryTokenAddressSchema,
  date: z.coerce.date(),
  limit: z.coerce.number().gte(10).lte(100).int(),
  page: z.coerce.number().gte(1).lte(Number.MAX_SAFE_INTEGER).int(),
});

export const GET = api(async (req, res, { params }) => {
  const p = (await params) as Record<string, string>;
  const q = req.nextUrl.searchParams;
  const validation = querySchema.safeParse({
    tokenAddress: q.get("tokenAddress"),
    date: q.get("date"),
    limit: q.get("limit"),
    page: q.get("page"),
  });

  const address = p["id"] as string;

  if (!validation.success) {
    return res.error(
      {
        name: "validation_error",
      },
      {
        status: 400,
      },
    );
  }

  const { tokenAddress, ...opts } = validation.data;
  const result = await getCachedWalletTransactionByTokenAddress(
    address,
    tokenAddress,
    opts,
  );
  return res.data(result);
});
