/* eslint-env mocha */
'use strict'

const { expect } = require('aegir/utils/chai')
// @ts-ignore
const IPLD = require('ipld')
// @ts-ignore
const inMemory = require('ipld-in-memory')
const builder = require('../src/dag-builder')
const all = require('it-all')
const blockApi = require('./helpers/block')
const defaultOptions = require('../src/options')

describe('builder: onlyHash', () => {
  /** @type {import('./helpers/block').IPLDResolver} */
  let ipld
  /** @type {import('../src').BlockAPI} */
  let block

  before(async () => {
    ipld = await inMemory(IPLD)
    block = blockApi(ipld)
  })

  it('will only chunk and hash if passed an "onlyHash" option', async () => {
    const nodes = await all(builder([{
      path: 'foo.txt',
      content: Uint8Array.from([0, 1, 2, 3, 4])
    }], block, {
      ...defaultOptions({}),
      onlyHash: true
    }))

    expect(nodes.length).to.equal(1)

    try {
      await ipld.get((await nodes[0]()).cid)

      throw new Error('Should have errored')
    } catch (err) {
      expect(err.code).to.equal('ERR_NOT_FOUND')
    }
  })
})
