import { GithubButton } from "./social/github-button"
import * as React from "react"
import "./global-header.scss"

export const GlobalHeader: React.FC<{}> = () => {
    return <div className="global-header-container">
            <div className="top-bar"></div>
            <div className="content-bar">
                <h1 className="title">ny data project</h1>
                <div className="flex-grow-1"></div>
                <div className="social">
                    <GithubButton height="20px" width="20px"></GithubButton>
                </div>
            </div>
        </div>
}