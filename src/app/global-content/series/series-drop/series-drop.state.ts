import { SeriesTypeImmutable } from "@app/generated-immutable";

export type SeriesDropState = Readonly<{
    selected: SeriesTypeImmutable|undefined,
    seriesTypes: readonly SeriesTypeImmutable[]
}>