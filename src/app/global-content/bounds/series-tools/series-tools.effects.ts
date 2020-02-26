import { SeriesApi } from "@gen/nydata-api"
import { getAppConfig } from "@app/config/config"
import { store } from "@reactive-redux"
import { Observable, from } from "rxjs"
import { switchMap, map } from "rxjs/operators"
import { SeriesTypeImmutable, seriesToolsFeature } from "./series-tools.state"

const seriesApi = new SeriesApi({basePath: getAppConfig().apiDomain})

const getSeriesTypes = async (): Promise<readonly SeriesTypeImmutable[]> => {
    return (await seriesApi.listSeriesTypes()).items
}

export const seriesTypesInitAction = Symbol()

export const initSeriesTypesEffect$: store.AppEffectBinding = {
    type: seriesTypesInitAction,
    effect: (actions: Observable<store.AppAction>) => actions.pipe(
        switchMap(() => from(getSeriesTypes())),
        map(seriesTypes => seriesToolsFeature.newUpdate({seriesTypes}))
    ),
}