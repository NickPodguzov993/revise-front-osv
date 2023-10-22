import useSWR, { useSWRConfig } from "swr";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Group, Stack, Title } from "@mantine/core";
import { TbArrowLeft, TbCheck, TbCopy, TbTrash } from "react-icons/tb";

import { getMonthDate } from "@/shared/utils";
import { usePersistedDate } from "@/shared/hooks";
import { ReviseListDTO, reviseObjectsUrl } from "@/entities/revise-object";
import {
  PaymentsSystem,
  createPaymentsSystem,
  deletePaymentsSystem,
  updatePaymentsSystem,
  mapPaymentsSystem,
  paymentSystemUrl,
  mapPaymentSystem,
  duplicatePaymentsSystems,
} from "@/entities/payments-system";
import { SystemsList } from "@/widgets/system-list";
import { SystemForm, SystemsFormValues } from "@/widgets/system-form";
import { MonthPickerInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";

export function SettingsPage() {
  const [date, setDate] = usePersistedDate();
  const [formTarget, setFormTarget] = useState<
    PaymentsSystem["id"] | "new" | null
  >(null);
  const { mutate } = useSWRConfig();
  const {
    data: systemsList,
    isLoading,
    error: listErr,
  } = useSWR<ReviseListDTO>(reviseObjectsUrl(date));
  const systems = mapPaymentsSystem(systemsList);
  const { data: systemDetail, error: detailErr } = useSWR(
    formTarget && formTarget !== "new" ? paymentSystemUrl(formTarget) : null
  );
  const targetSystem = systems.find((s) => s.id === formTarget);
  const system =
    targetSystem &&
    systemDetail &&
    mapPaymentSystem(targetSystem, systemDetail);

  useEffect(() => {
    if (listErr || systemsList?.error) {
      notifications.show({
        id: "settings-list",
        title: "Платежные системы",
        message: systemsList?.error?.slice(0, 100) || "Что-то пошло не так...",
        color: "red",
        withCloseButton: true,
        autoClose: 10_000,
      });
    }
  }, [systemsList, listErr]);
  useEffect(() => {
    if (detailErr || systemDetail?.error) {
      notifications.show({
        id: "settings-detail",
        title: "Информация о объекте",
        message: systemDetail?.error?.slice(0, 100) || "Что-то пошло не так...",
        color: "red",
        withCloseButton: true,
        autoClose: 10_000,
      });
    }
  }, [systemDetail, detailErr]);

  function onDateChange(date: Date) {
    setDate(date);
    setFormTarget(null);
  }
  function onSystemSelect(id: PaymentsSystem["id"]) {
    setFormTarget(id);
  }
  function onCreateSystem() {
    setFormTarget("new");
  }
  function onFormCancel() {
    setFormTarget(null);
  }
  async function onDeleteSystem(id: number) {
    const nId = notifications.show({
      loading: true,
      title: "Удаление платежной системы",
      message: "Платежная система в процессе удаления",
      autoClose: false,
      withCloseButton: false,
    });
    const res = await deletePaymentsSystem(id);
    if (!res.ok) {
      const r = await res.json();
      notifications.update({
        id: nId,
        color: "red",
        message: r.error || "Что-то пошло не так...",
        loading: false,
        withCloseButton: true,
        autoClose: 10_000,
      });
    } else {
      notifications.update({
        id: nId,
        color: "teal",
        message: "Платежная система успешно удалена!",
        icon: <TbTrash size={18} />,
        loading: false,
        withCloseButton: true,
        autoClose: 5_000,
      });
    }

    if (formTarget === id) {
      setFormTarget(null);
    }
    mutate(reviseObjectsUrl(date));
  }
  async function onFormSubmit(values: SystemsFormValues) {
    if (!formTarget) return;
    const isNew = formTarget === "new";
    const nId = notifications.show({
      loading: true,
      title: isNew
        ? "Создание платежной системы"
        : "Изменение платежной системы",
      message: "Немного подождите",
      autoClose: false,
      withCloseButton: false,
    });
    let res: Response;
    if (formTarget === "new") {
      res = await createPaymentsSystem(date, values);
    } else {
      res = await updatePaymentsSystem(formTarget, values);
    }
    if (!res.ok) {
      const r = await res.json();
      notifications.update({
        id: nId,
        color: "red",
        message: r.error || "Что-то пошло не так...",
        loading: false,
        withCloseButton: true,
        autoClose: 10_000,
      });
    } else {
      notifications.update({
        id: nId,
        color: "teal",
        message: isNew
          ? "Платежная система успешно создана!"
          : "Платежная система успешно изменена!",
        icon: <TbCheck size={18} />,
        loading: false,
        withCloseButton: true,
        autoClose: 5_000,
      });
    }

    mutate(reviseObjectsUrl(date));
    setFormTarget(null);
  }
  async function onDuplicate() {
    if (systems.length) {
      notifications.show({
        color: "red",
        title: "Невозможно скопировать",
        message: "Удалите все текущие платежные системы",
        autoClose: 10_000,
      });
      return;
    }
    setFormTarget(null);
    const nId = notifications.show({
      loading: true,
      title: "Копирование данных",
      message: "Немного подождите",
      autoClose: false,
      withCloseButton: false,
    });

    const res = await duplicatePaymentsSystems();
    if (!res.ok) {
      const r = await res.json();
      notifications.update({
        id: nId,
        color: "red",
        message: r.error || "Что-то пошло не так...",
        loading: false,
        withCloseButton: true,
        autoClose: 10_000,
      });
    } else {
      notifications.update({
        id: nId,
        color: "teal",
        message: "Платежные системы успешно скопированы!",
        icon: <TbCopy size={18} />,
        loading: false,
        withCloseButton: true,
        autoClose: 5_000,
      });
    }

    mutate(reviseObjectsUrl(date));
  }

  return (
    <Group h="100%" grow>
      <Stack h="100%" pt="xs">
        <Group justify="space-between" pr="md" grow>
          <Button
            w="min-content"
            size="sm"
            variant="subtle"
            component={Link}
            to={`/?date=${getMonthDate(date)}`}
            styles={{ root: { flex: 0 }, label: { gap: "0.5rem" } }}
          >
            <TbArrowLeft />
            Назад
          </Button>
          <Title order={2} fz="xl" style={{ minWidth: "max-content" }}>
            Платежные системы
          </Title>
          <MonthPickerInput
            style={{ flex: 0, minWidth: "max-content" }}
            size="xs"
            value={date}
            onChange={(d) => onDateChange(d!)}
          />
        </Group>
        <SystemsList
          systems={systems || []}
          isLoading={isLoading}
          selected={formTarget !== "new" ? formTarget : null}
          onSelect={onSystemSelect}
          onDelete={onDeleteSystem}
        />
        <Group pr="md" mt="auto">
          <Button
            size="sm"
            variant="light"
            style={{ flex: 2 }}
            onClick={onDuplicate}
          >
            Скопировать из прошлого месяца
          </Button>
          <Button size="sm" style={{ flex: 1 }} onClick={onCreateSystem}>
            Создать
          </Button>
        </Group>
      </Stack>
      <SystemForm
        target={formTarget ? system || "new" : null}
        onCancel={onFormCancel}
        onSubmit={onFormSubmit}
      />
    </Group>
  );
}
