export interface NamedEntity {
  name: string;
}

/**
 * Represents a file in the folder structure.
 */
export interface FileType extends NamedEntity {}

/**
 * Represents a folder, which can contain files and/or other folders.
 */
export interface FolderType extends NamedEntity {
  children: ReadonlyArray<FileType | FolderType>;
}

export type Indent = 'normal' | 'small';

/**
 * Represents the root of the folder structure.
 */
export type FolderStructureType = ReadonlyArray<FileType | FolderType>;

export interface FileProps {
  name: string;
  level: number;
}

export interface FolderProps {
  folder: FolderType;
   /**
   * The amount of space to indent each level of the folder structure
   * @default "normal"
   */ 
  indent?: Indent;
  open: boolean;
  /**
   * Add a slash to the end of the folder name
   * @default false
  */
  trailingSlash?: boolean;
}

export interface FolderStructureProps
  extends React.ComponentPropsWithRef<"div"> {
  data: FolderStructureType;
  /**
   * The amount of space to indent each level of the folder structure
   * @default "normal"
   */ 
  indent?: Indent;
  /**
   * Whether the folder structure should be open by default
   * @default true
   */
  open?: boolean;
  /**
   * Add a slash to the end of the folder name
   * @default false
   */
  trailingSlash?: boolean;
}
