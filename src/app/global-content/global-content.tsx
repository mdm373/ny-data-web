import * as React from "react"
import "./global-content.scss"
import { AppMap } from "./map/map"
import { BoundDrop } from "./bounds/bound-drop"
import { BoundsType, getBoundsPaths } from "./bounds/get-bounds-paths";
import { BoundsToolTip, ToolTipState, ToolTipSpeed } from "./bounds/tooltip/tooltip";

type DisplayBounds = {polys: google.maps.Polygon[]};

const defaultToolTopState: ToolTipState = {
    name: "",
    x: 0,
    y: 0,
    speed: 'fast',
    visible: false,
}
export const GlobalContent: React.FC<{}> = () => {
    const [currentDisplayedBounds, setDisplayedBounds] = React.useState([] as DisplayBounds[])
    const [toolTipState, setToolTipState] = React.useState(defaultToolTopState)
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
            const getMouseEventHandler = (speed: ToolTipSpeed) => {
                return (event: google.maps.PolyMouseEvent) => {
                    if(event.ya.touches && event.ya.touches[0]) {
                        setToolTipState({
                            name: bound.id,
                            x: event.ya.touches[0].clientX,
                            y: event.ya.touches[0].clientY,
                            speed,
                            visible: true
                        })
                    } else if(event.ya.clientX !== undefined && event.ya.clientY !== undefined) {
                        setToolTipState({name: bound.id, x: event.ya.clientX, y: event.ya.clientY, speed, visible: true})
                    }
                }
            }
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
                    googlePoly.addListener('mousemove', getMouseEventHandler('fast'))
                    googlePoly.addListener('mousedown', getMouseEventHandler('slow'))
                    googlePoly.addListener('mouseout', () => {
                        setToolTipState(state => ({...state, visible: false}))    
                    })
                    return googlePoly
                }),
            }
        }));
    }
    return <div className="global-content-container">
            <BoundsToolTip state={toolTipState}></BoundsToolTip>
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