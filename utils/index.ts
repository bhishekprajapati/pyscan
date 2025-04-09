export const sortByDate = <T extends { timestamp: Date }>(a: T, b: T) =>
  a.timestamp.getTime() - b.timestamp.getTime();
