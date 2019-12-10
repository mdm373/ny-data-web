import './index.scss'

import * as React from "react";
import * as ReactDOM from "react-dom";

ReactDOM.render(
    <div>
        <nav className="site-header sticky-top py-1">
        <div className="container d-flex flex-column flex-md-row justify-content-between">
            <a className="py-2 d-none d-md-inline-block" href="#">About</a>
        </div>
        </nav>

        <div className="position-relative overflow-hidden p-3 p-md-5 m-md-3 text-center bg-light">
        <div className="col-md-5 p-lg-5 mx-auto my-5">
            <h1 className="display-4 font-weight-normal">ny data project</h1>
            <p className="lead font-weight-normal">playing with nyc's open data</p>
        </div>
        
        </div>>
    </div>,
    document.getElementById("ny-data-app")
);
