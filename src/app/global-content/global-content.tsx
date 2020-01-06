import * as React from "react"
import "./global-content.scss"
import { getAppMap } from "./map/map"
import { BoundDrop } from "./bounds/bound-drop"

export const GlobalContent: React.FC<{}> = () => {
    const {AppMap, map: asyncMap} = getAppMap("app-map")
    return <div className="global-content-container">
            <AppMap></AppMap>
            <BoundDrop map={asyncMap}></BoundDrop>
        </div>
}