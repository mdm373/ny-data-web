import './app.scss'

import * as React from "react";
import * as ReactDOM from "react-dom";
import { GlobalHeader } from './global-header/global-header';
import { GlobalFooter } from './global-footer/global-footer';
import { GlobalContent } from './global-content/global-content';

(async () => {
    try {
        ReactDOM.render(<div className="view-port">
            <div className="main-top-port">
                <GlobalHeader></GlobalHeader>
            </div>
            <div className="main-content-port">
                <GlobalContent></GlobalContent>
            </div>
            <div className="main-bottom-port">
                <GlobalFooter></GlobalFooter>
            </div>
        </div>, document.getElementById('ny-data-app'))
    } catch(error) {
        console.error(`unexpected error ${error}`)
    }
    
})();
