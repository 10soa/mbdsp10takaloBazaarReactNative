import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { TextEncoder, TextDecoder } from 'text-encoding';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

console.error = function () {};
console.warn = function () {};
console.info = function() {};
console.debug = function() {};

AppRegistry.registerComponent(appName, () => App);
