const Code = require('code')
const Lab = require('lab')

const RabbitRPC = require('..')

var lab = exports.lab = Lab.script()

var describe = lab.describe
var it = lab.it
var expect = Code.expect

describe('RabbitRPC', function () {
  it('exports a function', function (done) {
    expect(RabbitRPC).to.be.a.function()
    done()
  })
})
