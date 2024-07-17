export function gotProxy(options?: GotProxyOptions | undefined): GotRequestFunction;
export type ProxyAgentOptions = import("hpagent").HttpProxyAgentOptions | import("hpagent").HttpsProxyAgentOptions;
export type NoProxy = {
    noProxy: string;
};
export type GotProxyOptions = ProxyAgentOptions & NoProxy;
export type OptionsInit = import("got").OptionsInit;
export type GotRequestFunction = import("got").GotRequestFunction;
