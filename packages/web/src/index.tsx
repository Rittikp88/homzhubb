import { AppRegistry } from 'react-native';

import { App } from './App';

AppRegistry.registerComponent('homzhub', () => App);
AppRegistry.runApplication('homzhub', {
  rootTag: document.getElementById('root'),
});
