import { Button, Divider } from "@heroui/react";
import { LogsJsonView } from "../json-view";
import { Card, CardBody, CardHeader, CardHeading } from "../ui/card";
import { Download } from "lucide-react";

export const DownloadJSONButton = ({
  data,
  filename = "result.json",
}: {
  data: unknown;
  filename?: string;
}) => {
  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button onPress={handleDownload} variant="flat" isIconOnly>
      <Download className="h-4 w-4" />
    </Button>
  );
};

const QueryResult = ({ result }: { result?: unknown[] }) => (
  <Card className="h-full">
    <CardHeader>
      <CardHeading>Query Results</CardHeading>
      {result && <DownloadJSONButton data={result} />}
    </CardHeader>
    <Divider />
    <CardBody>{result && <LogsJsonView value={result} />}</CardBody>
  </Card>
);

export default QueryResult;
