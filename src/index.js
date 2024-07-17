/**
 * SPDX-License-Identifier: MIT
 * @license MIT
 * @copyright commenthol
 */

import { usesProxy, shouldProxy } from 'uses-proxy'
import { HttpProxyAgent, HttpsProxyAgent } from 'hpagent'
import { got as _got } from 'got'

/**
 * @typedef {import('hpagent').HttpProxyAgentOptions | import('hpagent').HttpsProxyAgentOptions} ProxyAgentOptions
 * @typedef {{noProxy: string}} NoProxy
 * @typedef {ProxyAgentOptions & NoProxy} GotProxyOptions
 */
/**
 * @typedef {import('got').OptionsInit} OptionsInit
 * @typedef {import('got').GotRequestFunction} GotRequestFunction
 */

/**
 * @param {GotProxyOptions} [options]
 * @returns {GotRequestFunction}
 */
export const gotProxy = (options) => {
  const {
    noProxy: noProxyParam,
    proxy: proxyUriParam,
    ...others
  } = options || {}
  const {
    proxyUri, // proxy uri from https_proxy, http_proxy, ...
    noProxy: noProxyEnv // no_proxy env var content
  } = usesProxy()

  // allow overwrites from options
  const noProxy = noProxyParam || noProxyEnv
  const proxy = proxyUriParam || proxyUri

  let agentHttp
  let agentHttps
  if (proxy) {
    agentHttp = new HttpProxyAgent({ proxy, ...others })
    agentHttps = new HttpsProxyAgent({ proxy, ...others })
  }
  const matcher = shouldProxy({ proxyUri: proxy?.toString(), noProxy })

  /**
   * @param {string|URL} url
   * @param {OptionsInit} [options]
   */
  const got = (url, options) => {
    const _options = { ...options }
    let { hostname } = parseUrl(url)
    if (matcher(hostname)) {
      _options.agent = { https: agentHttps, http: agentHttp }
    }
    return _got(url, _options)
  }
  // @ts-expect-error
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
