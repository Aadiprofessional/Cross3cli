import {AppRegistry} from 'react-native';
import App from './App'; // Adjust the path as necessary
import {name as appName} from './app.json';

// Register the app component
AppRegistry.registerComponent(appName, () => App);
