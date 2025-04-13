import ms from "ms";
const s = (ts: ms.StringValue) => ms(ts) / 1000;

export const revalidate = {
  "1GB": s("6h"),
  "5GB": s("12h"),
  "10GB": s("2 days"),
  "50GB": s("5 days"),
  "100GB": s("10 days"),
  "200GB": s("15 days"),
};
