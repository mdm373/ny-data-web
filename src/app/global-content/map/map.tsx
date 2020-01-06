/// <reference path='./globals.d.ts'/> 

import * as React from "react";
import { getAppConfig } from "@app/config/config";
import Helmet from "react-helmet";


export const getAppMap = (mapId: string): {AppMap: React.FC<{}>, map: Promise<google.maps.Map>} => {
    const getMap = (mapConfig: google.maps.MapOptions): {Map: React.FC<{apiKey: string}>, map: Promise<google.maps.Map>} => {
        const map = new Promise<google.maps.Map>((accept) => {
            const initMap = () => {
                const mapElement = document.getElementById(mapId)
                if(!mapElement) {
                    throw new Error(`could not find map element '${mapId}'`)
                }
                const map = new google.maps.Map(mapElement, mapConfig);
                accept(map)
            };
            (window as any).initMap = initMap;
        })
        const Map: React.FC<{apiKey: string}> = (props) => {
           return <div className="h-100 w-100">
               <div id={mapId} className="h-100 w-100"></div>
               <Helmet>
                   <script src={`https://maps.googleapis.com/maps/api/js?key=${props.apiKey}&callback=initMap`} async defer></script>
               </Helmet>
           </div>
        }
        return {Map, map}
    }
    const mapConfig = {
        center: { lat:40.730610, lng: -73.935242},
        zoom: 10,
    };
    const {Map, map} = getMap(mapConfig)
    return {
        AppMap: () => {
            const apiKey = getAppConfig().mapsApiKey;
            return Map({apiKey})         
        },
        map
    }
 }