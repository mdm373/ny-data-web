import * as React from 'react'
import { GoogleMap } from '@app/google-maps/google-map'
import { getAppConfig } from '@app/config/config'
import { useDispatch } from 'react-redux'
import { appMapFeature } from './app-map.feature'

export const AppMap: React.FC<{}> = () => {
    const dispatch = useDispatch();
    return <GoogleMap apiKey={getAppConfig().mapsApiKey} mapId="AppMapMap"
        onMapLoad={(map) => dispatch(appMapFeature.newUpdate({map}))
    }>
    </GoogleMap>
}