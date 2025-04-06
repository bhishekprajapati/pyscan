"use client";
import { Button, Textarea } from "@heroui/react";
import { isServer, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";

const useQueryStats = (query: string) =>
  useQuery({
    queryKey: ["query-stats", query],
    queryFn: async ({ signal }) => {
      const res = await fetch("/api/queries/stats", {
        body: JSON.stringify({ query }),
        method: "POST",
        signal,
      });
      const json = await res.json();
      if (!json.ok) {
        throw Error(json.error.message);
      }
      return json.data;
    },
    enabled: !isServer || query !== "",
  });

type QueryEditorProps = {
  defaultQuery?: string;
};

const QueryEditor: React.FC<QueryEditorProps> = (props) => {
  const { defaultQuery = "" } = props;
  const [query, setQuery] = useState(defaultQuery);
  const stats = useQueryStats(query);

  const handler = useMemo(
    () => debounce((q: string) => setQuery(q), 500),
    [setQuery],
  );

  useEffect(() => {
    console.log(stats.data);
    console.log(stats.error);
  }, [stats.status]);

  return (
    <div className="grid gap-4">
      <Button>Run</Button>
      <Textarea
        variant="bordered"
        defaultValue={defaultQuery}
        onChange={(e) => handler(e.target.value)}
      />
    </div>
  );
};

export default QueryEditor;
