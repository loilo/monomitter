<div align="center">
  <br>
  <br>

![monomitter logo showing a radio station symbol](logo.svg)

# monomitter

  <br>
</div>

[![Tests](https://badgen.net/github/checks/loilo/monomitter/master)](https://github.com/loilo/monomitter/actions)
[![Version on npm](https://badgen.net/npm/v/monomitter)](https://www.npmjs.com/package/monomitter)

The monomitter is a tiny (125 bytes minzipped), generic notification helper — a kind of topic-free pub/sub mechanism or a single-event event bus — designed to be used as a building block for reactive functionality..

## Basic Usage

```js
import monomitter from 'monomitter'

// create a monomitter pub/sub pair
const [publish, subscribe] = monomitter()

// log payload on publish
subscribe((...payload) => {
  console.log(payload)
})

publish(1, 2, 3) // logs [1, 2, 3]
publish('Hello world!') // logs ["Hello world!"]
```

### Unsubscribe

The subscribe function returns a callback to be used for unsubscribing:

```js
import monomitter from 'monomitter'

const [publish, subscribe] = monomitter()

// subscribe and get unsubscribe callback
const stop = subscribe((...payload) => {
  console.log(payload)
})

publish(1, 2, 3) // logs [1, 2, 3]

// unsubscribe
stop()

publish(42) // does not log
```

### Clear All Subscribers

The `monomitter` function returns a third item, a "clear-all" callback:

```js
import monomitter from 'monomitter'

const [publish, subscribe, clear] = monomitter()

// subscribe and get unsubscribe callback
subscribe(() => {
  console.log('hi from subscriber 1')
})
subscribe(() => {
  console.log('hi from subscriber 2')
})

publish(1, 2, 3) // logs "hi from subscriber 1" and "hi from subscriber 2"

// clear all subscribers
clear()

publish(42) // does not log
```

## Examples

monomitter is suitable for a variety of notification-related tasks. Here are some examples:

### Observable

Create a watchable value wrapper:

```js
import monomitter from 'monomitter'

// Implementation

function observable(inititalValue) {
  let currentValue = inititalValue

  const [notify, watch] = monomitter()

  return {
    watch,
    get: () => currentValue,
    set: newValue => {
      if (newValue !== currentValue) {
        const oldValue = currentValue
        currentValue = newValue
        notify(newValue, oldValue)
      }
    }
  }
}

// Usage

const value = observable(5)
value.watch((newValue, oldValue) => {
  console.log('Changed from %o to %o', oldValue, newValue)
})
value.get() // returns 5
value.set(10) // logs "Changed from 5 to 10"
value.get() // returns 10
```

### Signaling

Create a controller with a signal (not unlike the [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)):

```js
import monomitter from 'monomitter'

// Implementation

function Signal(subscribe) {
  this.addListener = subscribe
}

function SignalController() {
  const [publish, subscribe] = monomitter()
  this.trigger = publish
  this.signal = new Signal(subscribe)
}

// Usage

const controller = new SignalController()

// Pass the controller.signal to a consumer who may be interested
controller.signal.addListener(() => {
  console.log('Got a signal!')
})

// Trigger the signal
controller.trigger() // logs "Got a signal!"
```

## Event Emitter

It's even possible to build a fully-fledged event emitter with this. (But why would you if there's [mitt](https://npmjs.com/package/mitt) — this example is very much just a proof of concept.)

```js
import monomitter from 'monomitter'

// Implementation

class EventEmitter {
  constructor() {
    this.eventData = new Map()
  }

  getEventData(event) {
    if (!this.eventData.has(event)) {
      const [emit, listen] = monomitter()
      this.eventData.set(event, {
        emit,
        listen,
        unsubscribers: new WeakMap()
      })
    }

    return this.eventData.get(event)
  }

  on(event, callback) {
    const eventData = this.getEventData(event)
    const unsubscriber = eventData.listen(callback)
    eventData.unsubscribers.set(callback, unsubscriber)
  }

  once(event, callback) {
    const eventData = this.getEventData(event)
    const unsubscriber = eventData.listen((...args) => {
      callback(...args)
      unsubscriber()
    })
    eventData.unsubscribers.set(callback, unsubscriber)
  }

  off(event, callback) {
    this.getEventData(event).unsubscribers.get(callback)?.()
  }

  emit(event, ...payload) {
    this.getEventData(event).emit(...payload)
  }
}

// Usage

const ee = new EventEmitter()

ee.on('load', function onload() {
  console.log('load!')
})
ee.once('load', function onloadOnce() {
  console.log('load once!')
})

ee.emit('load') // logs "load!" and "load once!"
ee.emit('load') // logs "load!"

ee.off('load', onload)

ee.emit('load') // does not log
```
