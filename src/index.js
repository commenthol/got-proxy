/**
 * SPDX-License-Identifier: MIT
 * @license MIT
 * @copyright commenthol
 */

import { usesProxy, shouldProxy } from 'uses-proxy'
import { HttpProxyAgent, HttpsProxyAgent } from 'hpagent'
import _got from 'got'

/**
 * @typedef {import('hpagent').HttpProxyAgentOptions | import('hpagent').HttpsProxyAgentOptions} ProxyAgentOptions
 * @typedef {{noProxy: string}} NoProxy
 * @typedef {ProxyAgentOptions & NoProxy} GotProxyOptions
 */

/**
 * @param {GotProxyOptions} [options]
 * @returns {_got.GotFn}
 */
export const gotProxy = (options) => {
  const { noProxy: noProxy0, proxy: proxyUri0, ...others } = options || {}
  const {
    proxyUri, // proxy uri from https_proxy, http_proxy, ...
    noProxy: noProxy1 // no_proxy env var content
  } = usesProxy()

  // allow overwrites from options
  const noProxy = noProxy0 || noProxy1
  const proxy = proxyUri0 || proxyUri

  let agentHttp
  let agentHttps
  if (proxy) {
    agentHttp = new HttpProxyAgent({ proxy, ...others })
    agentHttps = new HttpsProxyAgent({ proxy, ...others })
  }
  const matcher = shouldProxy({ proxyUri: proxy?.toString(), noProxy })

  /**
   * @param {_got.GotUrl} url
   * @param {_got.GotJSONOptions|_got.GotFormOptions<string>|
   *  _got.GotFormOptions<null>|_got.GotBodyOptions<string>|
   *  _got.GotBodyOptions<null>} [options]
   * @returns {_got.GotPromise<any>}
   */
  const got = (url, options) => {
    const _options = { ...options }
    let { hostname } = parseUrl(url)
    if (matcher(hostname)) {
      // @ts-expect-error
      _options.agent = { https: agentHttps, http: agentHttp }
    }
    return _got(url, _options)
  }
  return got
}

/**
 * @throws
 * @param {string | URL | import('https').RequestOptions} url
 * @returns {{hostname: string, protocol: string}}
 */
const parseUrl = (url) => {
  if (url instanceof URL) {
    return url
  }
  if (typeof url === 'string') {
    return new URL(url)
  }
  if (typeof url === 'object') {
    // @ts-expect-error
    if (url.url) {
      // @ts-expect-error
      return new URL(url.url)
    }
  }
  throw new TypeError('not an url')
}
