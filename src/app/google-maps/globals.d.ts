
declare namespace google {
    namespace maps {
        type Point = Readonly<{
            x: number,
            y: number
        }>
        type LatLngBounds = Readonly<{
            getNorthEast: () => LatLng,
            getSouthWest: () => LatLng
        }>
        type Projection = Readonly<{
            fromPointToLatLng: (point: Point, noWrap?: boolean) => LatLng
            fromLatLngToPoint: (latLng: LatLng, point?: Point) => Point|undefined
        }>
        type PolyMouseEvent = Readonly<{
            edge: number|undefined,
            path: number|undefined,
            vertex: number|undefined,
            latLng: LatLng,
            stop: () => void,
        }>
        type MarkerOptions = Partial<Readonly<{
            label: string,
            position: LatLng,
            map: Map,
        }>>
        type PolylineOptions = Partial<Readonly<{
            path: LatLng[],
            geodesic: boolean,
            strokeColor: string,
            strokeOpacity: number,
            strokeWeight: number,
            map: Map,
        }>>
        type PolygonOptions = Partial<Readonly<{
            path: LatLng[] | LatLngLiteral[],
            geodesic: boolean,
            strokeColor: string,
            strokeOpacity: number,
            strokeWeight: number,
            fillColor: string,
            fillOpacity: number,
            map: Map,
        }>>
        type LatLng = Readonly<{
            lat: () => number;
            lng: () => number;
        }>
        type LatLngLiteral = Readonly<{
            lat: number,
            lng: number
        }>
        type MapOptions = Partial<Readonly<{
            center: LatLng|LatLngLiteral;
            zoom: number;
        }>>
        
        class Polyline {
            constructor(options: PolylineOptions)
        }
        class Polygon {
            constructor(options: PolygonOptions)
            setMap(map: google.maps.Map|null): void;
            addListener(eventName: string, handler: (event: PolyMouseEvent) => void): void;
        }
        class Map {
            constructor(element: HTMLElement, options: MapOptions)
            addListener(eventName: string, handler: () => void): void
            getProjection: () => Projection
            getBounds: () => LatLngBounds
        }
        class Marker {
            constructor(options: MarkerOptions)
            setMap(map: google.maps.Map|null): void
        }
    }
}
