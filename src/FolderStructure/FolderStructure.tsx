import {
  FileProps,
  FileType,
  FolderProps,
  FolderStructureProps,
  FolderType,
} from "./FolderStructure.types";
import Indentation from "./Indentation/Indentation";

const isFolder = (node: FolderType | FileType): node is FolderType => {
  return "children" in node;
};

const File = ({ name, level = 0 }: FileProps) => {
  return (
    <li>
      <Indentation level={level} />
      {name}
    </li>
  );
};

const FolderTitle = ({ name }: { name: string }) => {
  return (
    <div className="font-bold bg-slate-300 w-full px-4 py-2 rounded-t-md">
      {name}
    </div>
  );
};

const Folder = ({ folder, level }: FolderProps) => {
  return (
    <li>
      <Indentation level={level} />
      <span className="font-medium">{folder.name}</span>
      <ul>
        {folder.children.map((child) => {
          return isFolder(child) ? (
            <Folder folder={child} level={level + 1} />
          ) : (
            <File name={child.name} level={level + 1} />
          );
        })}
      </ul>
    </li>
  );
};

export const FolderStructure = ({ data }: FolderStructureProps) => {
  return (
    <div className="bg-slate-200 text-slate-950 text-sm mx-auto max-w-2xl my-8 rounded-md">
      <FolderTitle name={data.name} />
      <ul className="px-4 py-2">
        {data.children.map((child) => {
          return isFolder(child) ? (
            <Folder folder={child} level={0} />
          ) : (
            <File name={child.name} level={0} />
          );
        })}
      </ul>
    </div>
  );
};