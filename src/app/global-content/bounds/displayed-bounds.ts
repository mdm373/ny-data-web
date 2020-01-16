import { BehaviorSubject, Observable } from 'rxjs'
import { ToolTipState, ToolTipSpeed, defaultToolTipState } from './tooltip/tooltip'
import { BoundType } from '@gen/nydata-api';
import { getBoundsPaths } from './get-bounds-paths';
import { distinctUntilChanged } from 'rxjs/operators';
import { nilBoundType } from './bound-drop';

type DisplayBounds = {polys: google.maps.Polygon[]};

export type BoundTypeChangeHandler = (boundType: BoundType) => void

export type DisplayBoundsHandler = Readonly<{
    toolTipState$: Observable<ToolTipState>,
    unsub: () => void
}>

export const getDisplayBoundsHandler = (map: google.maps.Map, boundType$: Observable<BoundType|undefined>): DisplayBoundsHandler => {
    const toolTipStateSubj$ = new BehaviorSubject<ToolTipState>(defaultToolTipState)
    const toolTipState$: Observable<ToolTipState> = toolTipStateSubj$
    const displayedBounds$ = new BehaviorSubject<readonly DisplayBounds[]>([])
    const hideToolTip = () => toolTipStateSubj$.next({...toolTipStateSubj$.value, visible: false})
    const sub  = boundType$.pipe(distinctUntilChanged()).subscribe(async (boundType) => {
        displayedBounds$.value.forEach(bound => {
            bound.polys.forEach(poly => poly.setMap(null))
        })
        hideToolTip()
        if(!boundType || boundType === nilBoundType) {
            displayedBounds$.next([])
            return
        }
        const bounds = await getBoundsPaths(boundType.typeName);
        displayedBounds$.next(bounds.map((bound) => {
            const getMouseEventHandler = (speed: ToolTipSpeed) => {
                return (event: google.maps.PolyMouseEvent) => {
                    const projection = map.getProjection()
                    const point = event.latLng && projection.fromLatLngToPoint(event.latLng) || undefined
                    if(point) {
                        toolTipStateSubj$.next({name: bound.id, x: point.x, y: point.y, speed, visible: true})
                    }
                }
            }
            return {
                polys: bound.areas.map((poly) => {
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
                }),
            }
        }));
    })
    const unsub = sub.unsubscribe.bind(sub)
    map.addListener('dragged', hideToolTip)
    return {unsub, toolTipState$}
}