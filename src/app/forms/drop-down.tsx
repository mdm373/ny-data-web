
import * as React from "react";

export type OnDropDownChange<T> = (data: T) => void
export type DropDownOption<T> = Readonly<{
    payload: T,
    display: string
}>

export const DropDown: React.FC<{
    onChange: OnDropDownChange<string>,
    options: readonly DropDownOption<string>[],
}> = (props) =>{
    const [selectedOption, setSelectedOption] = React.useState(props.options.length > 0 ? props.options[0].display : "")
    const onChange = (option: DropDownOption<string>) => {
        setSelectedOption(option.display)
        props.onChange(option.payload)
    }
    React.useState(selectedOption)
    const items = props.options.map((current) => {
        return <a className="dropdown-item" href="#" onClick={()=>onChange(current)}>{current.display}</a>
    })
    return <div className="dropdown p-2">
        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            {selectedOption}
        </button>
        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            {items}
        </div>
    </div>
}