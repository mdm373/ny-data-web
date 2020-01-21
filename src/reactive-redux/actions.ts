import { AppAction } from "./store"

export type AppPayloadAction<T> = AppAction & Readonly<{
    payload: Partial<T>
}>

export const getAppPayloadActionProvider = <T extends object>(subSection: symbol, type: symbol) => (payload: Partial<T>): AppPayloadAction<T> => ({subSection, type, payload})
export const getAppAction = (subSection: symbol, type: symbol) => ({subSection, type})
