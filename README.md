# Radio engine for NodeJS
[![build](https://img.shields.io/circleci/build/github/Kefir100/fridgefm-radio-core.svg)](https://circleci.com/gh/Kefir100/fridgefm-radio-core)
[![coverage](https://img.shields.io/codecov/c/gh/Kefir100/fridgefm-radio-core.svg)](https://codecov.io/gh/Kefir100/fridgefm-radio-core)
[![npm](https://img.shields.io/npm/dw/@fridgefm/radio-core.svg)](https://www.npmjs.com/package/@fridgefm/radio-core)
![GitHub](https://img.shields.io/github/license/kefir100/fridgefm-radio-core.svg)
![node](https://img.shields.io/node/v/@fridgefm/radio-core.svg)

## Usage

> Simple lightweight package to start your own `live` radio station 📻 Just drop your `mp3` files and broadcast them to the world 🌎Heavily inspired by [Shoutcast](https://www.shoutcast.com) and [Icecast](http://icecast.org).

## Setup

### Installation
```
npm i @fridgefm/radio-core --save
```
### Server
```javascript
const { Station } = require('@fridgefm/radio-core');
const station = new Station();

station.addFolder('User/Music');

server.get('/stream', (req, res) => {
  station.connectListener(req, res);
});

station.start();
```
### Client
```html
<audio
    controls
    type='audio/mp3'
    src='/stream'
/>
```

## Station methods
### Public methods that should be exposed to users
`connectListener` connects real users to your station  
response argument is required
```javascript
station.connectListener(request, response, callback);
```
### Private methods that should be used only by admins
`addFolder` adds track within a folder to the playlist
```javascript
station.addFolder('User/Music');
```
`start` starts broadcasting
```javascript
station.start();
```
`next` instantly switches track to the next one
```javascript
station.next();
```
`getPlaylist` just returns you the entire playlist
```javascript
station.getPlaylist();
```

## Station events
#### `nextTrack`
event fires when track changes  
useful for getting to know when exactly the track changed and what track that is
```javascript
station.on('nextTrack', (track) => { console.log(track) });
```

#### `start`
event fires on station start  
```javascript
station.on('start', () => { console.log('Station started') });
```

#### `restart`
event fires on station restart (when playlist is drained and new one is created)  
it might be a nice time to shuffle your playlist for example
```javascript
station.on('restart', () => { station.shufflePlaylist() });
```

#### `error`
event fires when there is some error
```javascript
station.on('error', (e) => { handleError(e) });
```

## or just go to [examples](./examples/server.js)
```
yarn build
node examples/server.js
```
OR
```
yarn build
node examples/server.js [path/to/your_mp3tracks]
# in this case it would take a little more time, just wait
```

## Demo
Fully working demo is available on http://fridgefm.com
