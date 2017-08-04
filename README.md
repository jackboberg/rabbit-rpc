## @jackrabbit/rpc

[![version](https://img.shields.io/npm/v/@jackrabbit/rpc.svg?style=flat-square)][version]
[![build](https://img.shields.io/travis/jackboberg/rabbit-rpc/master.svg?style=flat-square)][build]
[![standard][standard-image]][standard-url]
[![license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE.md)

amqplib wrapper for easier rabbitmq scripting of RPC interface

### Install

`npm install @jackrabbit/rpc`

### Usage

#### `RabbitRPC(url, [options])`

The exported function takes the same parameters as [`amqplib.connect`][amqplib],
and returns a object with two exported functions, `client` and `server`.

#### `Client(queueName, data, done)`

Sends data to queue and yields reply.

```
const RPC = require('@modulus/rabbit-rpc')(url)

RPC.client('rpc-queue', { message: true }, (err, result) => {
  if (err) throw err

  console.log(`worker returned ${result}`)
})
```

#### `Server(queueName, worker, [capacity])`

Consumes messages on given queue and passes them to worker. When worker calls
done acknowledges the message and sends the result to the client.

```
const RPC = require('@modulus/rabbit-rpc')(url)

RPC.server('rpc-queue', (msg, done) => {
  // do work
  done(null, { result: true })
})
```

[amqplib]: http://www.squaremobius.net/amqp.node/channel_api.html#connect

[version]: https://www.npmjs.com/package/@jackrabbit/rpc
[build]: https://travis-ci.org/jackboberg/rabbit-rpc
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: http://npm.im/standard
