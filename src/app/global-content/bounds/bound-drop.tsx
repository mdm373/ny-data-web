

import * as React from "react";
import { getBoundsTypes } from "./get-bounds-paths";
import { DropDownOption, DropDown } from "@app/forms/drop-down";
import { BoundType } from "@gen/nydata-api";
import { useSelector, useDispatch } from "react-redux";
import { AppState, FooAction } from "@app/store";

export type BoundDropChangeHandler = (bounds: BoundType|undefined) => void

export const nilBoundType: BoundType = {displayName: "nil", typeName: "nil"}
const defaultOption: DropDownOption<BoundType> = {
    display: "Select One",
    payload: nilBoundType
}

const boundTypeSelector = (state: AppState) => {
    return state.boundType
}
export const BoundDrop: React.FC<{}> = () =>{
    const [boundTypes, setBoundTypes] = React.useState([] as readonly BoundType[])
    const boundType = useSelector(boundTypeSelector)
    React.useEffect(() => {
        (async() => {
            const val = await getBoundsTypes()
            setBoundTypes(val)
        }
        )()
    }, [])
    const dispatch = useDispatch<(a: FooAction) => void>()
    const onChange = (newType: BoundType|undefined) => {
        if(newType) {
            dispatch({type:'bob', payload: {boundType: newType}})
        }
    }
    const options: readonly DropDownOption<BoundType>[] = [defaultOption].concat(boundTypes.map( (boundType) => ({
        display: boundType.displayName,
        payload: boundType
    })))
    return <div>
        <DropDown options={options} value={boundType} onChange={onChange}></DropDown>
    </div>
}