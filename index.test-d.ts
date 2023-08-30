import { expectError, expectType } from 'tsd'
import monomitter, { Publisher, Subscriber, Clear } from '.'

// Should return a Publisher and a Subscriber
expectType<[Publisher<any>, Subscriber<any>, Clear]>(monomitter())

// Should propagate generic parameter to return tuple
expectType<[Publisher<[number, string]>, Subscriber<[number, string]>, Clear]>(
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

// Check Clear type
type ExpectedClear = () => void
expectType<ExpectedClear>(monomitter<[number, string]>()[2])

// Should only allow array types as generic
expectError(monomitter<number>())
