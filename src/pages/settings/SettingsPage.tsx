import useSWR, {useSWRConfig} from "swr";
import {useEffect, useState} from "react";

import {Link} from 'react-router-dom';
import {Button, Group, Stack, Title} from "@mantine/core";
import {MonthPickerInput} from "@mantine/dates";
import {notifications} from "@mantine/notifications";
import {TbArrowLeft, TbCheck, TbCopy, TbTrash} from "react-icons/tb";

import {getMonthDate} from "@/shared/utils";
import {usePersistedDate} from "@/shared/hooks";
import {ReviseListDTO, reviseObjectsUrl} from "@/entities/revise-object";
import {
    PaymentsSystem,
    createPaymentsSystem,
    deletePaymentsSystem,
    updatePaymentsSystem,
    mapPaymentsSystem,
    paymentSystemUrl,
    mapPaymentSystem,
} from "@/entities/payments-system";
import {SystemsList} from "@/widgets/system-list";
import {
    ObjectForm,
    ScoreboardFormValues,
    SystemsFormValues,
} from "@/widgets/object-form";
import {
    Scoreboard,
    mapScoreboard,
    scoreboardDetailUrl,
    updateScoreboard,
} from "@/entities/scoreboard";


export function SettingsPage() {
    const [date, setDate] = usePersistedDate();
    const [formTarget, setFormTarget] = useState<PaymentsSystem["id"] | "scoreboard" | "new" | null>(null);
    const {mutate} = useSWRConfig();
    const {
        data: systemsList,
        isLoading,
        error: listErr,
    } = useSWR<ReviseListDTO>(reviseObjectsUrl(date));
    const [systems, scId] = mapPaymentsSystem(systemsList);
    const {data: scoreboardRaw, error: scoreboardErr} = useSWR(
        scId ? scoreboardDetailUrl(scId) : null
    );
    const {data: systemDetail, error: detailErr} = useSWR(
        formTarget && formTarget !== "new" && formTarget !== "scoreboard"
            ? paymentSystemUrl(formTarget)
            : null
    );
    const targetSystem = systems.find((s) => s.id === formTarget);
    const system =
        targetSystem &&
        systemDetail &&
        mapPaymentSystem(targetSystem, systemDetail);
    const scoreboard = mapScoreboard(scoreboardRaw);

    const allSystems: (PaymentsSystem | Scoreboard)[] = [
        ...(scoreboard ? [scoreboard] : []),
        ...(systems || []),
    ];

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
    useEffect(() => {
        if (scoreboardErr || scoreboardRaw?.error) {
            notifications.show({
                id: "scoreboard-detail",
                title: "Табло",
                message:
                    scoreboardRaw?.error?.slice(0, 100) || "Что-то пошло не так...",
                color: "red",
                withCloseButton: true,
                autoClose: 10_000,
            });
        }
    }, [scoreboardRaw, scoreboardErr]);

    function onDateChange(date: Date) {
        setDate(date);
        setFormTarget(null);
    }

    function onSystemSelect(id: PaymentsSystem["id"] | "scoreboard") {
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
                message: "Платежная система успешно удалена!",
                icon: <TbTrash size={18}/>,
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

    async function submitSystem(values: SystemsFormValues) {
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
            res = await updatePaymentsSystem(formTarget as number, values);
        }
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
                message: isNew
                    ? "Платежная система успешно создана!"
                    : "Платежная система успешно изменена!",
                icon: <TbCheck size={18}/>,
                loading: false,
                withCloseButton: true,
                autoClose: 5_000,
            });
        }
    }

    async function submitScoreboard(values: ScoreboardFormValues) {
        const nId = notifications.show({
            loading: true,
            title: 'Редактирование объекта "Табло"',
            message: "Немного подождите",
            autoClose: false,
            withCloseButton: false,
        });
        const res = await updateScoreboard(scId!, values);
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
                message: "Табло успешно изменено!",
                icon: <TbCheck size={18}/>,
                loading: false,
                withCloseButton: true,
                autoClose: 5_000,
            });
        }

        mutate(scoreboardDetailUrl(scId!));
    }

    async function onFormSubmit(
        values: SystemsFormValues | ScoreboardFormValues
    ) {
        if (!formTarget) return;
        if (formTarget === "scoreboard") {
            submitScoreboard(values as ScoreboardFormValues);
        } else {
            submitSystem(values as SystemsFormValues);
        }

        mutate(reviseObjectsUrl(date));
        setFormTarget(null);
    }

    // TODO
    async function onDuplicate() {
        // if (systems.length) {
        //   notifications.show({
        //     color: "red",
        //     title: "Невозможно скопировать",
        //     message: "Удалите все текущие платежные системы",
        //     autoClose: 10_000,
        //   });
        //   return;
        // }
        setFormTarget(null);
        const nId = notifications.show({
            loading: true,
            title: "Копирование данных",
            message: "Немного подождите",
            autoClose: false,
            withCloseButton: false,
        });
        const res = await fetch(
            reviseObjectsUrl(new Date(new Date(date).setMonth(date.getMonth() - 1)))
        )
            .then((res) => res.json())
            .then((data: ReviseListDTO) =>
                Promise.all(
                    data?.result
                        .filter((obj) => obj.name !== "Табло")
                        .map((sys) => sys.id_ps)
                        .map((id) =>
                            fetch(`/api/ps/${id}/copy-to/${getMonthDate(date)}`, {
                                method: "POST",
                            })
                        ) || []
                )
            );
        console.log(res);

        // const res = await duplicatePaymentsSystems();
        // if (!res.ok) {
        //   let r: { error?: string } | undefined;
        //   try {
        //     r = await res.json();
        //   } catch (err) {
        //     console.error(err);
        //   } finally {
        //     notifications.update({
        //       id: nId,
        //       color: "red",
        //       message: r?.error || "Что-то пошло не так...",
        //       loading: false,
        //       withCloseButton: true,
        //       autoClose: 10_000,
        //     });
        //   }
        // } else {
        notifications.update({
            id: nId,
            color: "teal",
            message: "Платежные системы успешно скопированы!",
            icon: <TbCopy size={18}/>,
            loading: false,
            withCloseButton: true,
            autoClose: 5_000,
        });
        // }

        mutate(reviseObjectsUrl(date));
    }

    /*const navigate = useNavigate();*/

    return (
        <Group h="100%" grow>
            <Stack h="100%" pt="xs">
                <Group justify="space-between" pr="md" grow>
                    <Button
                        /*onClick={() => {
                            navigate('/home')
                        }}*/
                        w="min-content"
                        size="sm"
                        component={Link}
                        variant="subtle"
                        to={`/home?date=${getMonthDate(date)}`}
                        styles={{root: {flex: 0}, label: {gap: "0.5rem"}}}
                    >
                        <TbArrowLeft/>
                        Назад
                    </Button>
                    <Title order={2} fz="xl" style={{minWidth: "max-content"}}>
                        Настройки объектов сверки
                    </Title>
                    <MonthPickerInput
                        style={{flex: 0, minWidth: "max-content"}}
                        size="xs"
                        value={date}
                        onChange={(d) => onDateChange(d!)}
                    />
                </Group>
                <SystemsList
                    systems={allSystems}
                    isLoading={isLoading}
                    selected={formTarget !== "new" ? formTarget : null}
                    onSelect={onSystemSelect}
                    onDelete={onDeleteSystem}
                />
                <Group pr="md" mt="auto">
                    <Button
                        size="sm"
                        variant="light"
                        style={{flex: 2}}
                        onClick={onDuplicate}
                    >
                        Скопировать из прошлого месяца
                    </Button>
                    <Button size="sm" style={{flex: 1}} onClick={onCreateSystem}>
                        Создать
                    </Button>
                </Group>
            </Stack>
            <ObjectForm
                target={
                    !formTarget
                        ? null
                        : formTarget === "scoreboard"
                            ? scoreboard
                            : system || "new"
                }
                onCancel={onFormCancel}
                onSubmit={onFormSubmit}
            />
        </Group>
    );
}
