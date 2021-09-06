import * as React from 'react';
import * as ReactDOM from 'react-dom';

/**
 * we fixed some sizing issues in the CSS container.
 */
import '../css/explorer.css';

/**
 * GraphExplorer import
 */
import * as GraphExplorer from 'graph-explorer';

import { workspaceProps } from './workspaceProps';

// ReactJS way of adding components
document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    React.createElement(GraphExplorer.Workspace, workspaceProps),
    document.getElementById('graph-explorer-container')
  );
});
