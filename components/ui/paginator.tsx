"use client";

import type { Paginator as PaginatorHook } from "@/hooks/table";
import { Button, Chip, Select, SelectItem } from "@heroui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginatorProps = {
  paginator: PaginatorHook;
  showSelect?: boolean;
};

export const Paginator: React.FC<PaginatorProps> = (props) => {
  const { paginator, showSelect = true } = props;
  const sizes = paginator
    .getPageSizes()
    .map((size) => ({ key: size, label: size }));

  return (
    <div className="flex items-center gap-4">
      {showSelect && (
        <div className="me-auto flex items-center gap-2">
          <span>Show</span>
          <Select
            size="sm"
            className="w-24"
            placeholder={paginator.pageSize.toString()}
            selectedKeys={[]}
            defaultSelectedKeys={new Set([paginator.pageSize.toString()])}
            onSelectionChange={(keys) => {
              const sizes = Array.from(keys).map((n) => Number(n));
              if (sizes.length) {
                paginator.setPageSize(sizes[0]);
              }
            }}
          >
            {sizes.map(({ key, label }) => (
              <SelectItem key={key}>{label}</SelectItem>
            ))}
          </Select>
          <span>Records</span>
        </div>
      )}
      <Button
        variant="faded"
        className="ms-auto"
        onPress={paginator.toFirstPage}
        isDisabled={paginator.isFirstPage}
      >
        First
      </Button>
      <Button
        variant="faded"
        onPress={paginator.prevPage}
        isIconOnly
        isDisabled={paginator.isFirstPage}
      >
        <ChevronLeft size={16} />
      </Button>
      <Chip className="rounded-lg bg-default/50 p-4 outline outline-default">
        Page {paginator.page} of {paginator.totalPages}
      </Chip>
      <Button
        variant="faded"
        onPress={paginator.nextPage}
        isDisabled={paginator.isLastPage}
        isIconOnly
      >
        <ChevronRight size={16} />
      </Button>
      <Button
        variant="faded"
        onPress={paginator.toLastPage}
        isDisabled={paginator.isLastPage}
      >
        Last
      </Button>
    </div>
  );
};
