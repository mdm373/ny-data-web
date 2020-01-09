import * as React from 'react'
import "./style.scss"

export type ToolTipSpeed = 'fast'|'slow'
export type ToolTipState = Readonly<{
    x: number, y: number, name: string, speed: ToolTipSpeed
}>
export const BoundsToolTip: React.FC<{state: ToolTipState, offset?: number}> = (props) => {
    const left = (props.offset  === undefined ? 12 : props.offset) + props.state.x
    const speed = props.state.speed === 'fast' ? 0.1 : .8
    const style: React.CSSProperties = {
        left,
        top: props.state.y,
        position: 'absolute',
        zIndex: 100,
        transition: `left ${speed}s, top ${speed}s`,
        transitionTimingFunction: "ease-out"
    }
    return <h3 style={style}>
        <div className="bounds-tooltip">{props.state.name}</div>
    </h3>
}