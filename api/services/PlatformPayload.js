module.exports = function(platform, blocks) {
  var payload = {
    version: platform.version,
    blocks: {},
    variables: platform.variables,
  }

  return Promise.resolve().then(function() {
    return Promise.each(blocks, function(block) {
      return payload.blocks[block.slug] = {
        id: block.id,
        slug: block.slug,
        segments: block.payload,
        variables: block.variables
      }
    })
  }).then(function() {
    return payload
  })
}
