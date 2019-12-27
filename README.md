# ConnectBox API

[![npm version](https://img.shields.io/npm/v/connectbox.svg)](https://www.npmjs.org/package/connectbox)

This package is a simple api wrapper for the web interface of the Connect Box (modem/router provided by ISPs e.g. Unitymedia)
Currently only a couple of the web interface functions are implemented.

## Installing
Using npm:

```bash
npm i connectbox
```

## Usage

This example shows how to get an unformatted list of all currently connected devices.

```javascript
import ConnectBox from 'connectbox';
// creating an ConnectBox object with the ip address of the target
const connectBox = new ConnectBox('192.168.0.1');
// logging in with the "password"
await connectBox.login('password');
// getting the list of all connected devices
const devices = await connectBox.getConnectedDevices();
console.log(devices);
```