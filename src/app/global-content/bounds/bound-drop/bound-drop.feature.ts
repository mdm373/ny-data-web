import { feature } from "@reactive-redux"
import { BoundDropState } from "./bound-drop.state"
import { initBoundsEffect$ } from "./bound-drop.effects"


export const boundDropFeature = feature.create<BoundDropState>({boundTypes: [], selected: undefined}, [initBoundsEffect$])
export const boundDropChangedAction = boundDropFeature.newAction()
