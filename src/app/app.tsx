import './app.scss'

import * as React from "react";
import * as ReactDOM from "react-dom";
import { GlobalHeader } from './global-header/global-header';
import { GlobalFooter } from './global-footer/global-footer';
import { GlobalContent } from './global-content/global-content';
import {Provider} from "react-redux"
import { store as reactiveStore } from '@reactive-redux';
import { toolTipFeature } from './global-content/series/tooltip/tooltip.feature';
import { appMapFeature } from './global-content/app-map/app-map.feature';
import { seriesDropFeature } from './global-content/series/series-drop/series-drop.feature';

const store = reactiveStore.getAppStore([
    seriesDropFeature.subStore,
    toolTipFeature.subStore,
    appMapFeature.subStore,
]);

(async () => {
    try {
        ReactDOM.render(<div className="view-port">
            <Provider store={store}>
                <div className="main-top-port">
                    <GlobalHeader></GlobalHeader>
                </div>
                <div className="main-content-port">
                    <GlobalContent></GlobalContent>
                </div>
                <div className="main-bottom-port">
                    <GlobalFooter></GlobalFooter>
                </div>
            </Provider>
        </div>, document.getElementById('ny-data-app'))
    } catch(error) {
        console.error(`unexpected error ${error}`)
    }
    
})();
