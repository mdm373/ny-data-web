import {Observable, Store, Action} from 'redux'
import {BehaviorSubject, Subject, Subscription, Observable as RxJsObservable} from 'rxjs'

type Listener = () => void

type LiveEffect = Readonly<{
    input: Subject<AppAction>
    sub: Subscription
}>

export type AppAction = Action<symbol>  & Readonly<{
    readonly subSection: symbol,
    readonly type: symbol
}>

export type AppStore = Store<AppStoreState, AppAction> & {
    readonly toObservable: RxJsObservable<AppStoreState>,
}

export type AppStoreState = any

export type AppEffect<A extends AppAction> = (actions$: RxJsObservable<A>, state$: RxJsObservable<AppStoreState>) => RxJsObservable<A>
export type AppReducer<A extends AppAction, S extends object> = (action: A, oldState: S) => S

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
    effects: readonly AppEffectBinding[],
    reducers: readonly AppReducerBinding<S>[],
    defaultState: S,
    newEffect: (binding: AppEffectBinding) => void,
    onNewEffect: ( listener: (binding: AppEffectBinding) => void) => void,
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
