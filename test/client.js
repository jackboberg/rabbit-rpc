const Code = require('code')
const Lab = require('lab')
const Sinon = require('sinon')

const RabbitRPC = require('..')

var lab = exports.lab = Lab.script()

var afterEach = lab.afterEach
var before = lab.before
var beforeEach = lab.beforeEach
var describe = lab.describe
var it = lab.it
var expect = Code.expect

// eslint-disable-next-line no-process-env
const AMQP_HREF = process.env.AMQP_HREF || 'amqp://user:password@localhost'
const QUEUE = 'rpc-queue-client-test'

var rabbit, server

before(function (done) {
  server = Sinon.stub()
  rabbit = RabbitRPC(AMQP_HREF)

  rabbit.server(QUEUE, server)
  done()
})

describe('RabbitRPC.client', function () {
  var msg, result

  beforeEach(function (done) {
    msg = { testMessage: true }
    result = { testResult: true }
    server.yields(null, result)
    done()
  })

  afterEach(function (done) {
    server.reset()
    done()
  })

  it('exports a function', function (done) {
    expect(rabbit.client).to.be.a.function()
    done()
  })

  describe('when a server yields a result', function () {
    it('yields result', function (done) {
      rabbit.client(QUEUE, msg, function (err, res) {
        expect(err).to.not.exist()
        expect(res).to.equal(result)
        done()
      })
    })
  })

  describe('when a server yields an error', function () {
    var error

    beforeEach(function (done) {
      error = new Error('RPC.server Error')
      server.yields(error)
      done()
    })

    it('yields an error', function (done) {
      rabbit.client(QUEUE, msg, function (err, res) {
        expect(err).to.exist()
        expect(err.message).to.equal(error.message)
        expect(res).to.not.exist()
        done()
      })
    })
  })
})
