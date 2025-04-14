"use client";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import QueryResult from "@/components/sql-query/query-result";
import SqlEditor, {
  type SqlEditorProps,
} from "@/components/sql-query/sql-editor";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api-sdk";
import { makeMutationFn } from "@/utils/tanstack";
import { useState } from "react";
import { addToast } from "@heroui/react";

const useQueryExecutor = () => {
  const fn = makeMutationFn(api.private.explorer.execQuery);
  const mutation = useMutation({
    mutationKey: ["queries", "exec"],
    mutationFn: fn,
  });

  return {
    exec: mutation.mutateAsync,
    ...mutation,
  };
};

type QueryStudioProps = {
  editorProps: SqlEditorProps;
};

const QueryStudio: React.FC<QueryStudioProps> = (props) => {
  const { editorProps } = props;
  const [query, setQuery] = useState("");
  const executor = useQueryExecutor();
  const [results, setResults] = useState<unknown[] | undefined>(undefined);

  return (
    <div className="m-4 h-[calc(100dvh-6.5rem)]">
      <PanelGroup className="h-full gap-2" direction="vertical">
        <Panel defaultSize={75} minSize={25}>
          <SqlEditor
            {...editorProps}
            onChange={(q) => setQuery(q)}
            runButtonProps={{
              isLoading: executor.isPending,
              onPress: () => {
                executor.exec(
                  {
                    query,
                  },
                  {
                    onSuccess: (data) => {
                      setResults(data);
                    },
                    onError: (e) =>
                      addToast({
                        description: e.message,
                        color: "danger",
                      }),
                  },
                );
              },
            }}
            error={
              executor.error
                ? {
                    message: executor.error.message,
                  }
                : undefined
            }
          />
        </Panel>
        <PanelResizeHandle />
        <Panel defaultSize={25} minSize={15}>
          <QueryResult result={results} />
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default QueryStudio;
