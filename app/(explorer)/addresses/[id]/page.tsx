export const dynamic = "force-dynamic";

import LinkButton from "@/components/ui/link-button";
import { isAddress } from "@/lib/ethereum";
import { Code } from "@heroui/react";

type FC = React.FC<PageProps<{ id: string }>>;

const AddressPage: FC = async ({ params }) => {
  const { id } = await params;
  const isValid = isAddress(id);

  if (!isValid) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-32">
        <Code>{id}</Code>
        <p className="text-xl font-bold">Invalid address</p>
        <LinkButton href="/" size="md">
          Back To Explorer
        </LinkButton>
      </div>
    );
  }

  return <></>;
};

export default AddressPage;
