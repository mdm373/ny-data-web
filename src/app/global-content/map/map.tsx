/// <reference path='./globals.d.ts'/> 

import * as React from "react";
import { getAppConfig } from "@app/config/config";
import Helmet from "react-helmet";

export type MapLoadHandler = (map: google.maps.Map) => void

export const AppMap: React.FC<{mapId: string, onMapLoad: MapLoadHandler}> = (props) => {
    const [mapsUrl, setMapsUrl] = React.useState("")
    React.useEffect(() => {
        (async()=>{
            const config = getAppConfig()
            setMapsUrl(`https://maps.googleapis.com/maps/api/js?key=${config.mapsApiKey}&callback=initMap`)
            const initMap = () => {
                const mapElement = document.getElementById(props.mapId)
                if(!mapElement) {
                    throw new Error(`could not find map element '${props.mapId}'`)
                }
                const mapConfig = {
                    center: { lat:40.730610, lng: -73.935242},
                    zoom: 10,
                };
                props.onMapLoad(new google.maps.Map(mapElement, mapConfig));
            };
            (window as any).initMap = initMap;
        })()
    })
    return <div className="h-100 w-100">
        <div id={props.mapId} className="h-100 w-100"></div>
        <Helmet>
            <script src={mapsUrl} async defer></script>
        </Helmet>
    </div>
 }
 