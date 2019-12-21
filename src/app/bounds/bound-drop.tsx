

import * as React from "react";
import { getBoundsPaths, getBoundsTypes } from "./get-bounds-paths";
import { DropDownOption, DropDown } from "../forms/drop-down";

/*
const boundryOptions: DropDownOption<string>[] = [
    {disaply: 'nypd precincts', payload: 'nypd-precincts'},
    {disaply: 'nypd sectors', payload: 'nypd-sectors'},
    {disaply: 'community districts', payload: 'community-districts'},
    {disaply: 'school districts', payload: 'school-districts'}
];
*/

type DisplayBounds = {polys: google.maps.Polygon[], marker: google.maps.Marker};

export const BoundDrop: React.FC<{map: Promise<google.maps.Map>}> = (props) =>{
    const [currentBoundry, setBoundry] = React.useState('none');
    const [currentOptions, setOptions] = React.useState([] as DropDownOption<string>[])
    const [currentDisplayedBounds, setDisplayedBounds] = React.useState([] as DisplayBounds[])
    React.useEffect(() => {
        (async() =>
            setOptions( (await getBoundsTypes()).map((boundType) => ({
                display: boundType.displayName,
                payload: boundType.typeName,
            })))
        )()
    }, [])
    let map: google.maps.Map = undefined;
    props.map.then((val) => map = val)
    
    const handleClicked = async (boundType: string) => {
        setBoundry(boundType)
        currentDisplayedBounds.forEach(bound => {
            bound.polys.forEach(poly => poly.setMap(null))
            bound.marker.setMap(null)
        })
        const bounds = await getBoundsPaths(boundType);
        setDisplayedBounds(bounds.map((bound) => ({
            marker: new google.maps.Marker({
                map,
                label: bound.id,
                position: bound.centroid,
            }),
            polys: bound.areas.map((poly) => new google.maps.Polygon({
                path: [...poly],
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2,
                fillColor: '#FF0000',
                map,
            })),
        })));
    }
    return <div>
        <DropDown onChange={handleClicked} options={currentOptions}></DropDown>
        <h3>current: {currentBoundry}</h3>
    </div>
}