
declare namespace google {
    namespace maps {
        interface PolylineConfig {
            path: MapPoint[],
            geodesic: boolean,
            strokeColor: string,
            strokeOpacity: number,
            strokeWeight: number
        }
        class Polyline {
            constructor(config: PolylineConfig)
            setMap(map: Map): void
        }
        interface MapPoint {
            readonly lat: number;
            readonly lng: number;
        }
        interface MapConfig {
            readonly center: MapPoint;
            readonly zoom: number;
        }
        class Map {
            constructor(element: HTMLElement, config: MapConfig)
        } 
    }
}
