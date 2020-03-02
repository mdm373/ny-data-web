import * as React from "react";
import { DropDownOption, DropDown } from "@app/forms/drop-down";
import { useDispatch } from "react-redux";
import { seriesDropFeature, seriesDropChangedAction } from "./series-drop.feature";
import { seriesTypesInitActionType } from "./series-drop.effects";
import { SeriesTypeImmutable } from "@app/generated-immutable";


export const nilSeriesType: SeriesTypeImmutable = {displayName: "nil", typeName: "nil", boundType: "", newest: "", oldest: "", valueName: ""}

const defaultOption: DropDownOption<SeriesTypeImmutable> = {
    display: "Select One",
    payload: nilSeriesType
}

export const SeriesDrop: React.FC<{}> = () =>{
    const dispatch = useDispatch()
    React.useEffect(() => {
        dispatch(seriesDropFeature.newActionForType(seriesTypesInitActionType))
    }, [])
    const seriesDropState = seriesDropFeature.useState()
    const onChange = (newType: SeriesTypeImmutable|undefined) => {
        if(newType) {
            dispatch(seriesDropFeature.newUpdate({selected: newType}))
            dispatch(seriesDropChangedAction)
        }
    }
    const options: readonly DropDownOption<SeriesTypeImmutable>[] = [defaultOption].concat(seriesDropState.seriesTypes.map( (seriesType) => ({
        display: seriesType.displayName,
        payload: seriesType
    })))
    return <div>
        <DropDown options={options} value={seriesDropState.selected} onChange={onChange}></DropDown>
    </div>
}