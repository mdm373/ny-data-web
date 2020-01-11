import * as React from 'react'
import "./tooltip.scss"

export type ToolTipSpeed = 'fast'|'slow'
export type ToolTipState = Readonly<{
    x: number, y: number, name: string, speed: ToolTipSpeed, visible: boolean
}>
export const BoundsToolTip: React.FC<{state: ToolTipState, offset?: number}> = (props) => {
    const left = (props.offset  === undefined ? 12 : props.offset) + props.state.x
    const followStyle: React.CSSProperties = {
        left,
        top: props.state.y,
        position: 'absolute',
        zIndex: 100,
        transitionTimingFunction: "ease-out",
        transitionProperty: props.state.visible ? 'left, top' : '',
        transitionDuration: props.state.speed  === 'fast' ? '0.1s' : '0.8s',

    }
    const visibleStyle: React.CSSProperties = {
        transitionTimingFunction: "ease-in",
        transitionDuration: '.6s',
        transitionProperty: 'opacity',
        opacity: props.state.visible ? 1 : 0
    }
    return <h3 style={followStyle} className="bounds-tooltip-container">
        <div style={visibleStyle} className="tooltip-text">{props.state.name}</div>
    </h3>
}