import { feature } from "@reactive-redux"
import { SeriesType } from "@gen/nydata-api"


export type SeriesTypeImmutable = Readonly<SeriesType>

export type SeriesToolsState = Readonly<{
    seriesTypes: readonly SeriesTypeImmutable[],
    selected: SeriesType|undefined,
    startDate: Date|undefined,
    endDate: Date|undefined,
}>
export const seriesToolsFeature = feature.create<SeriesToolsState>({seriesTypes: [], selected: undefined, startDate: undefined, endDate: undefined})
export const seriesTypeChangeAction = seriesToolsFeature.newAction()
