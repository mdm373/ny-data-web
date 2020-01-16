
import * as React from "react";

export type OnDropDownChange<T> = (data: T|undefined) => void
export type DropDownOption<T> = Readonly<{
    payload: T,
    display: string
}>

type DropDownProps<T> = {
    value?: T,
    onChange?: OnDropDownChange<T>
    options: readonly DropDownOption<T>[],
}

export const DropDown = <T extends object|undefined>(props: DropDownProps<T>) => {
    return <div className="dropdown p-2">
        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            {(props.value !== undefined && props.options.find(opt => opt.payload === props.value) || props.options[0] || {display: ""}).display}
        </button>
        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            {props.options.map((current) =>
                <a className="dropdown-item" href="#" onClick={()=> props.onChange && props.onChange(current.payload)}>{current.display}</a>
            )}
        </div>
    </div>
}