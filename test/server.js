const Lab = require('lab')
const Sinon = require('sinon')
const Util = require('util')
const { expect } = require('code')

const RabbitRPC = require('..')

const { before, beforeEach, describe, it } = exports.lab = Lab.script()

// eslint-disable-next-line no-process-env
const AMQP_HREF = process.env.AMQP_HREF || 'amqp://guest:guest@localhost'
const QUEUE = 'rpc-queue-server-test'

let rabbit, queue

before((done) => {
  rabbit = RabbitRPC(AMQP_HREF)
  done()
})

describe('RabbitRPC.server', () => {
  it('exports a function', (done) => {
    expect(rabbit.server).to.be.a.function()
    done()
  })

  describe('when client sends a message', () => {
    let message

    beforeEach((done) => {
      queue = Util.format('%s-message', QUEUE)
      message = { testMessage: true }

      rabbit.client(queue, message, Sinon.stub())
      done()
    })

    it('recieves the message', (done) => {
      rabbit.server(queue, (msg, cb) => {
        expect(msg).to.equal(message)
        cb(null, {})
        done()
      })
    })
  })

  it('supports setting capacity', { skip: true }, (done) => {
    expect(true).to.be.false()
    done()
  })
})
