type FC = React.FC<PageProps<{ id: string }>>;

const TransactionPage: FC = async ({ params }) => {
  const { id } = await params;
  return <></>;
};

export default TransactionPage;
