/* eslint-env mocha */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect
const loadFixture = require('aegir/fixtures')

const UnixFS = require('../src')

const raw = loadFixture('test/fixtures/raw.unixfs')
const directory = loadFixture('test/fixtures/directory.unixfs')
const file = loadFixture('test/fixtures/file.txt.unixfs')
const symlink = loadFixture('test/fixtures/symlink.txt.unixfs')
const Buffer = require('safe-buffer').Buffer

describe('unixfs-format', () => {
  it('raw', () => {
    const data = new UnixFS('raw', Buffer.from('bananas'))
    const marshalled = data.marshal()
    const unmarshalled = UnixFS.unmarshal(marshalled)
    expect(data.type).to.equal(unmarshalled.type)
    expect(data.data).to.deep.equal(unmarshalled.data)
    expect(data.blockSizes).to.deep.equal(unmarshalled.blockSizes)
    expect(data.fileSize()).to.deep.equal(unmarshalled.fileSize())
  })

  it('directory', () => {
    const data = new UnixFS('directory')
    const marshalled = data.marshal()
    const unmarshalled = UnixFS.unmarshal(marshalled)
    expect(data.type).to.equal(unmarshalled.type)
    expect(data.data).to.deep.equal(unmarshalled.data)
    expect(data.blockSizes).to.deep.equal(unmarshalled.blockSizes)
    expect(data.fileSize()).to.deep.equal(unmarshalled.fileSize())
  })

  it('hamt-sharded-directory', () => {
    const data = new UnixFS('hamt-sharded-directory')
    const marshalled = data.marshal()
    const unmarshalled = UnixFS.unmarshal(marshalled)
    expect(data.type).to.equal(unmarshalled.type)
    expect(data.data).to.deep.equal(unmarshalled.data)
    expect(data.blockSizes).to.deep.equal(unmarshalled.blockSizes)
    expect(data.fileSize()).to.deep.equal(unmarshalled.fileSize())
  })

  it('file', () => {
    const data = new UnixFS('file', Buffer.from('batata'))
    const marshalled = data.marshal()
    const unmarshalled = UnixFS.unmarshal(marshalled)
    expect(data.type).to.equal(unmarshalled.type)
    expect(data.data).to.deep.equal(unmarshalled.data)
    expect(data.blockSizes).to.deep.equal(unmarshalled.blockSizes)
    expect(data.fileSize()).to.deep.equal(unmarshalled.fileSize())
  })

  it('file add blocksize', () => {
    const data = new UnixFS('file')
    data.addBlockSize(256)
    const marshalled = data.marshal()
    const unmarshalled = UnixFS.unmarshal(marshalled)
    expect(data.type).to.equal(unmarshalled.type)
    expect(data.data).to.deep.equal(unmarshalled.data)
    expect(data.blockSizes).to.deep.equal(unmarshalled.blockSizes)
    expect(data.fileSize()).to.deep.equal(unmarshalled.fileSize())
  })

  it('file add and remove blocksize', () => {
    const data = new UnixFS('file')
    data.addBlockSize(256)
    const marshalled = data.marshal()
    const unmarshalled = UnixFS.unmarshal(marshalled)
    expect(data.type).to.equal(unmarshalled.type)
    expect(data.data).to.deep.equal(unmarshalled.data)
    expect(data.blockSizes).to.deep.equal(unmarshalled.blockSizes)
    expect(data.fileSize()).to.deep.equal(unmarshalled.fileSize())
    unmarshalled.removeBlockSize(0)
    expect(data.blockSizes).to.not.deep.equal(unmarshalled.blockSizes)
  })

  it('default mode for files', () => {
    const data = new UnixFS('file')
    expect(data.mode).to.equal(parseInt('0644', 8))
    const marshalled = data.marshal()
    const unmarshalled = UnixFS.unmarshal(marshalled)
    expect(unmarshalled.mode).to.equal(parseInt('0644', 8))
  })

  it('default mode for directories', () => {
    const data = new UnixFS('directory')
    expect(data.mode).to.equal(parseInt('0755', 8))
    const marshalled = data.marshal()
    const unmarshalled = UnixFS.unmarshal(marshalled)
    expect(unmarshalled.mode).to.equal(parseInt('0755', 8))
  })

  it('default mode for hamt-sharded-directories', () => {
    const data = new UnixFS('hamt-sharded-directory')
    expect(data.mode).to.equal(parseInt('0755', 8))
    const marshalled = data.marshal()
    const unmarshalled = UnixFS.unmarshal(marshalled)
    expect(unmarshalled.mode).to.equal(parseInt('0755', 8))
  })

  it('mode', () => {
    const mode = parseInt('0555', 8)
    const data = new UnixFS('file')
    data.mode = mode
    const marshalled = data.marshal()
    const unmarshalled = UnixFS.unmarshal(marshalled)
    expect(unmarshalled.mode).to.equal(mode)
  })

  it('empty mode', () => {
    const mode = 0
    const data = new UnixFS('file')
    data.mode = mode
    const marshalled = data.marshal()
    const unmarshalled = UnixFS.unmarshal(marshalled)
    expect(unmarshalled.mode).to.equal(mode)
  })

  it('default file mode', () => {
    const data = new UnixFS('file')
    const marshalled = data.marshal()
    const unmarshalled = UnixFS.unmarshal(marshalled)
    expect(unmarshalled.mode).to.equal(parseInt('0644', 8))
  })

  it('default directory mode', () => {
    const data = new UnixFS('directory')
    const marshalled = data.marshal()
    const unmarshalled = UnixFS.unmarshal(marshalled)
    expect(unmarshalled.mode).to.equal(parseInt('0755', 8))
  })

  it('default hamt-sharded-directory mode', () => {
    const data = new UnixFS('directory')
    const marshalled = data.marshal()
    const unmarshalled = UnixFS.unmarshal(marshalled)
    expect(unmarshalled.mode).to.equal(parseInt('0755', 8))
  })

  it('mtime', () => {
    const mtime = parseInt(Date.now() / 1000)
    const data = new UnixFS('file')
    data.mtime = mtime
    const marshalled = data.marshal()
    const unmarshalled = UnixFS.unmarshal(marshalled)
    expect(unmarshalled.mtime).to.equal(mtime)
  })

  // figuring out what is this metadata for https://github.com/ipfs/js-ipfs-data-importing/issues/3#issuecomment-182336526
  it.skip('metadata', () => {})

  it('symlink', () => {
    const data = new UnixFS('symlink')
    const marshalled = data.marshal()
    const unmarshalled = UnixFS.unmarshal(marshalled)
    expect(data.type).to.equal(unmarshalled.type)
    expect(data.data).to.deep.equal(unmarshalled.data)
    expect(data.blockSizes).to.deep.equal(unmarshalled.blockSizes)
    expect(data.fileSize()).to.deep.equal(unmarshalled.fileSize())
  })
  it('wrong type', (done) => {
    let data
    try {
      data = new UnixFS('bananas')
    } catch (err) {
      expect(err).to.exist()
      expect(data).to.not.exist()
      done()
    }
  })

  describe('interop', () => {
    it('raw', () => {
      const unmarshalled = UnixFS.unmarshal(raw)
      expect(unmarshalled.data).to.eql(Buffer.from('Hello UnixFS\n'))
      expect(unmarshalled.type).to.equal('file')
      expect(unmarshalled.marshal()).to.deep.equal(raw)
    })

    it('directory', () => {
      const unmarshalled = UnixFS.unmarshal(directory)
      expect(unmarshalled.data).to.deep.equal(undefined)
      expect(unmarshalled.type).to.equal('directory')
      expect(unmarshalled.marshal()).to.deep.equal(directory)
    })

    it('file', () => {
      const unmarshalled = UnixFS.unmarshal(file)
      expect(unmarshalled.data).to.deep.equal(Buffer.from('Hello UnixFS\n'))
      expect(unmarshalled.type).to.equal('file')
      expect(unmarshalled.marshal()).to.deep.equal(file)
    })

    it.skip('metadata', () => {
    })

    it('symlink', () => {
      const unmarshalled = UnixFS.unmarshal(symlink)
      expect(unmarshalled.data).to.deep.equal(Buffer.from('file.txt'))
      expect(unmarshalled.type).to.equal('symlink')
      // TODO: waiting on https://github.com/ipfs/js-ipfs-data-importing/issues/3#issuecomment-182440079
      // expect(unmarshalled.marshal()).to.deep.equal(symlink)
    })
  })

  it('empty', () => {
    const data = new UnixFS('file')
    const marshalled = data.marshal()

    expect(marshalled).to.deep.equal(Buffer.from([0x08, 0x02, 0x18, 0x00]))
  })
})
