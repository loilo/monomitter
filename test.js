const monomitter = require('./monomitter.umd')

test('returns an array of three functions', () => {
  const instance = monomitter()

  expect(instance).toHaveLength(3)
  expect(typeof instance[0]).toBe('function')
  expect(typeof instance[1]).toBe('function')
  expect(typeof instance[2]).toBe('function')
})

test('publishes data to subscriber', () => {
  const callback = jest.fn()
  const [pub, sub] = monomitter()

  pub('foo')
  sub(callback)
  pub('bar')

  expect(callback).toHaveBeenCalledTimes(1)
  expect(callback).toHaveBeenLastCalledWith('bar')
})

test('publishes multiple arguments', () => {
  const callback = jest.fn()
  const [pub, sub] = monomitter()

  sub(callback)
  pub('foo', 'bar', 'baz')

  expect(callback).toHaveBeenCalledTimes(1)
  expect(callback).toHaveBeenLastCalledWith('foo', 'bar', 'baz')
})

test('works with multiple subscribers', () => {
  const callback1 = jest.fn()
  const callback2 = jest.fn()
  const [pub, sub] = monomitter()

  sub(callback1)
  sub(callback2)
  pub('foo')

  expect(callback1).toHaveBeenCalledTimes(1)
  expect(callback1).toHaveBeenLastCalledWith('foo')
  expect(callback2).toHaveBeenCalledTimes(1)
  expect(callback2).toHaveBeenLastCalledWith('foo')
})

test('assigns the same listener only once', () => {
  const callback = jest.fn()
  const [pub, sub] = monomitter()

  sub(callback)
  sub(callback)
  pub('foo')

  expect(callback).toHaveBeenCalledTimes(1)
  expect(callback).toHaveBeenLastCalledWith('foo')
})

test('returns a working unsubscriber function', () => {
  const callback = jest.fn()
  const [pub, sub] = monomitter()

  const unsubscribe = sub(callback)
  pub('foo')
  pub('bar')
  unsubscribe()
  pub('baz')

  expect(callback).toHaveBeenCalledTimes(2)
  expect(callback).toHaveBeenNthCalledWith(1, 'foo')
  expect(callback).toHaveBeenNthCalledWith(2, 'bar')
})

test('leaves other subscribers unchanged on unsubscribing one', () => {
  const callback1 = jest.fn()
  const callback2 = jest.fn()
  const [pub, sub] = monomitter()

  const unsubscribe = sub(callback1)
  sub(callback2)

  pub('foo')
  unsubscribe()
  pub('bar')

  expect(callback1).toHaveBeenCalledTimes(1)
  expect(callback1).toHaveBeenLastCalledWith('foo')
  expect(callback2).toHaveBeenCalledTimes(2)
  expect(callback2).toHaveBeenNthCalledWith(1, 'foo')
  expect(callback2).toHaveBeenNthCalledWith(2, 'bar')
})

test('returns a working clear function', () => {
  const callback1 = jest.fn()
  const callback2 = jest.fn()
  const [pub, sub, clear] = monomitter()

  sub(callback1)
  sub(callback2)

  pub('foo')
  clear()
  pub('bar')

  expect(callback1).toHaveBeenCalledTimes(1)
  expect(callback1).toHaveBeenLastCalledWith('foo')
  expect(callback2).toHaveBeenCalledTimes(1)
  expect(callback2).toHaveBeenLastCalledWith('foo')
})
