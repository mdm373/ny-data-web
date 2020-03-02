import * as React from "react"
import "./global-content.scss"
import { BoundsToolTip } from "./series/tooltip/tooltip";
import {BoundType} from '@gen/nydata-api'
import { InputDate } from "@app/forms/input-date";
import { AppMap } from "./app-map/app-map";
import { displayBoundsEffectBinding } from "./display-bounds.effect";
import { SeriesDrop } from "./series/series-drop/series-drop";
import { seriesDropFeature } from "./series/series-drop/series-drop.feature";

export type BoundTypeChangeHandler = (boundType: BoundType|undefined) => void

export const GlobalContent: React.FC<{}> = () => {
    const [startDate, setStartDate] = React.useState(undefined as Date|undefined)
    const onStartDateChange = async (date?: Date) => setStartDate(date)
    seriesDropFeature.useEffect(displayBoundsEffectBinding)
    return <div className="global-content-container">
            <BoundsToolTip></BoundsToolTip>
            <AppMap></AppMap>
            <div className="control-grid">
                <div className="control-row">
                    <div className="control-label">
                        data series
                    </div>
                    <div className="control-value">
                        <SeriesDrop></SeriesDrop>
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