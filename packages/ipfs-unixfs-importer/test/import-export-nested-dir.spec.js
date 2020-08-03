/* eslint-env mocha */
'use strict'

const { expect } = require('aegir/utils/chai')
const IPLD = require('ipld')
const inMemory = require('ipld-in-memory')
const all = require('it-all')
const importer = require('../src')
const exporter = require('ipfs-unixfs-exporter')
const blockApi = require('./helpers/block')
const uint8ArrayFromString = require('uint8arrays/from-string')
const uint8ArrayToString = require('uint8arrays/to-string')
const uint8ArrayConcat = require('uint8arrays/concat')

describe('import and export: directory', () => {
  const rootHash = 'QmdCrquDwd7RfZ6GCZFEVADwe8uyyw1YmF9mtAB7etDgmK'
  let ipld
  let block

  before(async () => {
    ipld = await inMemory(IPLD)
    block = blockApi(ipld)
  })

  it('imports', async function () {
    this.timeout(20 * 1000)

    const source = [{
      path: 'a/b/c/d/e',
      content: uint8ArrayFromString('banana')
    }, {
      path: 'a/b/c/d/f',
      content: uint8ArrayFromString('strawberry')
    }, {
      path: 'a/b/g',
      content: uint8ArrayFromString('ice')
    }, {
      path: 'a/b/h',
      content: uint8ArrayFromString('cream')
    }]

    const files = await all(importer(source, block))

    expect(files.map(normalizeNode).sort(byPath)).to.be.eql([{
      path: 'a/b/h',
      multihash: 'QmWHMpCtdNjemT2F3SjyrmnBXQXwEohaZd4apcbFBhbFRC'
    }, {
      path: 'a/b/g',
      multihash: 'QmQGwYzzTPcbqTiy2Nbp88gqqBqCWY4QZGfen45LFZkD5n'
    }, {
      path: 'a/b/c/d/f',
      multihash: 'QmNVHs2dy7AjGUotsubWVncRsD3SpRXm8MgmCCQTVdVACz'
    }, {
      path: 'a/b/c/d/e',
      multihash: 'QmYPbDKwc7oneCcEc6BcRSN5GXthTGWUCd19bTCyP9u3vH'
    }, {
      path: 'a/b/c/d',
      multihash: 'QmQGDXr3ysARM38n7h79Tx7yD3YxuzcnZ1naG71WMojPoj'
    }, {
      path: 'a/b/c',
      multihash: 'QmYTVcjYpN3hQLtJstCPE8hhEacAYjWAuTmmAAXoonamuE'
    }, {
      path: 'a/b',
      multihash: 'QmWyWYxq1GD9fEyckf5LrJv8hMW35CwfWwzDBp8bTw3NQj'
    }, {
      path: 'a',
      multihash: rootHash
    }])
  })

  it('exports', async function () {
    this.timeout(20 * 1000)

    const dir = await exporter(rootHash, ipld)
    const files = await recursiveExport(dir, rootHash)

    expect(files.sort(byPath)).to.eql([{
      path: 'QmdCrquDwd7RfZ6GCZFEVADwe8uyyw1YmF9mtAB7etDgmK/b/h',
      content: 'cream'
    }, {
      path: 'QmdCrquDwd7RfZ6GCZFEVADwe8uyyw1YmF9mtAB7etDgmK/b/g',
      content: 'ice'
    }, {
      path: 'QmdCrquDwd7RfZ6GCZFEVADwe8uyyw1YmF9mtAB7etDgmK/b/c/d/f',
      content: 'strawberry'
    }, {
      path: 'QmdCrquDwd7RfZ6GCZFEVADwe8uyyw1YmF9mtAB7etDgmK/b/c/d/e',
      content: 'banana'
    }])
  })
})

async function recursiveExport (node, path, entries = []) {
  for await (const entry of node.content()) {
    if (entry.unixfs.type === 'directory') {
      await recursiveExport(entry, `${path}/${entry.name}`, entries)
    } else {
      entries.push({
        path: `${path}/${entry.name}`,
        content: uint8ArrayToString(uint8ArrayConcat(await all(entry.content())))
      })
    }
  }

  return entries
}

function normalizeNode (node) {
  return {
    path: node.path,
    multihash: node.cid.toBaseEncodedString()
  }
}

function byPath (a, b) {
  if (a.path > b.path) return -1
  if (a.path < b.path) return 1
  return 0
}
