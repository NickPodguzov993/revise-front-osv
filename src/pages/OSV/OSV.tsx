import useSWR from "swr";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Group, Stack } from "@mantine/core";
import { MonthPickerInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { getMonthDate } from "@/shared/utils";
import { usePersistedDate } from "@/shared/hooks";
import {
  reviseObjectsUrl,
  mapReviseObjects,
  ReviseListDTO,
} from "@/entities/revise-object";
import { OverviewTable } from "@/widgets/overview-table";

import styles from "./home.module.css";

export function OSV() {
  const [date, setDate] = usePersistedDate();
  const { data, error, isLoading} = useSWR<ReviseListDTO>(
    reviseObjectsUrl(date)
  );
  const navigate = useNavigate();
  const reviseObjects = mapReviseObjects(data);


  useEffect(() => {

    if (error?.code === 500) {
      navigate('/');
    }
    (error || data?.error) &&
      notifications.show({
        id: "revise-list",
        title: "Объекты сверки",
        message: data?.error?.slice(0, 100) || "Что-то пошло не так...",
        color: "red",
        withCloseButton: true,
        autoClose: 10_000,
      });
  }, [data, error]);

  return (
    <Stack className={styles.container} gap="lg">
      <Group justify="space-between" align="end">
        <MonthPickerInput
          className={styles.datePicker}
          size="md"
          label="Месяц сверки"
          value={date}
          onChange={(d) => setDate(d!)}
        />
        <Button
          variant="light"
          size="md"
          component={Link}
          to={''}
          onClick={()=>{}}
        >
          +
        </Button>
      </Group>
      <OverviewTable data={reviseObjects} loading={isLoading} />
      <Group justify="end">
        <Button
          size="md"
          component={Link}
          to={`/summary/${getMonthDate(date)}`}
        >
          Рассчитать
        </Button>
      </Group>
    </Stack>
  );
}
