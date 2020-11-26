/**
 * Create a publisher/subscriber function pair
 */
function monomitter() {
  const callbacks = new Set()

  return [
    (...args) => callbacks.forEach(callback => callback(...args)),
    callback => {
      callbacks.add(callback)
      return () => callbacks.delete(callback)
    }
  ]
}

export default monomitter
