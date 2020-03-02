import { SeriesApi } from "@gen/nydata-api"
import { getAppConfig } from "@app/config/config"
import { store } from "@reactive-redux"
import { Observable, from } from "rxjs"
import { switchMap, map } from "rxjs/operators"
import { seriesDropFeature } from "./series-drop.feature"
import { SeriesTypeImmutable } from "@app/generated-immutable"

const seriesApi = new SeriesApi({basePath: getAppConfig().apiDomain})

const getSeriesTypes = async (): Promise<readonly SeriesTypeImmutable[]> => {
    return (await seriesApi.listSeriesTypes()).items
}

export const seriesTypesInitActionType = Symbol()

export const initSeriesTypeEffects$: store.AppEffectBinding = {
    type: seriesTypesInitActionType,
    effect: (actions: Observable<store.AppAction>) => actions.pipe(
        switchMap(() => from(getSeriesTypes())),
        map(seriesTypes => seriesDropFeature.newUpdate({seriesTypes: seriesTypes}))
    ),
}