import { Observable, of, from, combineLatest, ReplaySubject } from 'rxjs'
import { ToolTipSpeed, toolTipFeature } from './bounds/tooltip/tooltip.feature'
import { getBoundsPaths } from './bounds/get-bounds-paths';
import { switchMap, filter, take } from 'rxjs/operators';
import { nilBoundType } from './bounds/bound-drop/bound-drop';
import { appMapFeature } from './app-map/app-map.feature';
import { boundDropChangedAction, boundDropFeature } from './bounds/bound-drop/bound-drop.feature';
import { store } from '@reactive-redux';


type Point = Readonly<{x: number, y: number}>
const getPercent = (map: google.maps.Map, pos: google.maps.LatLng): Point => {
    const bounds = map.getBounds()
    const topRight = bounds.getNorthEast()
    const bottomLeft = bounds.getSouthWest()
    if( bottomLeft.lng > topRight.lng) {
        throw new Error('sorry, wrapping not handled')
    }
    const width = topRight.lng() - bottomLeft.lng()
    const height = topRight.lat() - bottomLeft.lat()
    return {x: (pos.lng() - bottomLeft.lng())/width, y: (topRight.lat() - pos.lat()) / height}
}

export const displayBoundsEffectBinding:store.AppEffectBinding = {
    type: boundDropChangedAction.type,
    effect: (actions$: Observable<store.AppAction>, store: Observable<store.AppStoreState>) => actions$.pipe(
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
                const outputSubject = new ReplaySubject<store.AppAction>()
                const hideToolTip = () => outputSubject.next(toolTipFeature.newUpdate({visible: false}))
                const polys = boundPaths.reduce((allBounds, bound) => {
                    const getMouseEventHandler = (speed: ToolTipSpeed) => {
                        return (event: google.maps.PolyMouseEvent) => {
                            const ele = document.getElementById(appMapState.mapId)?.getBoundingClientRect()
                            const width = ele?.width || 0                               
                            const height = ele?.height || 0
                            const top = ele?.top || 0
                            const left = ele?.left || 0 
                            const point = getPercent(map, event.latLng)
                            const x = left + width*point.x
                            const y = top + height*point.y
                            outputSubject.next(toolTipFeature.newUpdate({name: bound.id, x, y, speed, visible: true}))
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