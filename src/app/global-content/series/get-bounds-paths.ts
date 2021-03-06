import { decode } from '@mapbox/polyline'
import {BoundsApi, BoundType} from "@gen/nydata-api"
import {getAppConfig} from "@app/config/config"


const config = getAppConfig()
const boundsApi = new BoundsApi({basePath: config.apiDomain})

interface BoundsImmutable {
    readonly areas: readonly google.maps.LatLngLiteral[][]
}
interface BoundsMutable {
    id: string,
    centroid: google.maps.LatLngLiteral,
    areas: google.maps.LatLngLiteral[][]
}

export type Bounds = Readonly<Omit<BoundsMutable, 'areas'> & BoundsImmutable>

const decodeToLatLng = (encodedPath: string) => {
    return decode(encodedPath).map((cord): google.maps.LatLngLiteral => {
        const [lat, lng] = cord
        return {lat, lng}
    })  
}

export type BoundTypeImmutable = Readonly<BoundType>

export const getBoundsPaths = async (boundsType: string): Promise<readonly Bounds[]> => {
    const response = await boundsApi.listBoundsPaths(boundsType)
    return Object.values(response.items.reduce((agg, current) => {
        if(!agg[current.boundId]) {
            agg[current.boundId] = {
                id: current.boundId,
                centroid: decodeToLatLng(current.centroid,)[0],
                areas: [],
            }
        }
        agg[current.boundId].areas.push(decodeToLatLng(current.bounds))
        
        return agg
    }, {} as {[key: string]: BoundsMutable}))
}
