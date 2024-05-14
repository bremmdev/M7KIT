import {
  IndentSize,
  FileType,
  FolderProps,
  FolderStructureProps,
  FolderType,
} from "./FolderStructure.types";
import { cn } from "../utils/cn";

const isFolder = (node: FolderType | FileType): node is FolderType => {
  return "children" in node;
};

const FolderTitle = ({ name }: { name: string }) => {
  return name ? (
    <div className="font-bold bg-slate-200 dark:bg-slate-900 w-full px-4 py-2 rounded-t-md">
      {name}
    </div>
  ) : null;
};

//returns a Folder or a <div> representing a file
const Node = ({
  child,
  level,
  indentSize,
}: {
  child: FolderType | FileType;
  level: number;
  indentSize: IndentSize;
}) => {
  return isFolder(child) ? (
    <Folder
      key={child.name}
      folder={child}
      level={level}
      indentSize={indentSize}
    />
  ) : (
    <div key={child.name}>{child.name}</div>
  );
};

const Folder = ({ folder, level, indentSize }: FolderProps) => {
  //a unit of margin is equal to 4px
  const marginUnit = indentSize * 4;

  return (
    <details open style={{ marginLeft: marginUnit * level }}>
      <summary>
        <span className="font-medium -translate-x-2">{folder.name}</span>
      </summary>
      <div>
        {folder.children.map((child) => {
          return isFolder(child) ? (
            <Folder
              folder={child}
              level={level + 1}
              indentSize={indentSize}
              key={child.name}
            />
          ) : (
            <div key={child.name} className="ml-4">
              {child.name}
            </div>
          );
        })}
      </div>
    </details>
  );
};

export const FolderStructure = ({
  data,
  indentSize = 2,
  className,
  ...rest
}: FolderStructureProps) => {
  return (
    <div
      className={cn(
        "bg-slate-50 dark:bg-slate-800 text-slate-950 dark:text-slate-200 text-sm mx-auto max-w-2xl my-8 rounded-md border border-slate-300",
        className
      )}
      {...rest}
    >
      <FolderTitle name={data.name} />
      <div className="px-4 py-2 rounded-b-md border-t border-t-slate-300">
        {data.children?.map((child) => (
          <Node
            key={child.name}
            child={child}
            level={0}
            indentSize={indentSize}
          />
        ))}
      </div>
    </div>
  );
};