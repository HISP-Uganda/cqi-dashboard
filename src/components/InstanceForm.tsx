import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    SimpleGrid,
    Spacer,
    Stack,
    Textarea,
} from "@chakra-ui/react";
import { useDataEngine } from "@dhis2/app-runtime";
import { useNavigate, useSearch } from "@tanstack/react-location";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DatePicker } from "antd";
import { GroupBase, Select } from "chakra-react-select";
import { Dayjs } from "dayjs";
import { useStore } from "effector-react";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { addIndicator, changeIndicatorGroup } from "../Events";
import {
    LocationGenerics,
    Option,
    ProjectField,
    QIProject,
} from "../interfaces";
import { dashboards, indicatorForGroup } from "../Store";
import { generateUid } from "../utils/uid";
import NewIndicator from "./NewIndicator";
export default function InstanceForm({
    programTrackedEntityAttributes,
    instance,
}: {
    programTrackedEntityAttributes: any[];
    instance: Partial<QIProject>;
}) {
    const navigate = useNavigate<LocationGenerics>();
    const search = useSearch<LocationGenerics>();
    const store = useStore(dashboards);
    const indicators = useStore(indicatorForGroup);
    const queryClient = useQueryClient();
    const [modalVisible, setModalVisible] = useState(false);
    const [submitting, setSubmitting] = useState<boolean>(false);

    const engine = useDataEngine();
    const {
        control,
        handleSubmit,
        watch,
        setValue,
        getValues,
        formState: { errors },
    } = useForm<Partial<QIProject>>({ defaultValues: instance });

    const kHRn35W3Gq4 = watch("kHRn35W3Gq4");
    const TG1QzFgGTex = watch("TG1QzFgGTex");

    const onSubmit: SubmitHandler<Partial<QIProject>> = async (data) => {
        setSubmitting(() => true);
        const columns: string[] = [
            "y3hJLGjctPk",
            "iInAQ40vDGZ",
            "WQcY6nfPouv",
            "pIl8z4w8msL",
            "EvGGaaviqOn",
            "WEudJ6nxlzz",
            "TG1QzFgGTex",
            "kHRn35W3Gq4",
            "VWxBILfLC9s",
            "eCbusIaigyj",
            "rFSjQbZjJwF",
            "AETf2xvUmc8",
        ];
        let attributes = Object.entries(data).reduce(
            (a: any, [k, v]) =>
                columns.findIndex((c: string) => c === k) > -1
                    ? ((a[k] = v), a)
                    : a,
            {}
        );
        attributes = Object.entries(attributes).map(([attribute, value]) => {
            return { attribute, value };
        });

        let trackedEntityInstance: { [key: string]: any } = {
            attributes,
            orgUnit: search.ou,
            trackedEntityType: search.trackedEntityType,
            trackedEntityInstance: search.trackedEntityInstance,
        };

        if (search.isNew) {
            trackedEntityInstance = {
                ...trackedEntityInstance,
                enrollments: [
                    {
                        enrollmentDate: new Date().toISOString().slice(0, 10),
                        incidentDate: new Date().toISOString().slice(0, 10),
                        program: search.program,
                        orgUnit: search.ou,
                        trackedEntityInstance: search.trackedEntityInstance,
                    },
                ],
            };
        }
        await mutateAsync(trackedEntityInstance);
        setSubmitting(() => false);
        navigate({
            to: "/data-entry",
            search: (prev) => {
                return {
                    ou: search.ou,
                    program: search.program,
                    trackedEntityType: search.trackedEntityType,
                    page: 1,
                    pageSize: 10,
                    ouMode: "DESCENDANTS",
                };
            },
            replace: true,
        });
    };

    const addEvent = async (data: any) => {
        const mutation: any = {
            type: "create",
            resource: "events",
            data,
        };
        return await engine.mutate(mutation);
    };

    const addTrackedEntityInstance = async (data: any) => {
        const mutation: any = {
            type: "create",
            resource: "trackedEntityInstances",
            data,
        };
        return await engine.mutate(mutation);
    };

    const { mutateAsync } = useMutation(addTrackedEntityInstance);

    const { mutateAsync: insertEvent } = useMutation(addEvent, {
        onSuccess: async (data, variables) => {
            await queryClient.invalidateQueries(["userUnits"]);
            const grp = variables.dataValues.find(
                (dv: any) => dv.dataElement === "kuVtv8R9n8q"
            );
            changeIndicatorGroup(grp.value);
        },
    });

    const [fields, setFields] = useState<ProjectField[]>(() =>
        programTrackedEntityAttributes.map((pTea: any) => {
            const {
                mandatory,
                trackedEntityAttribute: {
                    optionSetValue,
                    optionSet,
                    generated,
                    name,
                    id,
                },
                valueType,
            } = pTea;

            let field: ProjectField = {
                id,
                name,
                mandatory,
                valueType,
                optionSetValue,
                options: optionSetValue
                    ? optionSet.options.map((o: any) => ({
                          value: o.code,
                          label: o.name,
                      }))
                    : null,
            };

            if (id === "kHRn35W3Gq4") {
                return { ...field, options: indicators, optionSetValue: true };
            }
            return field;
        })
    );

    const onInsert = async (values: any) => {
        const eventId = generateUid();
        const event = {
            event: eventId,
            program: "eQf9K4L2yxE",
            orgUnit: search.ou,
            eventDate: new Date().toISOString(),
            dataValues: [
                {
                    dataElement: "kToJ1rk0fwY",
                    value: values.name,
                },
                {
                    dataElement: "kuVtv8R9n8q",
                    value: getValues("TG1QzFgGTex"),
                },
                {
                    dataElement: "WI6Qp8gcZFX",
                    value: values.numerator,
                },
                {
                    dataElement: "krwzUepGwj7",
                    value: values.denominator,
                },
            ],
        };
        await insertEvent(event);

        setFields((prev) => {
            return prev.map((p) => {
                if (p.id === "kHRn35W3Gq4") {
                    return {
                        ...p,
                        options: [
                            { value: eventId, label: values.name },
                            ...indicators.map((row: any) => ({
                                value: row.event,
                                label: row.kToJ1rk0fwY,
                            })),
                        ],
                    };
                }
                return p;
            });
        });

        setValue("kHRn35W3Gq4", eventId);
        addIndicator([eventId, values.name]);
    };

    const getField = (f: ProjectField) => {
        const Opts: any = {
            DATE: (
                <Controller
                    control={control}
                    name={f.id}
                    render={({ field }) => (
                        <DatePicker
                            name={field.name}
                            value={field.value as unknown as Dayjs}
                            onChange={(e) => {
                                field.onChange(e);
                            }}
                        />
                    )}
                    rules={{
                        required: {
                            value: f.mandatory,
                            message: `${f.name} is required`,
                        },
                    }}
                />
            ),
            DATETIME: (
                <Controller
                    control={control}
                    name={f.id}
                    render={({ field }) => (
                        <DatePicker
                            name={field.name}
                            value={field.value as unknown as Dayjs}
                            onChange={(e) => {
                                field.onChange(e);
                            }}
                        />
                    )}
                    rules={{
                        required: {
                            value: f.mandatory,
                            message: `${f.name} is required`,
                        },
                    }}
                />
            ),
            LONG_TEXT: (
                <Controller
                    control={control}
                    name={f.id}
                    render={({ field }) => <Textarea {...field} />}
                    rules={{
                        required: {
                            value: f.mandatory,
                            message: `${f.name} is required`,
                        },
                    }}
                />
            ),
            TRUE_ONLY: (
                <Controller
                    control={control}
                    name={f.id}
                    render={({ field }) => (
                        <Checkbox
                            isChecked={String(field.value) === "true"}
                            onChange={(e) => field.onChange(e.target.checked)}
                        />
                    )}
                    rules={{
                        required: {
                            value: f.mandatory,
                            message: `${f.name} is required`,
                        },
                    }}
                />
            ),
        };
        if (f.optionSetValue) {
            return (
                <Controller
                    control={control}
                    name={f.id}
                    render={({ field }) => {
                        let currentVal: Option | undefined;
                        const val: any = f.options?.find(
                            (pt) => pt[0] === field.value
                        );
                        if (val) {
                            currentVal = { label: val[1], value: val[0] };
                        }
                        return (
                            <Select<Option, false, GroupBase<Option>>
                                value={currentVal}
                                isClearable
                                onChange={(e) => {
                                    field.onChange(e?.value || "");
                                    if (f.id === "TG1QzFgGTex") {
                                        setValue("kHRn35W3Gq4", undefined);
                                        changeIndicatorGroup(e?.value || "");
                                        const indicators = store.indicators
                                            .filter(
                                                (row: any) =>
                                                    row.kuVtv8R9n8q === e?.value
                                            )
                                            .map((row: any) => ({
                                                value: row.event,
                                                label: row.kToJ1rk0fwY,
                                            }));
                                        setFields((prev) =>
                                            prev.map((p) => {
                                                if (p.id === "kHRn35W3Gq4") {
                                                    return {
                                                        ...p,
                                                        options: [
                                                            ...indicators,
                                                            {
                                                                value: "add",
                                                                label: "Add new indicator",
                                                            },
                                                        ],
                                                    };
                                                }
                                                return p;
                                            })
                                        );
                                    }
                                }}
                                options={f.options as Array<Option>}
                                // size="sm"
                            />
                        );
                    }}
                    rules={{
                        required: {
                            value: f.mandatory,
                            message: `${f.name} is required`,
                        },
                    }}
                />
            );
        }

        return (
            Opts[f.valueType] || (
                <Controller
                    control={control}
                    name={f.id}
                    render={({ field }) => <Input {...field} />}
                    rules={{
                        required: {
                            value: f.mandatory,
                            message: `${f.name} is required`,
                        },
                    }}
                />
            )
        );
    };

    useEffect(() => {
        const subscription = watch((value, { name, type }) => {});
        return () => subscription.unsubscribe();
    }, [watch]);

    useEffect(() => {
        if (kHRn35W3Gq4 === "add") {
            setModalVisible(() => true);
        }
    }, [kHRn35W3Gq4]);

    return (
        <Stack bg="white" p="10px">
            <form onSubmit={handleSubmit(onSubmit)}>
                <SimpleGrid spacing="30px" columns={3} mb="30px">
                    {fields.map((field) => {
                        return (
                            <FormControl
                                isInvalid={!!errors[field.id]}
                                key={field.id}
                            >
                                <FormLabel htmlFor={field.id}>
                                    {field.name}
                                </FormLabel>
                                {getField(field)}
                                <FormErrorMessage>
                                    {errors[field.id]?.message}
                                </FormErrorMessage>
                            </FormControl>
                        );
                    })}
                </SimpleGrid>
                <NewIndicator
                    onInsert={onInsert}
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                />
                <Stack direction="row">
                    <Button
                        type="button"
                        colorScheme="red"
                        onClick={() =>
                            navigate({
                                to: "/data-entry",
                                search: (prev) => {
                                    return {
                                        ou: search.ou,
                                        program: search.program,
                                        trackedEntityType:
                                            search.trackedEntityType,
                                        page: 1,
                                        pageSize: 10,
                                        ouMode: "DESCENDANTS",
                                        "ou-name": search["ou-name"],
                                    };
                                },
                                replace: true,
                            })
                        }
                    >
                        Cancel
                    </Button>
                    <Spacer />
                    <Button
                        type="submit"
                        colorScheme="green"
                        isLoading={submitting}
                    >
                        Save Project
                    </Button>
                    <Stack direction="row">
                        <Box></Box>
                        <Box></Box>
                    </Stack>
                </Stack>
            </form>
        </Stack>
    );
}
