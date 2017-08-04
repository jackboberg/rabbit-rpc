const Code = require('code')
const Lab = require('lab')
const Sinon = require('sinon')
const Util = require('util')

const RabbitRPC = require('..')

var lab = exports.lab = Lab.script()

var before = lab.before
var beforeEach = lab.beforeEach
var describe = lab.describe
var it = lab.it
var expect = Code.expect

// eslint-disable-next-line no-process-env
const AMQP_HREF = process.env.AMQP_HREF || 'amqp://user:password@localhost'
const QUEUE = 'rpc-queue-server-test'

var rabbit, queue

before(function (done) {
  rabbit = RabbitRPC(AMQP_HREF)
  done()
})

describe('RabbitRPC.server', function () {
  it('exports a function', function (done) {
    expect(rabbit.server).to.be.a.function()
    done()
  })

  describe('when client sends a message', function () {
    var message

    beforeEach(function (done) {
      queue = Util.format('%s-message', QUEUE)
      message = { testMessage: true }

      rabbit.client(queue, message, Sinon.stub())
      done()
    })

    it('recieves the message', function (done) {
      rabbit.server(queue, function (msg, cb) {
        expect(msg).to.equal(message)
        cb(null, {})
        done()
      })
    })
  })

  it('supports setting capacity', { skip: true }, function (done) {
    expect(true).to.be.false()
    done()
  })
})
