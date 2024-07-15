import assert from 'assert'
import { gotProxy } from '../src/index.js'
import { buildProxy } from './support/proxy.js'

const itEnv = (envvar) => (envvar ? it : it.skip)
itEnv.only = (envvar) => (envvar ? it.only : it.skip)
itEnv.skip = () => it.skip

const { http_proxy: HTTP_PROXY, no_proxy: NO_PROXY } = process.env

describe('proxy', function () {
  const url = 'http://httpbin.org/anything'

  let proxyServer
  let proxyUri
  before(async function () {
    proxyServer = await buildProxy(process.env.PORT)
    proxyUri = `http://localhost:${proxyServer.address().port}`
  })
  after(function () {
    proxyServer.close()
  })
  beforeEach(function () {
    proxyServer._requests = 0
    proxyServer._connects = 0
  })

  itEnv(!NO_PROXY)('shall proxy request', async function () {
    const got = gotProxy({ proxy: proxyUri })
    const res = await got(url, { retry: { limit: 0 }, responseType: 'json' })
    assert.equal(res.statusCode, 200)
    assert.equal(proxyServer._connects, 1)
  })

  itEnv(!NO_PROXY)('shall proxy request using url.url', async function () {
    const got = gotProxy({ proxy: proxyUri })
    const res = await got({ url, retry: { limit: 0 }, responseType: 'json' })
    assert.equal(res.statusCode, 200)
    assert.equal(proxyServer._connects, 1)
  })
  it('shall not proxy request', async function () {
    const got = gotProxy({ proxy: proxyUri, noProxy: 'httpbin.org,localhost' })
    const res = await got(new URL(url))
    assert.equal(res.statusCode, 200)
    assert.equal(proxyServer._connects, 0)
  })

  it('throws if not an url', async function () {
    const got = gotProxy()
    try {
      await got()
      throw new Error()
    } catch (err) {
      assert.deepEqual(err, new TypeError('not an url'))
    }
  })

  itEnv(HTTP_PROXY && !NO_PROXY)(
    'shall proxy request from http_proxy env var',
    async function () {
      const got = gotProxy()
      const res = await got(url, { retry: { limit: 0 } })
      assert.equal(res.statusCode, 200)
      assert.equal(proxyServer._connects, 1)
    }
  )

  itEnv(HTTP_PROXY && NO_PROXY)(
    'shall not proxy request from http_proxy and no_proxy env var',
    async function () {
      const got = gotProxy()
      const res = await got(url)
      assert.equal(res.statusCode, 200)
      assert.equal(proxyServer._connects, 0)
    }
  )
})
