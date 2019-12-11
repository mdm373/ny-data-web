/// <reference path='./globals.d.ts'/> 

import * as React from "react";
import { getAppConfig } from "../config/config";
import "./map.scss"
import Helmet from "react-helmet";

 export const Map: React.FC<{apiKey: string, mapId: string, mapConfig: google.maps.MapConfig}> = (props) => {
    const initMap = () => {
        const map = new google.maps.Map(document.getElementById(props.mapId), props.mapConfig);
    };
    (window as any).initMap = initMap;
    return <div className="h-100 w-100">
        <div id={props.mapId} className="h-100 w-100"></div>
        <Helmet>
            <script src={`https://maps.googleapis.com/maps/api/js?key=${props.apiKey}&callback=initMap`} async defer></script>
        </Helmet>
    </div>
 }

 export const AppMap: React.FC<{mapId: string}> = (props) => {
    const apiKey = getAppConfig().mapsApiKey;
    const mapConfig = {
        center: { lat:40.730610, lng: -73.935242},
        zoom: 10,
    };
    return Map({apiKey, mapConfig, ...props})
 }