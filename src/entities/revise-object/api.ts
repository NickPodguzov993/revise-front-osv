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

export async function login(username: string, password: string) {
  return fetch(`/api/user/token`, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
  //  mode: "cors", // no-cors, *cors, same-origin
 //   cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
  //  credentials: "same-origin", // include, *same-origin, omit
    headers: {
      accept: "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
  //  redirect: "follow", // manual, *follow, error
   // referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify({username, password}), // body data type must match "Content-Type" header
  });
}

