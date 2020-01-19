import * as React from "react";
import Helmet from "react-helmet";

export type MapLoadHandler = (map: google.maps.Map) => void

export const GoogleMap: React.FC<{mapId: string, apiKey: string, onMapLoad: MapLoadHandler}> = (props) => {
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
    const initCBName = `initMap_${props.mapId}`;
    (window as any)[initCBName] = initMap;
    return <div id={props.mapId} className="h-100 w-100">
        <div  className="h-100 w-100"></div>
        <Helmet>
            <script src={`https://maps.googleapis.com/maps/api/js?key=${props.apiKey}&callback=${initCBName}`} async defer></script>
        </Helmet>
    </div>
 }
 