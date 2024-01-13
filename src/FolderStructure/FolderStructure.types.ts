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

export interface FolderProps {
  folder: FolderType;
  level: number;
}

export interface FolderStructureProps {
  data: FolderStructureType;
}
