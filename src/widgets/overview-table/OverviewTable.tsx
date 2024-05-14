import { useState } from "react";
import { useSWRConfig } from "swr";
import { Card, LoadingOverlay, ScrollArea, Table } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FileWithPath } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import { TbCheck, TbTrash } from "react-icons/tb";

import { usePersistedDate } from "@/shared/hooks";
import {
  ReviseFile,
  ReviseObject,
  deleteReviseFile,
  reviseObjectsUrl,
  uploadReviseFile,
} from "@/entities/revise-object";
import { ReviseUpload } from "@/features/revise-upload";

import styles from "./overview-table.module.css";
import { ObjectRow } from "./ObjectRow";

type OverviewTableProps = {
  data: ReviseObject[];
  loading: boolean;
};

export function OverviewTable({ data, loading }: OverviewTableProps) {
  const { mutate } = useSWRConfig();
  const [date] = usePersistedDate();
  const [opened, { open, close }] = useDisclosure(false);
  const [fileId, setFileId] = useState<ReviseFile["id"] | null>(null);

  function onUploadOpen(id: ReviseFile["id"]) {
    setFileId(id);
    open();
  }
  function onUploadClose() {
    setFileId(null);
    close();
  }
  async function onUpload(file: FileWithPath) {
    close();
    const nId = notifications.show({
      loading: true,
      title: "Загрузка объекта сверки",
      message: "Данные в процессе обработки",
      autoClose: false,
      withCloseButton: false,
    });
    const buffer = await file.arrayBuffer();
    const res = await uploadReviseFile(fileId!, buffer, file.name);

    if (!res.ok) {
      let r: { error?: string } | undefined;
      try {
        r = await res.json();
      } catch (err) {
        console.error(err);
      } finally {
        notifications.update({
          id: nId,
          color: "red",
          message: r?.error || "Что-то пошло не так...",
          loading: false,
          withCloseButton: true,
          autoClose: 10_000,
        });
      }
    } else {
      notifications.update({
        id: nId,
        color: "teal",
        message: "Данные успешно загружены!",
        icon: <TbCheck size={18} />,
        loading: false,
        withCloseButton: true,
        autoClose: 5_000,
      });
    }

    setFileId(null);
    mutate(reviseObjectsUrl(date));
  }
  async function onDelete(fileId: ReviseFile["id"]) {
    const nId = notifications.show({
      loading: true,
      title: "Удаление объекта сверки",
      message: "Данные в процессе удаления",
      autoClose: false,
      withCloseButton: false,
    });

    const res = await deleteReviseFile(fileId);
    if (!res.ok) {
      let r: { error?: string } | undefined;
      try {
        r = await res.json();
      } catch (err) {
        console.error(err);
      } finally {
        notifications.update({
          id: nId,
          color: "red",
          message: r?.error || "Что-то пошло не так...",
          loading: false,
          withCloseButton: true,
          autoClose: 10_000,
        });
      }
    } else {
      notifications.update({
        id: nId,
        color: "teal",
        message: "Данные успешно удалены!",
        icon: <TbTrash size={18} />,
        loading: false,
        withCloseButton: true,
        autoClose: 5_000,
      });
    }

    mutate(reviseObjectsUrl(date));
  }

  const rows = data.length ? (
    data.flatMap((obj) =>
      obj.files.map((_, idx) => (
        <ObjectRow
          key={`${obj.id}-${idx}`}
          obj={obj}
          fileIdx={idx}
          onUpload={onUploadOpen}
          onDelete={onDelete}
        />

      ))
    )
  ) : (
    <Table.Tr className={styles.noData}>
      <Table.Td colSpan={3}>Нет данных</Table.Td>
    </Table.Tr>
  );

  return (
    <>
      <Card className={styles.container} withBorder>
        <LoadingOverlay visible={loading} />
        <ScrollArea classNames={{ scrollbar: styles.scrollbar }}>
          <Table verticalSpacing="xs">
            <Table.Thead className={styles.header}>
              <Table.Tr>
                <Table.Th>Объект</Table.Th>
                <Table.Th w={{ sm: 240, md: 320, lg: 360 }}>Статус</Table.Th>
                <Table.Th miw={160} w={{ sm: 220, lg: 280 }}>
                  Действия
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </ScrollArea>
      </Card>
      <ReviseUpload
        fileId={fileId!}
        opened={opened}
        onSuccess={onUpload}
        onClose={onUploadClose}
      />
    </>
  );
}
