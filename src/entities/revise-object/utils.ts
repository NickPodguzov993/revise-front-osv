import { FileStatus } from "./model";

export function getFileStatusTitle(status: FileStatus) {
  switch (status) {
    case FileStatus.Empty:
      return "Не загружено";
    case FileStatus.Uploaded:
      return "Загружено";
    // case "error":
    //   return "Ошибка";
    default:
      return "Неизвестно";
  }
}
