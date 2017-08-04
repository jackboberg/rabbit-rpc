const Lab = require('lab')
const { expect } = require('code')

const RabbitRPC = require('..')

const { describe, it } = exports.lab = Lab.script()

describe('RabbitRPC', () => {
  it('exports a function', (done) => {
    expect(RabbitRPC).to.be.a.function()
    done()
  })
})
