"use client";

import { Input } from "@heroui/react";
import { CornerDownLeft, Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";

const SInput = () => {
  const router = useRouter();
  const ref = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [isValid, setIsValid] = useState(false);

  function detectType(input: string) {
    const clean = input.trim();
    if (/^0x[a-fA-F0-9]{64}$/.test(clean)) return { type: "tx", value: clean };
    if (/^0x[a-fA-F0-9]{40}$/.test(clean))
      return { type: "address", value: clean };
    if (/^\d+$/.test(clean)) return { type: "block", value: clean };
    return null;
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const result = detectType(value);
      if (!result) {
        setIsValid(false);
        return;
      }
      setIsValid(true);
      const { type, value: val } = result;

      if (type === "address") {
        router.push(`/addresses/${val}`);
        return;
      }

      if (type === "block") {
        router.push(`/blocks/${val}`);
        return;
      }

      if (type === "tx") {
        router.push(`/transactions/${val}`);
        return;
      }
    }
  }

  return (
    <Input
      ref={ref}
      size="sm"
      startContent={<Search size={16} />}
      endContent={
        <CornerDownLeft
          size={16}
          className={isValid ? "animate-blink text-primary" : ""}
        />
      }
      variant="flat"
      color="default"
      className="me-4 hidden w-[25%] md:flex"
      placeholder="Search by Address / Txn Hash / Block"
      onChange={(e) => {
        const value = e.target.value;
        setValue(value);
        const result = detectType(value);
        if (!result) {
          setIsValid(false);
          return;
        }
        setIsValid(true);
      }}
      onKeyDown={handleKeyDown}
    />
  );
};

const SeachInput = () => {
  const path = usePathname();
  return <SInput key={path} />;
};

export default SeachInput;
