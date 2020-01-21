import {feature} from "@reactive-redux"

export type AppMapState = Readonly<{
  map: google.maps.Map|undefined
  polys: readonly google.maps.Polygon[];
  mapId: string,
}>

export const appMapFeature = feature.create<AppMapState>({mapId: 'appMapEle', map:undefined, polys: []})
