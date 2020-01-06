import * as React from 'react'
import githubLogo from './github-logo.svg';
import './github-button.scss';

export const GithubButton: React.FC<{width: string, height: string}> = () => {
    return <a type="button" className="github-btn" href="https://github.com/mdm373/ny-data-web">
        <img src={githubLogo} className="logo"></img>
        <span className="text">view source</span>
    </a>
}