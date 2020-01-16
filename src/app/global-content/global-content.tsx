import * as React from "react"
import "./global-content.scss"
import { AppMap, MapLoadHandler } from "./map/map"
import { BoundDrop } from "./bounds/bound-drop"
import { BoundsToolTip } from "./bounds/tooltip/tooltip";
import {BoundType} from '@gen/nydata-api'
import { InputDate } from "@app/forms/input-date";

export type BoundTypeChangeHandler = (boundType: BoundType|undefined) => void

export const GlobalContent: React.FC<{
    onMapLoad: MapLoadHandler,
}> = (props) => {
    const [startDate, setStartDate] = React.useState(undefined as Date|undefined)
    const onStartDateChange = async (date?: Date) => setStartDate(date)
    return <div className="global-content-container">
            <BoundsToolTip></BoundsToolTip>
            <AppMap onMapLoad={props.onMapLoad} mapId="app-map-id"></AppMap>
            <div className="control-grid">
                <div className="control-row">
                    <div className="control-label">
                        boundry
                    </div>
                    <div className="control-value">
                        <BoundDrop></BoundDrop>
                    </div>
                </div>
                <div className="control-row">
                    <div className="control-label">
                        start time
                    </div>
                    <div className="control-value">
                        <InputDate value={startDate} onChange={onStartDateChange}></InputDate>
                    </div>
                </div>
            </div>
        </div>
}