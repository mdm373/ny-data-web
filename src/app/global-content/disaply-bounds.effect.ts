import { Observable, of, from, combineLatest, ReplaySubject } from 'rxjs'
import { ToolTipSpeed, toolTipFeature } from './bounds/tooltip/tooltip-state'
import { getBoundsPaths } from './bounds/get-bounds-paths';
import { switchMap, filter, take } from 'rxjs/operators';
import { nilBoundType } from './bounds/bound-drop/bound-drop';
import { AppAction, AppStoreState, AppEffectBinding } from '@redux/store';
import { appMapFeature } from './app-map/app-map.feature';
import { boundDropChangedAction, boundDropFeature } from './bounds/bound-drop/bound-drop.feature';


export const displayBoundsEffectBinding:AppEffectBinding = {
    type: boundDropChangedAction.type,
    effect: (actions$: Observable<AppAction>, store: Observable<AppStoreState>) => actions$.pipe(
        switchMap(() => combineLatest([
            store.pipe(appMapFeature.selectState),
            store.pipe(boundDropFeature.selectState)
        ]).pipe(take(1))),
        filter( ([appMapState]) => appMapState.map !== undefined),
        switchMap(([appMapState, boundDropState]) => {
            appMapState.polys.forEach(poly => poly.setMap(null))
            if(!boundDropState.selected || boundDropState.selected === nilBoundType) {
                return of(appMapFeature.newUpdate({polys: []}))
            }
            return from(getBoundsPaths(boundDropState.selected.typeName)).pipe(take(1), switchMap( (boundPaths) => {
                if(!appMapState.map){
                    throw new Error('map unloaded after map null fitlered. who unloaded this X_x???')
                }
                const map = appMapState.map
                const outputSubject = new ReplaySubject<AppAction>()
                const hideToolTip = () => outputSubject.next(toolTipFeature.newUpdate({visible: false}))
                const polys = boundPaths.reduce((allBounds, bound) => {
                    const getMouseEventHandler = (speed: ToolTipSpeed) => {
                        return (event: google.maps.PolyMouseEvent) => {
                            const projection = map.getProjection()
                            const point = event.latLng && projection.fromLatLngToPoint(event.latLng) || undefined
                            if(point) {
                                outputSubject.next(toolTipFeature.newUpdate({name: bound.id, x: point.x, y: point.y, speed, visible: true}))
                            }
                        }
                    }
                    return allBounds.concat(bound.areas.map((poly) => {
                        const googlePoly = new google.maps.Polygon({
                            path: [...poly],
                            geodesic: true,
                            strokeColor: '#FF0000',
                            strokeOpacity: 1.0,
                            strokeWeight: 2,
                            fillColor: '#FF0000',
                            map,
                        })
                        googlePoly.addListener('mousemove', getMouseEventHandler('fast'))
                        googlePoly.addListener('mousedown', getMouseEventHandler('slow'))
                        googlePoly.addListener('mouseout', hideToolTip)
                        return googlePoly
                    }))
                }, [] as google.maps.Polygon[])
                outputSubject.next(appMapFeature.newUpdate({polys}))
                return outputSubject
            }))
        }),
    )
}