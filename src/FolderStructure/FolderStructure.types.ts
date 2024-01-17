export interface NamedEntity {
  name: string;
}

export interface FileType extends NamedEntity {}

export interface FolderType extends NamedEntity {
  children: ReadonlyArray<FileType | FolderType>;
}

export interface FolderStructureType extends FolderType {}

export interface FileProps {
  name: string;
  level: number;
}

export type IndentSize = 2 | 3 | 4;

export interface FolderProps {
  folder: FolderType;
  level: number;
  /**
   * The amount of space to indent each level of the folder structure,
   * each unit represents 1 Tailwind CSS space unit (4px)
   * @default 2
   */
  indentSize: IndentSize;
}

export interface FolderStructureProps extends React.ComponentPropsWithRef<"div"> {
  data: FolderStructureType;
  /**
   * The amount of space to indent each level of the folder structure,
   * each unit represents 1 Tailwind CSS space unit (4px)
   * @default 2
   */
  indentSize?: IndentSize;
}
