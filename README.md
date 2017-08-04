# @jackrabbit/rpc

[![npm][npm-image]][npm-url]
[![travis][travis-image]][travis-url]
[![standard][standard-image]][standard-url]
[![license][license-image]](LICENSE.md)

amqplib wrapper for easier rabbitmq scripting of RPC interface

## Install

`npm install @jackrabbit/rpc`

## Usage

### `rpc(url, [options])`

The exported function takes the same parameters as [`amqplib.connect`][amqplib],
and returns a object with two exported functions, `client` and `server`.

### `client(queueName, data, done)`

Sends data to queue and yields reply.

```js
const { client } = require('@jackrabbit/rpc')(url)

client('rpc-queue', { message: true }, (err, result) => {
  if (err) throw err

  console.log(`worker returned ${result}`)
})
```

### `server(queueName, worker, [capacity])`

Consumes messages on given queue and passes them to worker. When worker calls
done acknowledges the message and sends the result to the client.

```js
const { server } = require('@jackrabbit/rpc')(url)

server('rpc-queue', (msg, done) => {
  // do work
  done(null, { result: true })
})
```

## Development

The test suite requires access to a rabbitMQ instance. You can run a dockerized 
container before running the tests:

```sh
./test/bin/rabbit
npm t
```

[amqplib]: http://www.squaremobius.net/amqp.node/channel_api.html#connect

[npm-image]: https://img.shields.io/npm/v/@jackrabbit/rpc.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@jackrabbit/rpc
[travis-image]: https://img.shields.io/travis/jackboberg/rabbit-rpc.svg?style=flat-square
[travis-url]: https://travis-ci.org/jackboberg/rabbit-rpc
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: http://npm.im/standard
[license-image]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square
