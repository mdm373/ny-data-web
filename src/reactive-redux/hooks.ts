import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { SubStore, AppEffectBinding, AppStoreState } from './store'

export const useAppEffect = <T extends object>(subStore: SubStore<T>, effect: AppEffectBinding) => useEffect(() => {
    subStore.newEffect(effect)
}, [])

export const useAppSelector = <S, T>(subSection: symbol, listener: (state: S) => T) => {
    return useSelector<AppStoreState, T>((s) => listener(s[subSection]))
}

export const useAppSubSection = <T>(subSection: symbol) => {
    return useSelector<AppStoreState, T>((s) => {
        return (s[subSection] as T)
    })
}