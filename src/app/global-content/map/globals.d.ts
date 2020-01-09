
declare namespace google {
    namespace maps {
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
            path: LatLng[] | LatLng[][],
            geodesic: boolean,
            strokeColor: string,
            strokeOpacity: number,
            strokeWeight: number,
            fillColor: string,
            fillOpacity: number,
            map: Map,
        }>>
        type LatLng = Readonly<{
            lat: number;
            lng: number;
        }>
        type MapOptions = Partial<Readonly<{
            center: LatLng;
            zoom: number;
        }>>
        
        class Polyline {
            constructor(options: PolylineOptions)
        }
        class Polygon {
            constructor(options: PolygonOptions)
            setMap(map: google.maps.Map|null): void;
            addListener(eventName: string, handler: () => void): void;
        }
        class Map {
            constructor(element: HTMLElement, options: MapOptions)
        }
        class Marker {
            constructor(options: MarkerOptions)
            setMap(map: google.maps.Map|null): void
        }
    }
}
