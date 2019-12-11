import './app.scss'

import * as React from "react";
import * as ReactDOM from "react-dom";
import {getAppConfig} from "./config/config";
import { AppMap } from './map/map';
import { GithubButton } from './social/github-button';
console.log("appConfig", getAppConfig())

ReactDOM.render(
    <div>
        <nav className="d-flex flex-row site-header sticky-top py-1">
        <div className="d-flex flex-column flex-grow-1"></div>
        <div className="p-2 d-flex flex-column">
            <div className="p-1 d-none d-md-inline-block">
                <GithubButton width="20px" height="20px"></GithubButton>
            </div>
        </div>
        </nav>

        <div className="position-relative overflow-hidden text-center bg-light">
            <div className="col-md-5 mx-auto my-5">
                <h1 className="display-4 font-weight-normal">ny data project</h1>
                <p className="lead font-weight-normal">playing with nyc's open data</p>
            </div>
        </div>
        <div className="container   ">
            <div className="row">
                <div className="col-12 map-row">
                    <AppMap mapId="app-map"></AppMap>
                </div>
            </div>
        </div>
    </div>,
    document.getElementById("ny-data-app")
);
