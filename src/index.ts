import * as React from 'react';
import * as ReactDOM from 'react-dom';

/**
 * we fixed some sizing issues in the CSS container.
 */
import '../css/explorer.css';

/**
 * Ontodia import
 */
import * as Ontodia from 'ontodia';

import { workspaceProps } from './workspaceProps';

// ReactJS way of adding components
document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    React.createElement(Ontodia.Workspace, workspaceProps),
    document.getElementById('onto-container')
  );
});
