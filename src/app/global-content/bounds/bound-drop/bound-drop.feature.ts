import { newFeature } from "@redux/store"
import { BoundDropState } from "./bound-drop.state"
import { initBoundsEffect$ } from "./bound-drop.effects"


export const boundDropFeature = newFeature<BoundDropState>({boundTypes: [], selected: undefined}, [initBoundsEffect$])
export const boundDropChangedAction = boundDropFeature.newAction()
