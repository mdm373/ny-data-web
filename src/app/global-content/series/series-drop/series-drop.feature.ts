import { feature } from "@reactive-redux"
import { SeriesDropState } from "./series-drop.state"
import { initSeriesTypeEffects$ } from "./series-drop.effects"


export const seriesDropFeature = feature.create<SeriesDropState>({seriesTypes: [], selected: undefined}, [initSeriesTypeEffects$])
export const seriesDropChangedAction = seriesDropFeature.newAction()
