import {default as axios} from 'axios'
import { getAppConfig } from '../config/config'

type PrecinctBounds = Readonly<{
    sector: string
    precinctId: string
    geom: string
}>
export const getPrecinctPoly = async () => {
    const config = getAppConfig()
    const response = await axios.get<ReadonlyArray<PrecinctBounds>>(`${config.apiDomain}/precinct/020/bounds`)
    console.log(response.data[0].precinctId)
    return response.data.map((bound) => {
        const bounds = bound.geom.replace("MULTIPOLYGON (((", "").replace(")))", "")
        console.log(bound.precinctId + " " + bound.sector)
        return bounds.split(",").map((part): google.maps.MapPoint => {
            const [lng, lat] = part.trim().split(" ").map((loc) => Number(loc))
            return {lat, lng}
        })  
    })
}