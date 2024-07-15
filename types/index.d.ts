export function gotProxy(options?: GotProxyOptions | undefined): _got.GotFn;
export type ProxyAgentOptions = import("hpagent").HttpProxyAgentOptions | import("hpagent").HttpsProxyAgentOptions;
export type NoProxy = {
    noProxy: string;
};
export type GotProxyOptions = ProxyAgentOptions & NoProxy;
import _got from 'got';
