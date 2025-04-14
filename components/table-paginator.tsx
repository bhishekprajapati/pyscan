"use client";

import { Button, Chip, Select, SelectItem } from "@heroui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type TablePaginatorProps = {
  page: number;
  pageSize: number;
  totalPages: number;
  pageSizes: number[];
  isFirstPage: boolean;
  isLastPage: boolean;
  onLastPress: () => void;
  onFirstPress: () => void;
  onNextPress: () => void;
  onPrevPress: () => void;
  onPageSizeSelect: (num: number) => void;
};

const TablePaginator: React.FC<TablePaginatorProps> = (props) => {
  const {
    page,
    pageSize,
    pageSizes,
    totalPages,
    isFirstPage,
    isLastPage,
    onFirstPress,
    onLastPress,
    onNextPress,
    onPrevPress,
    onPageSizeSelect,
  } = props;

  return (
    <div className="flex items-center gap-4">
      <div className="me-auto flex items-center gap-2">
        <span>Show</span>
        <Select
          size="sm"
          className="w-24"
          selectionMode="single"
          placeholder={pageSize.toString()}
          onSelectionChange={(k) => {
            const num = Number(Array.from(k)["0"]);
            if (!Number.isNaN(num)) {
              onPageSizeSelect(num);
            }
          }}
        >
          {pageSizes.map((size) => (
            <SelectItem key={size.toString()}>{size}</SelectItem>
          ))}
        </Select>
        <span>Records</span>
      </div>
      <Button
        variant="faded"
        className="ms-auto"
        onPress={onFirstPress}
        isDisabled={isFirstPage}
      >
        First
      </Button>
      <Button
        variant="faded"
        onPress={onPrevPress}
        isDisabled={isFirstPage}
        isIconOnly
      >
        <ChevronLeft size={16} />
      </Button>
      <Chip className="rounded-lg bg-default/50 p-4 outline outline-default">
        Page {page} of {totalPages}
      </Chip>
      <Button
        variant="faded"
        onPress={onNextPress}
        isDisabled={isLastPage}
        isIconOnly
      >
        <ChevronRight size={16} />
      </Button>
      <Button variant="faded" onPress={onLastPress} isDisabled={isLastPage}>
        Last
      </Button>
    </div>
  );
};
export default TablePaginator;
