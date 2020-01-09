import * as React from 'react'

export type ToolTipState = Readonly<{
    x: number, y: number, name: string
}>
export const BoundsToolTip: React.FC<{state: ToolTipState, offset?: number}> = (props) => {
    const left = (props.offset  === undefined ? 12 : props.offset) + props.state.x 
    const style: React.CSSProperties = {
        left,
        top: props.state.y,
        position: 'absolute',
        zIndex: 100,
        transition: "left 0.01s, top 0.01s",
        transitionTimingFunction: "ease-out"
    }
    return <div style={style} className="badge badge-info">{props.state.name}</div>
}