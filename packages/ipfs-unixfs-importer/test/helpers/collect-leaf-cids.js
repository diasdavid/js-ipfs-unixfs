'use strict'

module.exports = function (cid, ipld) {
  async function * traverse (cid) {
    const node = await ipld.get(cid)

    if (node instanceof Uint8Array || !node.Links.length) {
      yield {
        node,
        cid
      }

      return
    }

    node.Links.forEach(link => traverse(link.Hash))
  }

  return traverse(cid)
}
