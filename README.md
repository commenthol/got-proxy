# got-proxy

> proxy agent for got

A proxy agent for [got](https://github.com/sindresorhus/got) which considers
`http(s)_proxy` and `no_proxy` env-vars or settings. 

# usage

```
npm i got-proxy
```

## proxy settings in code

```js
import { gotProxy } from 'got-proxy'

const got = gotProxy({
  proxy: 'http://my-http.proxy',
  noProxy: 'localhost,.my.domain'
})

const res = await got('https://httpbin.org/anything')
```

## proxy settings via env vars

```
http_proxy=http://my-http.proxy
no_proxy=localhost,.my.domain
```

```js
import { gotProxy } from 'got-proxy'
const got = gotProxy()

const res = await got('https://httpbin.org/anything')
```


# license

MIT licensed
