import useSWR from "swr";
import { Link, useParams } from "react-router-dom";
import { Button, Group, Stack, Text } from "@mantine/core";
import { TbArrowLeft, TbChevronLeft, TbChevronRight } from "react-icons/tb";
// import { faker } from "@faker-js/faker"; // TODO: move to msw

import { getMonthDate } from "@/shared/utils";
import { summaryUrl } from "@/entities/summary";
import { SummaryTable } from "@/widgets/summary-table";
import { SummaryDTO } from "@/entities/summary/dto";
import { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";

// TODO: move to msw
// function makeData(length: number, date: Date): SummaryRow[] {
//   faker.seed(date.getTime());
//   return new Array(length).fill(null).map((_, idx) => {
//     return {
//       id: idx,
//       idField: faker.string.uuid(),
//       opType: ["withdraw", "deposit"][faker.number.int({ min: 0, max: 1 })],
//       project: faker.science.chemicalElement().name,
//       date: faker.date
//         .between({
//           from: date,
//           to: new Date(date).setMonth(date.getMonth() + 1),
//         })
//         .toLocaleDateString(),
//       amount: Number(faker.finance.amount()),
//       currency: ["RUB", "USD"][faker.number.int({ min: 0, max: 1 })],
//     };
//   });
// }

export function SummaryPage() {
  const params = useParams();
  const date = new Date(params.date!);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const { data, error, isLoading } = useSWR<SummaryDTO>(summaryUrl(date, page));

  useEffect(() => {
    data && setTotal(data.result?.total || 0);
    if (error || data?.error) {
      notifications.show({
        id: "summary-list",
        title: "Результат сверки",
        message: data?.error?.slice(0, 100) || "Что-то пошло не так...",
        color: "red",
        withCloseButton: true,
        autoClose: 10_000,
      });
    }
  }, [data, error]);

  return (
    <Stack h="100%" pb="md" justify="space-between">
      <SummaryTable loading={isLoading} data={data?.result?.data || []} />
      <Group justify="space-between">
        <Button
          variant="light"
          size="md"
          styles={{ label: { gap: "0.5rem" } }}
          component={Link}
          to={`/home?date=${getMonthDate(date)}`}
        >
          <TbArrowLeft />
          Назад
        </Button>
        <Group>
          <Button
            p="sm"
            size="md"
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 0}
          >
            <TbChevronLeft />
          </Button>
          <Text c="dimmed">
            {!total ? 0 : page + 1} из {total} страниц
          </Text>
          <Button
            p="sm"
            size="md"
            onClick={() => setPage((p) => p + 1)}
            disabled={page + 1 >= total}
          >
            <TbChevronRight />
          </Button>
        </Group>
        <Button
          component="a"
          size="md"
          disabled={isLoading}
          href={`/api/${getMonthDate(date)}/download`}
          target="_blank"
        >
          Скачать отчет
        </Button>
      </Group>
    </Stack>
  );
}
