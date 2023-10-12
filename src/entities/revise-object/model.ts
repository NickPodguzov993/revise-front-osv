export enum FileStatus {
  Empty = "NONE",
  Uploaded = "OK",
}

export type ReviseFile = {
  id: number;
  status: FileStatus;
  message?: string;
};

export type ReviseObject = {
  id: number;
  name: string;
  files: ReviseFile[];
};
