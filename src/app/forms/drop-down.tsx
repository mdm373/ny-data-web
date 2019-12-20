
import * as React from "react";

export type OnDropDownChange<T> = (data: T) => void
export type DropDownOption<T> = Readonly<{
    payload: T,
    disaply: string
}>

export const DropDown: React.FC<{onChange: OnDropDownChange<string>, options: DropDownOption<string>[]}> = (props) =>{
    const onClick = (id: string) => () => props.onChange(id)
    const items = props.options.map((current) => {
        return <a className="dropdown-item" href="#" onClick={()=> props.onChange(current.payload)}>{current.disaply}</a>
    })
    return <div className="dropdown p-2">
        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            boundry
        </button>
        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            {items}
        </div>
    </div>
}