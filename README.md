## Rabbit-RPC

amqplib wrapper for easier rabbitmq scripting of RPC interface

### Install

`npm install @modulus/rabbit-rpc`

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
