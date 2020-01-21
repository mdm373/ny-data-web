import { BehaviorSubject, Observable, UnaryFunction } from "rxjs"
import {useAppSubSection, useAppEffect} from './hooks'
import { selectAppSubSection } from './operators'
import { AppPayloadAction, getAppPayloadActionProvider } from "./actions"
import { SubStore, AppAction, AppEffectBinding, AppReducer, AppStoreState, AppReducerBinding } from "./store"

export type SubStoreFeatures<T extends object> = Readonly<{
    subStore: SubStore<T>,
    subSection: symbol,
    updateType: symbol,
    newUpdate: (payload: Partial<T>) => AppPayloadAction<T>,
    newAction: () => AppAction,
    newActionForType: (type: symbol) => AppAction,
    useState: () => T,
    useEffect: (effect: AppEffectBinding) => void
    selectState: UnaryFunction<Observable<AppStoreState>, Observable<T>>
}>

const getAppUpdateReducer: <T extends object>() => AppReducer<AppPayloadAction<T>, T> = () => {
    return (action, state) => ({...state, ...action.payload})
}

export const create = <T extends object>(
    defaultState: T,
    effects?: readonly AppEffectBinding[],
    reducers?: readonly AppReducerBinding<T>[]
): SubStoreFeatures<T> => {
    const subSection = Symbol()
    const updateType = Symbol()
    const newAction = (): AppAction => ({type: Symbol(), subSection})
    const newActionForType = (type: symbol): AppAction => ({type, subSection})
    const effectListener = new BehaviorSubject<((binding: AppEffectBinding) => void)|undefined>(undefined)
    const subStore: SubStore<T> = {
        subSection,
        defaultState,
        effects: effects || [],
        reducers: (reducers || []).concat([{
            type: updateType,
            reducer: getAppUpdateReducer<T>()
        }]),
        newEffect: (binding: AppEffectBinding) => {
            effectListener.value && effectListener.value(binding)
        },
        onNewEffect: effectListener.next.bind(effectListener)
    }
    const newUpdate = getAppPayloadActionProvider<T>(subStore.subSection, updateType)
    const useState = () => useAppSubSection<T>(subStore.subSection)
    const selectState = selectAppSubSection<T>(subSection)
    const useEffect = (effect: AppEffectBinding) => useAppEffect(subStore, effect)
    return {subStore, updateType, newUpdate, useState, selectState, subSection, newAction, useEffect, newActionForType}
}