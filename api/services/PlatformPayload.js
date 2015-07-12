module.exports = function(platform, blocks) {
  var payload = {
    version: platform.version + 1,
    deployedAt: new Date(),
    blocks: {},
    variables: platform.variables,
  }

  return Promise.resolve().then(function() {
    return Promise.each(blocks, function(block) {
      return payload.blocks[block.slug] = {
        title: block.title,
        slug: block.slug,
        payload: block.payload,
        variables: block.variables
      }
    })
  }).then(function() {
    return payload
  })
}
