import * as React from "react"
import "./global-content.scss"
import { AppMap } from "./map/map"
import { BoundDrop } from "./bounds/bound-drop"
import { BoundsType, getBoundsPaths } from "./bounds/get-bounds-paths";

type DisplayBounds = {polys: google.maps.Polygon[]};

export const GlobalContent: React.FC<{}> = () => {
    const [currentDisplayedBounds, setDisplayedBounds] = React.useState([] as DisplayBounds[])
    const [currentMap, setCurrentMap] = React.useState(undefined as google.maps.Map|undefined)
    const onMapLoad = (map: google.maps.Map) => {
        setCurrentMap(map)
    }
    const onDropDownChange = async (boundType: BoundsType) => {
        currentDisplayedBounds.forEach(bound => {
            bound.polys.forEach(poly => poly.setMap(null))
        })
        if(!boundType) {
            setDisplayedBounds([])
            return
        }
        const bounds = await getBoundsPaths(boundType.typeName);
        setDisplayedBounds(bounds.map((bound) => { 
            return {
                polys: bound.areas.map((poly) => {
                    const googlePoly = new google.maps.Polygon({
                        path: [...poly],
                        geodesic: true,
                        strokeColor: '#FF0000',
                        strokeOpacity: 1.0,
                        strokeWeight: 2,
                        fillColor: '#FF0000',
                        map: currentMap,
                    })
                    googlePoly.addListener('click', () => {
                        console.log(bound.id)
                    })
                    return googlePoly
                }),
            }
        }));
    }
    return <div className="global-content-container">
            <AppMap onMapLoad={onMapLoad} mapId="app-map-id"></AppMap>
            <div className="control-grid">
                <div className="control-row">
                    <div className="control-label">
                        boundry
                    </div>
                    <div className="control-value">
                        <BoundDrop onChange={onDropDownChange}></BoundDrop>
                    </div>
                </div>
            </div>
        </div>
}