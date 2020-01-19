import {newFeature} from "@redux/store"

export type AppMapState = Readonly<{
  map: google.maps.Map|undefined
  polys: readonly google.maps.Polygon[];
}>

export const appMapFeature = newFeature<AppMapState>({map:undefined, polys: []})
