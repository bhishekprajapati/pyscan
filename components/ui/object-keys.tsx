import { Tooltip } from "@heroui/react";
import { CircleHelp } from "lucide-react";

type Entry<T> = {
  label: string;
  helpText: string;
  renderValue: (data: Readonly<T>) => React.ReactNode;
  shouldRender?: (data: Readonly<T>) => boolean;
};

type ObjectKeysProps<TData> = {
  data: TData;
  entries: Entry<TData>[];
};

function ObjectKeys<T>(props: ObjectKeysProps<T>) {
  const { data, entries } = props;
  return (
    <ul className="rounded-2xl bg-default p-4 [&>*:not(:last-child)]:mb-4">
      {entries.map(
        ({ label, helpText, renderValue, shouldRender = () => true }) =>
          shouldRender(data) && (
            <li key={label} className="grid grid-cols-[1fr_4fr]">
              <div>
                <Tooltip content={helpText} className="max-w-56 p-4">
                  <CircleHelp
                    size={16}
                    className="me-2 inline-block dark:text-gray-500"
                  />
                </Tooltip>
                <span className="align-middle">{label}</span>
              </div>
              <div>{renderValue(data)}</div>
            </li>
          ),
      )}
    </ul>
  );
}

export default ObjectKeys;
