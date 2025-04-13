import { cn, Select, SelectItem } from "@heroui/react";
import { ChartSpline } from "lucide-react";
import { useState } from "react";
import { CurveType } from "recharts/types/shape/Curve";

export function useSelectedCurveType() {
  const [type, setType] = useState<CurveType>("monotone");
  const options: CurveTypeSelectProps["options"] = [
    {
      key: "basis",
      name: "Basis",
    },
    {
      key: "monotone",
      name: "Monotone",
    },
    {
      key: "linear",
      name: "Linear",
    },
    {
      key: "natural",
      name: "Natural",
    },
    {
      key: "bump",
      name: "Bump",
    },
    {
      key: "step",
      name: "Step",
    },
  ];

  const register = {
    options,
    value: type,
    onChange: (c: CurveType) => setType(c),
  };

  return [type, register] as const;
}

type CurveTypeSelectProps = {
  className?: string;
  options: { key: CurveType; name: string }[];
  value: CurveType;
  onChange: (c: CurveType) => void;
};

const CurveTypeSelect: React.FC<CurveTypeSelectProps> = ({
  className,
  options,
  value,
  onChange,
}) => (
  <Select
    startContent={<ChartSpline size={16} />}
    className={cn("w-32", className)}
    selectionMode="single"
    value={value as string}
    placeholder={value as string}
    size="sm"
    aria-label="select curve type"
    items={options}
    onSelectionChange={(set) => onChange(Array.from(set)[0] as CurveType)}
    variant="bordered"
  >
    {(opt) => (
      <SelectItem
        key={opt.key as string}
        textValue={opt.name}
        aria-label={opt.name}
      >
        {opt.name}
      </SelectItem>
    )}
  </Select>
);

export default CurveTypeSelect;
