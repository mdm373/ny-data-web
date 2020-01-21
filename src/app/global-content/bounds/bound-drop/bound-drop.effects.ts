import { BoundsApi, BoundType } from "@gen/nydata-api"
import { getAppConfig } from "@app/config/config"
import { store } from "@reactive-redux"
import { Observable, from } from "rxjs"
import { switchMap, map } from "rxjs/operators"
import { boundDropFeature } from "./bound-drop.feature"

const boundsApi = new BoundsApi({basePath: getAppConfig().apiDomain})

export type BoundTypeImmutable = Readonly<BoundType>

const getBoundsTypes = async (): Promise<readonly BoundTypeImmutable[]> => {
    return (await boundsApi.listBoundsTypes()).items
}

export const boundDropInitActionType = Symbol()
export const initBoundsEffect$: store.AppEffectBinding = {
    type: boundDropInitActionType,
    effect: (actions: Observable<store.AppAction>) => actions.pipe(
        switchMap(() => from(getBoundsTypes())),
        map(boundTypes => boundDropFeature.newUpdate({boundTypes}))
    ),
}