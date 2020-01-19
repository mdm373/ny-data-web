import * as React from "react"
import "./global-content.scss"
import { BoundsToolTip } from "./bounds/tooltip/tooltip";
import {BoundType} from '@gen/nydata-api'
import { InputDate } from "@app/forms/input-date";
import { AppMap } from "./app-map/app-map";
import { BoundDrop } from "./bounds/bound-drop/bound-drop";
import { boundDropFeature } from "./bounds/bound-drop/bound-drop.feature";
import { displayBoundsEffectBinding } from "./disaply-bounds.effect";

export type BoundTypeChangeHandler = (boundType: BoundType|undefined) => void

export const GlobalContent: React.FC<{}> = () => {
    const [startDate, setStartDate] = React.useState(undefined as Date|undefined)
    const onStartDateChange = async (date?: Date) => setStartDate(date)
    boundDropFeature.useEffect(displayBoundsEffectBinding)
    return <div className="global-content-container">
            <BoundsToolTip></BoundsToolTip>
            <AppMap></AppMap>
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