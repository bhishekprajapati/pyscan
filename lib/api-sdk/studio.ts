// import type { ExecuteQueryApiResponse } from "@/app/api/queries/execute/route";

// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// const getPrivateMethods = () => {
//   const queries = (() => {
//     const exec = async (query: string, opts: BaseOptions = {}) => {
//       try {
//         const res = await fetch(_URL("/api/queries/execute"), {
//           method: "POST",
//           body: JSON.stringify({ query }),
//           ...opts,
//         });
//         const json = (await res.json()) as ExecuteQueryApiResponse;
//         return json;
//       } catch (err) {
//         console.error(err);
//         return error({
//           name: "unknown-error",
//           message: "Something went wrong",
//         });
//       }
//     };

//     return {
//       exec,
//     };
//   })();

//   return {
//     queries,
//   } as const;
// };
