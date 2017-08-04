const Lab = require('lab')
const Sinon = require('sinon')
const { expect } = require('code')

const RabbitRPC = require('..')

const { afterEach, before, beforeEach, describe, it } = exports.lab = Lab.script()

// eslint-disable-next-line no-process-env
const AMQP_HREF = process.env.AMQP_HREF || 'amqp://guest:guest@localhost'
const QUEUE = 'rpc-queue-client-test'

let rabbit, server

before((done) => {
  server = Sinon.stub()
  rabbit = RabbitRPC(AMQP_HREF)

  rabbit.server(QUEUE, server)
  done()
})

describe('RabbitRPC.client', () => {
  let msg, result

  beforeEach((done) => {
    msg = { testMessage: true }
    result = { testResult: true }
    server.yields(null, result)
    done()
  })

  afterEach((done) => {
    server.reset()
    done()
  })

  it('exports a function', (done) => {
    expect(rabbit.client).to.be.a.function()
    done()
  })

  describe('when a server yields a result', () => {
    it('yields result', (done) => {
      rabbit.client(QUEUE, msg, (err, res) => {
        expect(err).to.not.exist()
        expect(res).to.equal(result)
        done()
      })
    })
  })

  describe('when a server yields an error', () => {
    let error

    beforeEach((done) => {
      error = new Error('RPC.server Error')
      server.yields(error)
      done()
    })

    it('yields an error', (done) => {
      rabbit.client(QUEUE, msg, (err, res) => {
        expect(err).to.exist()
        expect(err.message).to.equal(error.message)
        expect(res).to.not.exist()
        done()
      })
    })
  })
})
