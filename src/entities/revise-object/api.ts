import { getMonthDate } from "@/shared/utils";
import { ReviseFile } from ".";

export function reviseObjectsUrl(date: Date) {
  // `/api/revise-object?date=${getMonthDate(date)}`;
  return `/api/${getMonthDate(date)}`;
}

export async function uploadReviseFile(
  fileId: ReviseFile["id"],
  file: ArrayBuffer,
  fileName: string
) {
  const data = new FormData();
  data.append("file", new Blob([file]), fileName);
  return fetch(`/api/file/add?id_file=${fileId}`, {
    method: "POST",
    body: data,
  });
}

export async function deleteReviseFile(fileId: ReviseFile["id"]) {
  return fetch(`/api/file/${fileId}`, {
    method: "DELETE",
  });
}

/*export async function login(username: string, password: string) {
  return fetch(`/api/user/token?username=${username}&password=${password}`, {
    method: "POST",
    headers: {
      accept: 'application/json',
    },
  });
}*/

export async function login(username: string, password: string) {
  return fetch(`/api/user/token`, {
    method: "POST",
    headers: {
      accept: "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({username, password})
  });
}

