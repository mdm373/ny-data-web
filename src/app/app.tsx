import './app.scss'

import * as React from "react";
import * as ReactDOM from "react-dom";
import { GlobalHeader } from './global-header/global-header';
import { GlobalFooter } from './global-footer/global-footer';
import { GlobalContent } from './global-content/global-content';
import { getDisplayBoundsHandler } from './global-content/bounds/displayed-bounds';
import {Provider} from "react-redux"
import { store} from './store'
import {map} from 'rxjs/operators'

(async () => {
    
    const onMapLoad = (aMap: google.maps.Map) => {
        const {toolTipState$} = getDisplayBoundsHandler(aMap, store.toObservable.pipe(map(state => state.boundType)))
        toolTipState$.subscribe((toolTipState) => {
            store.dispatch({type: 'tt', payload: {toolTipState}})
        })
    }
    try {
        ReactDOM.render(<div className="view-port">
            <Provider store={store}>
                <div className="main-top-port">
                    <GlobalHeader></GlobalHeader>
                </div>
                <div className="main-content-port">
                    <GlobalContent onMapLoad={onMapLoad}></GlobalContent>
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
