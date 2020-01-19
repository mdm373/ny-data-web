import {Store, Observable, Action} from 'redux'
import {BehaviorSubject, Observable as RxJsObservable, Subject, Subscription, pipe, UnaryFunction} from 'rxjs'
import { useSelector } from 'react-redux'
import { distinctUntilChanged, map } from 'rxjs/operators'
import {useEffect} from 'react'
export type AppAction = Action<symbol>  & Readonly<{
    readonly subSection: symbol,
    readonly type: symbol
}>

export type AppEffect<A extends AppAction> = (actions$: RxJsObservable<A>, state$: RxJsObservable<AppStoreState>) => RxJsObservable<A>
export type AppReducer<A extends AppAction, S extends object> = (action: A, oldState: S) => S

export interface AppStore extends Store<AppStoreState, AppAction> {
    readonly toObservable: RxJsObservable<AppStoreState>,
}

export type AppEffectBinding = Readonly<{
    readonly type: symbol,
    effect: AppEffect<any>
}>
export type AppReducerBinding<S extends object> = Readonly<{
    readonly type: symbol,
    reducer: AppReducer<any, S>
}>

export type SubStore<S extends object> = Readonly<{
    readonly subSection: symbol,
    effects: readonly Readonly<{
        readonly type: symbol,
        effect: AppEffect<any>
    }>[],
    reducers: readonly Readonly <{
        readonly type: symbol,
        reducer: AppReducer<any, S>
    }>[],
    defaultState: S,
    newEffect: (binding: AppEffectBinding) => void,
    onNewEffect: ( listener: (binding: AppEffectBinding) => void) => void,
}>


export type AppStoreState = any

type Listener = () => void

type LiveEffect = Readonly<{
    input: Subject<AppAction>
    sub: Subscription
}>
export const getAppStore =(
    subStores: readonly SubStore<any>[]
): AppStore => {
    const defaultState = subStores.reduce((agg, subStore) => {
        return {...agg, [subStore.subSection]: subStore.defaultState}
    }, {} as AppStoreState)
    const state = new BehaviorSubject(defaultState)
    const listener = new BehaviorSubject<Listener|undefined>(undefined)
    
    const subStoreMap: any = subStores.reduce((agg, subStore) => {
        return {...agg, ...{[subStore.subSection] : subStore}}
    }, {})

    const dispatch = <T extends AppAction>(action: T) => {
        if(!subStoreMap[action.subSection]) {
            throw new Error(`dispatch for unknown substore`)
        }
        const subEffects: LiveEffect|undefined = effects[action.subSection][action.type]
        const subReducers: AppReducer<any, any>|undefined = reducers[action.subSection][action.type]
        if(subEffects) {
            subEffects.input.next(action)
        }
        if(subReducers) {
            const newSubState = subReducers(action, state.value[action.subSection])
            const newState = {...state.value, [action.subSection]: newSubState}
            state.next(newState)
            listener.value && listener.value()
        }
        return action
    }
    
    const effects: any = subStores.reduce((subStoreSubjectMap, subStore) => {
        const subLiveEffects: any = subStore.effects.reduce((subStoreEffectMap, effectBinding) => {
            const input = new Subject<AppAction>()
            const sub = effectBinding.effect(input, state.asObservable()).subscribe((effectAction) => {
                dispatch(effectAction)
            },
            (error) => {
                console.error("effectError", error)
            })
            const liveEffect: LiveEffect = {input, sub}
            return {...subStoreEffectMap, ...{[effectBinding.type]: liveEffect}}
        }, {} as any)
        return {...subStoreSubjectMap, ...{[subStore.subSection]: subLiveEffects}}
    }, {})
    subStores.forEach((subStore) => {
        subStore.onNewEffect( effectBinding => {
            const input = new Subject<AppAction>()
            const sub = effectBinding.effect(input, state.asObservable()).subscribe((effectAction) => {
                dispatch(effectAction)
            },
            (error) => {
                console.error("effectError", error)
            })
            const liveEffect: LiveEffect = {input, sub}
            effects[subStore.subSection][effectBinding.type] = liveEffect
        })
    })
    const reducers: any = subStores.reduce((reducers, subStore) => {
        const subReducers: any = subStore.reducers.reduce((subReducers, reducer) => {
            return {...subReducers, ...{[reducer.type]: reducer.reducer}}
        }, {} as any)
        return {...reducers, ...{[subStore.subSection]: subReducers}}
    }, {})

    
    return {
        getState: () => state.value,
        subscribe: (subscriber: () => void) => {
            listener.next(subscriber)
            return () => listener.next(undefined)
        },
        replaceReducer: () => { throw new Error('reducer replacement not supported')},
        dispatch,
        [Symbol.observable] : () => state.asObservable() as any as Observable<AppStoreState>,
        toObservable: state.asObservable(),    
    }
}

export const useAppSelector = <S, T>(subSection: symbol, listener: (state: S) => T) => {
    return useSelector<AppStoreState, T>((s) => listener(s[subSection]))
}

export const useAppSubSection = <T>(subSection: symbol) => {
    return useSelector<AppStoreState, T>((s) => {
        return (s[subSection] as T)
    })
}

export const selectAppSubSection = <T extends object>(subSection: symbol) => pipe(
    distinctUntilChanged<AppStoreState>(),
    map( (appState) => (appState[subSection] as T))
)

export type AppPayloadAction<T> = AppAction & Readonly<{
    payload: Partial<T>
}>

export const getAppPayloadActionProvider = <T extends object>(subSection: symbol, type: symbol) => (payload: Partial<T>): AppPayloadAction<T> => ({subSection, type, payload})
export const getAppAction = (subSection: symbol, type: symbol) => ({subSection, type})
export const getUseAppSubSection = <T>(subSection: symbol) => () => useAppSubSection<T>(subSection)

export const getAppUpdateReducer: <T extends object>() => AppReducer<AppPayloadAction<T>, T> = () => {
    return (action, state) => ({...state, ...action.payload})
}

export const getAppSubSectionEffect=  <T extends AppAction>(subSection: symbol, effect: AppEffect<T>): AppEffect<T> => 
    (actions$: RxJsObservable<T>, state$: RxJsObservable<AppStoreState>) => effect(actions$, state$.pipe(selectAppSubSection(subSection)))


export type SubStoreFeatures<T extends object> = Readonly<{
    subStore: SubStore<T>,
    subSection: symbol,
    updateType: symbol,
    newUpdate: (payload: Partial<T>) => AppPayloadAction<T>,
    newAction: () => AppAction,
    newActionForType: (type: symbol) => AppAction,
    useState: () => T,
    useEffect: (effect: AppEffectBinding) => void
    selectState: UnaryFunction<RxJsObservable<AppStoreState>, RxJsObservable<T>>
}>

export const useAddEffect = <T extends object>(subStore: SubStore<T>, effect: AppEffectBinding) => useEffect(() => {
    subStore.newEffect(effect)
}, [])

export const newFeature = <T extends object>(
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
    const useState = getUseAppSubSection<T>(subStore.subSection)
    const selectState = selectAppSubSection<T>(subSection)
    const useEffect = (effect: AppEffectBinding) => useAddEffect(subStore, effect)
    return {subStore, updateType, newUpdate, useState, selectState, subSection, newAction, useEffect, newActionForType}
}