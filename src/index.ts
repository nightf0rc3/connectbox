import axios, { AxiosInstance } from 'axios';
import * as xml2js from 'xml2js';

export default class ConnectBox {
    private host: string;
    private client: AxiosInstance;
    private token: string;
    private password: string;

    constructor(host: string) {
        this.host = host;
        this.client = axios.create({
            baseURL: `http://${this.host}/`,
            timeout: 10000,
            headers: {
                HTTP_HEADER_X_REQUESTED_WITH: 'XMLHttpRequest',
                REFERER: `http://${this.host}/index.html`,
                USER_AGENT: 'Mozilla/5.0 (Windows NT 10.0; WOW64)'
            },
            withCredentials: true,
          });
    }

    public async get(functionId: number) {
        return this.execCommand('/xml/getter.xml', functionId);
    }

    public async set(functionId: number) {
        return this.execCommand('/xml/setter.xml', functionId);
    }

    private async execCommand(endpoint: string, functionId: number) {
        const data = await this.client.post(endpoint, `token=${this.token}&fun=${functionId}`);
        this.token = data.headers['set-cookie'][0].split('=')[1].split(';')[0];
        const parsed = await xml2js.parseStringPromise(data.data);
        return JSON.parse(JSON.stringify(parsed));
    }

    private async initToken() {
        const data = await this.client.get('/');
        this.token = data.headers['set-cookie'][0].split('=')[1].split(';')[0];
    }

    public async login(password: string) {
        await this.initToken();
        this.password = password;
        const data = await this.client.post('/xml/setter.xml', `token=${this.token}&fun=${GetFunction.LOGIN}&Username=NULL&Password=${this.password}`);
        this.token = data.headers['set-cookie'][0].split('=')[1].split(';')[0];
        if (data.data.indexOf('loginincorrect') > -1) {
            throw new Error('Login failed, wrong password provided');
        }
        if (data.data.indexOf('AccessDenied') > -1) {
            throw new Error('Someone else is currently connected to the ConnectBox, cannot initiate session');
        }
    }

    public async reboot() {
        return this.set(SetFunction.REBOOT);
    }

    public async logout() {
        return this.set(SetFunction.LOGOUT);
    }

    public async getGlobalSettings() {
        return this.get(GetFunction.GLOBAL_SETTINGS);
    }

    public async getConnectedDevices() {
        return this.get(GetFunction.LANUSERTABLE);
    }

    public async getWirelessAccessControl() {
        return this.get(GetFunction.WIRELESS_ACCESS_CONTROL);
    }
}

export enum SetFunction {
    LOGOUT = 16,
    REBOOT = 133
}

export enum GetFunction {
    GLOBAL_SETTINGS = 1,
    CM_SYSTEM_INFO = 2,
    STATUS = 5,
    DOWNSTREAM_TABLE = 10,
    UPSTREAM_TABLE = 11,
    SIGNAL_TABLE = 12,
    EVENT_LOG_TABLE = 13,
    LOGIN = 15,
    FIREWALL_LOG_TABLE = 19,
    LANG_LIST = 21,
    FAIL_COUNT = 22,
    LOGIN_TIMER = 24,
    LAN_SETTINGS = 100,
    DHCPV6INFO = 103,
    BASICDHCP = 105,
    WANSETTINGS = 107,
    IPV6FILTERING = 111,
    WEBFILTER = 115,
    IPV6WEBFILTER = 117,
    MACFILTERING = 119,
    FORWARDING = 121,
    LANUSERTABLE = 123,
    MTUSIZE = 134,
    CM_STATE = 136,
    WIRED_STATE = 137,
    CM_STATUS = 144,
    WIRELESS_BASIC = 300,
    WIRELESS_WMM = 302,
    WIRELESS_SITESURVEY = 305,
    WIRELESS_GUESTNETWORK = 307,
    CM_WIRELESSWPS = 309,
    WIRELESS_ACCESS_CONTROL = 311,
    WIRELESS_CHANNELMAP = 313,
    WIRELESS_BASIC_2 = 315,
    WIRELESS_GUEST_NETWORK = 317,
    WIRELESS_CLIENT = 322,
    CM_WIRELESSWPS_2 = 323,
    WIRELESS_DEFAULTVALUE = 324,
    WIRELESS_GSTRANDOMPASSWORD = 325,
    WIRELESS_STATE = 326,
    WIRELESS_RESETTING = 328,
    STATUS_2 = 500,
    DHCP = 501,
    QOSLIST = 502,
    MTA_EVENT_LOGS = 503,
    PROVIVSIONING = 504,
}
