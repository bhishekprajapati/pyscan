"use client";

import { sql } from "@codemirror/lang-sql";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import { Button, ButtonProps, Chip, Divider, Tooltip } from "@heroui/react";
import { Switch } from "@heroui/switch";
import { draculaDarkStyle } from "@uiw/codemirror-theme-dracula";
import { createTheme } from "@uiw/codemirror-themes";
import CodeMirror, { BasicSetupOptions } from "@uiw/react-codemirror";
import {
  AlertTriangle,
  CircleAlert,
  LetterText,
  Settings,
  Terminal,
  UnfoldVertical,
} from "lucide-react";
import { useCallback, useState } from "react";

import { Card } from "../card";
import CopyButton from "../copy-button";

const dark = createTheme({
  theme: "dark",
  settings: {
    background: "transparent",
    fontFamily: "var(--font-mono)",
    gutterBackground: "#f7ffe610",
    gutterActiveForeground: "#AAFF00",
    selection: "#AAFF0015",
    lineHighlight: "#f7ffe625",
    caret: "#AAFF00",
  },
  styles: draculaDarkStyle,
});

const QueryError = ({ message }: { message: string }) => (
  <div className="flex items-center gap-4 bg-danger-50/50 p-4">
    <AlertTriangle size={20} className="flex-shrink-0 text-danger" />
    <p className="line-clamp-2 text-danger">{message}</p>
    <CopyButton
      className="ms-auto"
      text={message}
      tooltipText="Copy error"
      color="default"
    />
  </div>
);

type CharBalanceProps = {
  max: number;
  current: number;
};

const CharBalance = ({ max, current }: CharBalanceProps) => (
  <Chip
    className="rounded-lg border-current text-primary-50/25"
    variant="light"
  >
    {current} / {max}
  </Chip>
);

export type SqlEditorProps = {
  config?: {
    query?: {
      maxLength: number;
    };
  };
  defaultValue?: string;
  error?: {
    message: string;
  };
  runButtonProps?: ButtonProps;
  onChange?: (value: string) => void;
};

const SqlEditor: React.FC<SqlEditorProps> = (props) => {
  const {
    config = {},
    defaultValue = "",
    onChange,
    error,
    runButtonProps = {},
  } = props;
  const { maxLength } = config.query ?? {};

  const [basicSetup, setBasicSetup] = useState<BasicSetupOptions>({
    autocompletion: true,
  });

  const [sqlQuery, setSqlQuery] = useState(defaultValue);
  const isWithinCharLimit = maxLength ? sqlQuery.length <= maxLength : true;
  const canRunQuery = sqlQuery !== "" && isWithinCharLimit;

  const handleChange = useCallback(
    (val: string) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      onChange && onChange(val);
      setSqlQuery(val);
    },
    [onChange],
  );

  return (
    <Card className="h-full flex-col">
      <div className="flex items-center gap-2 p-4">
        <Tooltip content="Expand">
          <Button variant="faded" isIconOnly isDisabled>
            <UnfoldVertical size={16} />
          </Button>
        </Tooltip>
        <Popover placement="top" showArrow={false}>
          <PopoverTrigger>
            <Button variant="faded" isIconOnly>
              <Settings size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="bg-default-50 p-2">
            <ul className="[&>*]:flex [&>*]:items-center [&>*]:gap-2">
              <li>
                <span>Auto Complete</span>
                <span>
                  <Switch
                    isSelected={basicSetup["autocompletion"]}
                    onValueChange={(b) =>
                      setBasicSetup((s) => ({ ...s, autocompletion: b }))
                    }
                    color="default"
                    size="sm"
                  />
                </span>
              </li>
            </ul>
          </PopoverContent>
        </Popover>
        <Tooltip content="Format Query">
          <Button variant="faded" isIconOnly isDisabled>
            <LetterText size={16} />
          </Button>
        </Tooltip>
        <CopyButton tooltipText="Copy Query" text={sqlQuery} variant="faded" />
        <span className="ms-auto" />
        {!isWithinCharLimit && (
          <Tooltip
            className="w-32 p-2"
            content={`Max ${maxLength} chars are allowed in a single query`}
          >
            <span className="text-warning">
              <CircleAlert size={16} />
            </span>
          </Tooltip>
        )}
        {maxLength && <CharBalance max={maxLength} current={sqlQuery.length} />}
        <Button
          {...runButtonProps}
          variant="faded"
          className="bg-primary-100/10 !text-foreground"
          isDisabled={!canRunQuery}
        >
          <Terminal size={16} />
          Run
        </Button>
      </div>
      <Divider />
      <div className="flex-1">
        <CodeMirror
          defaultValue={defaultValue}
          extensions={[sql()]}
          theme={dark}
          height="100%"
          onChange={handleChange}
          basicSetup={basicSetup}
          className="text-lg"
        />
      </div>
      {error && <QueryError message={error.message} />}
    </Card>
  );
};

export default SqlEditor;
