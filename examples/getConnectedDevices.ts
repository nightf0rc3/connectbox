import ConnectBox from '../src';

(async () => {
    try {
        const connectBox = new ConnectBox('192.168.0.1');
        await connectBox.login('password');
        const devices = await connectBox.getConnectedDevices();
        console.log(devices);
    } catch (err) {
        console.log(err);
    }
})();
