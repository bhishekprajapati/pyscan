type PageProps<
  P extends Record<any, any> = {},
  S extends Record<any, any> = {},
> = {
  params: Promise<P>;
  searchParams: Promise<S>;
};
