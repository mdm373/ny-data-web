import * as React from 'react'

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
    return <div style={style} className="badge badge-info">{props.state.name}</div>
}