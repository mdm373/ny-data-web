import * as React from "react";
import { DropDownOption, DropDown } from "@app/forms/drop-down";
import { BoundType } from "@gen/nydata-api";
import { useDispatch } from "react-redux";
import { boundDropFeature, boundDropChangedAction } from "./bound-drop.feature";
import { boundDropInitActionType } from "./bound-drop.effects";

export const nilBoundType: BoundType = {displayName: "nil", typeName: "nil"}
const defaultOption: DropDownOption<BoundType> = {
    display: "Select One",
    payload: nilBoundType
}

export const BoundDrop: React.FC<{}> = () =>{
    const dispatch = useDispatch()
    React.useEffect(() => {
        dispatch(boundDropFeature.newActionForType(boundDropInitActionType))
    }, [])
    const boundDropState = boundDropFeature.useState()
    const onChange = (newType: BoundType|undefined) => {
        if(newType) {
            dispatch(boundDropFeature.newUpdate({selected: newType}))
            dispatch(boundDropChangedAction)
        }
    }
    const options: readonly DropDownOption<BoundType>[] = [defaultOption].concat(boundDropState.boundTypes.map( (boundType) => ({
        display: boundType.displayName,
        payload: boundType
    })))
    return <div>
        <DropDown options={options} value={boundDropState.selected} onChange={onChange}></DropDown>
    </div>
}