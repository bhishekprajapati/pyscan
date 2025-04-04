import CopyButton from "@/components/copy-button";
import { FMono, TextTruncate } from "@/components/text";
import ethereum from "@/lib/ethereum";
import { Chip } from "@heroui/react";

const { CONTRACT_ADDRESS } = ethereum;

export const PyusdSupply = () => (
  <div>
    <h3 className="text-foreground-500">Max Total Supply</h3>
    <p className="mb-4">
      <FMono>672,119,685.918257</FMono> PYUSD
    </p>
    <h3 className="text-foreground-500">Holders</h3>
    <p className="mb-4">
      <FMono>26,148</FMono>
    </p>
    <h3 className="text-foreground-500">Total Transfers</h3>
    <p className="mb-4">
      More than <FMono>585,463</FMono>
    </p>
  </div>
);

export const PyusdHolderInfo = () => (
  <div>
    <h3 className="text-foreground-500">OnChain Market Cap</h3>
    <p className="mb-4">
      <FMono>$672,119,685.92</FMono>
    </p>
    <h3 className="text-foreground-500">Circulating Supply Market Cap</h3>
    <p className="mb-4">
      <FMono>$803,035,299.00</FMono>
    </p>
  </div>
);

export const PyusdTokenInfo = () => (
  <div>
    <div>
      <h3 className="text-foreground-500">Token Contract</h3>
      <p className="mb-4 flex items-center gap-4">
        <TextTruncate className="w-[90%]">
          <FMono>{CONTRACT_ADDRESS}</FMono>
        </TextTruncate>
        <CopyButton
          value={CONTRACT_ADDRESS}
          tooltipText="Copy PYUSD contract address"
        />
      </p>
      <Chip className="me-4" variant="dot" color="primary">
        ERC-20
      </Chip>
      <Chip variant="shadow" color="primary">
        # Stablecoin
      </Chip>
    </div>
  </div>
);
