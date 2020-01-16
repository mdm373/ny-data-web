import {Store, Observable, Action} from 'redux'
import {BehaviorSubject, Observable as RxJsObservable} from 'rxjs'
import { BoundType } from '@gen/nydata-api'
import { ToolTipState, defaultToolTipState } from './global-content/bounds/tooltip/tooltip'
import { nilBoundType } from './global-content/bounds/bound-drop'
export type AppState = Readonly<{
    boundType: BoundType,
    toolTipState: ToolTipState,
}>
export interface FooAction extends Action {
    readonly payload: Partial<AppState>
}

const state = new BehaviorSubject<AppState>({
    boundType: nilBoundType,
    toolTipState: defaultToolTipState
})

export interface AppStore extends Store<AppState, FooAction> {
    readonly toObservable: RxJsObservable<AppState>
}

let listener: (() => void) | undefined
export const store: AppStore = {
    getState: () => state.value,
    subscribe: (subscriber) => {
        listener = subscriber
        return () => listener = undefined
    },
    replaceReducer: () => { throw new Error('reducer replacement not supported')},
    dispatch: <T extends FooAction>(action: T) => {
        state.next({...state.value, ...action.payload})
        listener && listener()
        return action
    },
    [Symbol.observable] : () => state.asObservable() as any as Observable<AppState>,
    toObservable: state.asObservable(),

}