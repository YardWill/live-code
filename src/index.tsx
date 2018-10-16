import * as monaco from 'monaco-editor';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
export const model = monaco.editor.createModel('', 'javascript');
ReactDOM.render(
  <App model={model} fontSize={12} />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
