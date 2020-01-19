import {newFeature} from "@redux/store"


export type ToolTipSpeed = 'fast'|'slow'
export type ToolTipState = Readonly<{
    x: number, y: number, name: string, speed: ToolTipSpeed, visible: boolean
}>
export const toolTipFeature = newFeature<ToolTipState>({
    name: "",
    x: 0,
    y: 0,
    speed: 'fast',
    visible: false,
})