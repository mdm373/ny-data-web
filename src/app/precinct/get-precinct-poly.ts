import {default as axios} from 'axios'
import { getAppConfig } from '../config/config'
import { decode } from '@mapbox/polyline'

type EncodedPrecinctBounds = Readonly<{
    id: number
    bound_id: string
    bounds: string
    centroid: string
    
}>
interface ImmutablePrecinctBounds {
    readonly areas: readonly google.maps.LatLng[][]
}
interface MutablePrecinctBounds {
    id: string,
    centroid: google.maps.LatLng,
    areas: google.maps.LatLng[][]
}

export type PrecinctBounds = Readonly<Omit<MutablePrecinctBounds, 'areas'>&ImmutablePrecinctBounds>

const decodeToLatLng = (encodedPath: string) => {
    return decode(encodedPath).map((cord): google.maps.LatLng => {
        const [lat, lng] = cord
        return {lat, lng}
    })  
}
export const getPrecinctPolys = async (): Promise<readonly PrecinctBounds[]> => {
    const config = getAppConfig()
    const response = await axios.get<ReadonlyArray<EncodedPrecinctBounds>>(`${config.apiDomain}/bounds/nypd-precincts`)
    return Object.values(response.data.reduce((agg, current) => {
        if(!agg[current.bound_id]) {
            agg[current.bound_id] = {
                id: current.bound_id,
                centroid: decodeToLatLng(current.centroid,)[0],
                areas: [],
            }
        }
        agg[current.bound_id].areas.push(decodeToLatLng(current.bounds))
        
        return agg
    }, {} as {[key: string]: MutablePrecinctBounds}))
}