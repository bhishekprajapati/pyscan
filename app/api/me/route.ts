import { auth } from "@/lib/api";
export const GET = auth(async (_, res, { session }) => res.data(session));
