/// <reference path='../../../.declarations.d.ts'/>

import * as React from 'react'
import githubLogo from './github-logo.svg';
import './github-button.scss';

export const GithubButton: React.FC<{width: string, height: string}> = (props) => {
    return <a type="button" className="btn btn-primary btn-sm text-light" href="https://github.com/mdm373/ny-data-web">
        <img src={githubLogo} width={props.width} height={props.height} className="mr-1 github-button"></img> view source
    </a>
}