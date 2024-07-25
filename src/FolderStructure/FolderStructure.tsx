import {
  FileType,
  FolderProps,
  FolderStructureProps,
  FolderType,
} from "./FolderStructure.types";
import { Folder as FolderIcon } from "lucide-react";
import { cn } from "../utils/cn";

const isFolder = (node: FolderType | FileType): node is FolderType => {
  return "children" in node;
};

const Folder = ({ folder, indent, open, trailingSlash }: FolderProps) => {
  return (
    <details
      open={open}
      className={cn(
        "group py-[2px] relative before:content-[''] before:absolute before:top-6 before:bottom-1 before:left-7 before:w-px before:bg-slate-700",
        {
          "[&_details]:ml-8": indent !== "normal",
          "[&_details]:ml-10": indent === "normal",
        }
      )}
    >
      <summary className="list-none before:content-['\25BC'] before:inline-block before:mr-1 before:w-3 before:mx-1 cursor-pointer focus-visible:outline-blue-600">
        <span className="mt-[2px] font-bold inline-flex gap-1 items-center cursor-pointer hover:text-blue-600">
          <FolderIcon className="size-4" />
          <span>
            {folder.name}
            {trailingSlash && <span aria-hidden>/</span>}
          </span>
        </span>
      </summary>
      <div>
        {folder.children.map((child) => {
          return isFolder(child) ? (
            <Folder
              folder={child}
              key={child.name}
              open={open}
              indent={indent}
              trailingSlash={trailingSlash}
            />
          ) : (
            <div key={child.name} className="ml-9">
              {child.name}
            </div>
          );
        })}
      </div>
    </details>
  );
};

export const FolderStructure = ({
  className,
  data,
  indent = "normal",
  open = true,
  trailingSlash = false,
  ...rest
}: FolderStructureProps) => {
  return (
    <div
      className={cn(
        "text-sm mx-auto max-w-2xl my-8 text-slate-700 bg-slate-50 border border-slate-300 rounded-md",
        className
      )}
      {...rest}
    >
      <div className="p-4">
        {data?.map((child) => {
          return isFolder(child) ? (
            <Folder
              key={child.name}
              folder={child}
              indent={indent}
              open={open}
              trailingSlash={trailingSlash}
            />
          ) : (
            <div key={child.name}>{child.name}</div>
          );
        })}
      </div>
    </div>
  );
};
