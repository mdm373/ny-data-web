
declare namespace google {
    namespace maps {
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
