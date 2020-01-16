import * as React from 'react'
import {formatISO} from 'date-fns'

const formatISODate = (date: Date) => formatISO(date, {representation: 'date'})

export type InputDateOnChange = (date?: Date) => void

export const InputDate: React.FC<{
    value?: Date,
    onChange?: InputDateOnChange
}> = (props) => {
    const value = props.value ? formatISODate(props.value) : undefined
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const changed = event.target.value ? new Date(event.target.value) : undefined
        props.onChange && props.onChange(changed)
    }
    return <input type="date" onChange={onChange} value={value}></input>
}