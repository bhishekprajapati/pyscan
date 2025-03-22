export function clip(
  address: string,
  length = 6,
  position: "start" | "end" | "center" = "center",
): string {
  if (address.length <= length * 2) return address;

  switch (position) {
    case "start":
      return `...${address.slice(-length)}`;
    case "end":
      return `${address.slice(0, length)}...`;
    case "center":
    default:
      return `${address.slice(0, length)}...${address.slice(-length)}`;
  }
}
