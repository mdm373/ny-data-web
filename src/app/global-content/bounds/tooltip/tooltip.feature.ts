import {feature} from "@reactive-redux"


export type ToolTipSpeed = 'fast'|'slow'
export type ToolTipState = Readonly<{
    x: number, y: number, name: string, speed: ToolTipSpeed, visible: boolean
}>
export const toolTipFeature = feature.create<ToolTipState>({
    name: "",
    x: 0,
    y: 0,
    speed: 'fast',
    visible: false,
})