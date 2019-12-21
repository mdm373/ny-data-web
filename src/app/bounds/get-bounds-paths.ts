import {default as axios} from 'axios'
import { getAppConfig } from '../config/config'
import { decode } from '@mapbox/polyline'

type EncodedBounds = Readonly<{
    id: number
    bound_id: string
    bounds: string
    centroid: string
    
}>
interface ImmutableBounds {
    readonly areas: readonly google.maps.LatLng[][]
}
interface MutableBounds {
    id: string,
    centroid: google.maps.LatLng,
    areas: google.maps.LatLng[][]
}

export type Bounds = Readonly<Omit<MutableBounds, 'areas'>&ImmutableBounds>

const decodeToLatLng = (encodedPath: string) => {
    return decode(encodedPath).map((cord): google.maps.LatLng => {
        const [lat, lng] = cord
        return {lat, lng}
    })  
}

export type BoundsType = Readonly<{
    displayName: string,
    typeName: string
}>
const config = getAppConfig()

export const getBoundsTypes = async (): Promise<readonly BoundsType[]> => {
    return (await axios.get<readonly BoundsType[]>(`${config.apiDomain}/bounds/types/`)).data
}
export const getBoundsPaths = async (boundsType: string): Promise<readonly Bounds[]> => {
    const response = await axios.get<ReadonlyArray<EncodedBounds>>(`${config.apiDomain}/bounds/paths/${boundsType}/`)
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
    }, {} as {[key: string]: MutableBounds}))
}