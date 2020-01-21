import { pipe } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators"
import { AppStoreState } from "./store";

export const selectAppSubSection = <T extends object>(subSection: symbol) => pipe(
    map( (appState: AppStoreState) => (appState[subSection] as T)),
    distinctUntilChanged<T>(),
)