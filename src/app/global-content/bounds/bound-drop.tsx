

import * as React from "react";
import { getBoundsTypes, BoundsType } from "./get-bounds-paths";
import { DropDownOption, DropDown } from "@app/forms/drop-down";

type BoundsSelectionChangeHandler = (bounds: BoundsType) => void

const defaultOption: DropDownOption<string> = {
    display: "Select One",
    payload: "nil",
}
const defaultState: Readonly<{
    options: readonly DropDownOption<string>[], 
    types: {readonly [key:string] : BoundsType},
}> = {
    options: [defaultOption],
    types : {}
}
export const BoundDrop: React.FC<{
    onChange: BoundsSelectionChangeHandler
}> = (props) =>{
    const [currentState, setState] = React.useState(defaultState)
    
    React.useEffect(() => {
        (async() => {
            const boundsTypes = await getBoundsTypes()
            const options = currentState.options.concat(boundsTypes.map((boundType) => ({
                display: boundType.displayName,
                payload: boundType.typeName,
            })))
            const types = boundsTypes.reduce((agg, current) => {
                agg[current.typeName] = current;
                return agg
            }, {} as {[key:string] : BoundsType})
            setState({options, types})
        }
        )()
    }, [])
    const onChange = (selected: string) => {
        props.onChange(currentState.types[selected])
    }
    return <div>
        <DropDown onChange={onChange} options={currentState.options}></DropDown>
    </div>
}