import './app.scss'

import * as React from "react";
import * as ReactDOM from "react-dom";
import { GlobalHeader } from './global-header/global-header';
import { GlobalFooter } from './global-footer/global-footer';
import { GlobalContent } from './global-content/global-content';
import {Provider} from "react-redux"
import { store as reactiveStore } from '@reactive-redux';
import { boundDropFeature } from './global-content/bounds/bound-drop/bound-drop.feature';
import { toolTipFeature } from './global-content/bounds/tooltip/tooltip.feature';
import { appMapFeature } from './global-content/app-map/app-map.feature';

const store = reactiveStore.getAppStore([
    boundDropFeature.subStore,
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
