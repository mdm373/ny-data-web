import * as React from 'react'
import "./tooltip.scss"
import { toolTipFeature } from './tooltip.feature'


export const BoundsToolTip: React.FC<{offset?: number}> = (props) => {
    const state = toolTipFeature.useState()
    const left = (props.offset  === undefined ? 12 : props.offset) + state.x
    const followStyle: React.CSSProperties = {
        left,
        top: state.y,
        position: 'absolute',
        zIndex: 100,
        transitionTimingFunction: "ease-out",
        transitionProperty: state.visible ? 'left, top' : '',
        transitionDuration: state.speed  === 'fast' ? '0.1s' : '0.8s',

    }
    const visibleStyle: React.CSSProperties = {
        transitionTimingFunction: "ease-in",
        transitionDuration: '.6s',
        transitionProperty: 'opacity',
        opacity: state.visible ? 1 : 0
    }
    return <h3 style={followStyle} className="bounds-tooltip-container">
        <div style={visibleStyle} className="tooltip-text">{state.name}</div>
    </h3>
}