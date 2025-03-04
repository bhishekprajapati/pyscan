import "server-only";
import { z } from "zod";

const env = z.object({}).readonly().parse(process.env);
export default env;
