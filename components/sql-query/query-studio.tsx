"use client";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import DataExplorer from "@/components/sql-query/data-explorer";
import QueryResult from "@/components/sql-query/query-result";
import SqlEditor, {
  type SqlEditorProps,
} from "@/components/sql-query/sql-editor";
import { useMutation } from "@tanstack/react-query";
import { client } from "@/lib/api.sdk";
import { makeMutationFn } from "@/utils/tanstack";
import { useState } from "react";

const useQueryExecutor = () => {
  const fn = makeMutationFn(client.queries.exec);
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

  // TODO: add error boundary

  return (
    <div className="m-4 h-[calc(100dvh-6.5rem)]">
      <PanelGroup className="h-full gap-2" direction="horizontal">
        <Panel minSize={20} defaultSize={25}>
          <DataExplorer />
        </Panel>
        <PanelResizeHandle />
        <Panel className="h-full" defaultSize={75} minSize={50}>
          <PanelGroup className="h-full gap-2" direction="vertical">
            <Panel defaultSize={75} minSize={25}>
              <SqlEditor
                {...editorProps}
                onChange={(q) => setQuery(q)}
                runButtonProps={{
                  isLoading: executor.isPending,
                  onPress: () =>
                    executor.exec(query, {
                      onSuccess: console.log,
                      onError: console.error,
                    }),
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
              <QueryResult />
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default QueryStudio;
