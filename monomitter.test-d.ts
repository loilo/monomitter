import { expectError, expectType } from 'tsd'
import monomitter, { Publisher, Subscriber } from './monomitter'

// Should return a Publisher and a Subscriber
expectType<[Publisher<any>, Subscriber<any>]>(monomitter())

// Should propagate generic parameter to return tuple
expectType<[Publisher<[number, string]>, Subscriber<[number, string]>]>(
  monomitter<[number, string]>()
)

// Check Publisher type
type ExpectedPublisher = (...args: [number, string]) => void
expectType<ExpectedPublisher>(monomitter<[number, string]>()[0])

// Check Subscriber type
type ExpectedSubscriber = (
  callback: (...args: [number, string]) => void
) => () => void
expectType<ExpectedSubscriber>(monomitter<[number, string]>()[1])

// Should only allow array types as generic
expectError(monomitter<number>())
