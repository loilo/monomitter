declare type Publisher<T extends any[]> = (...values: T) => void
declare type Unsubscriber = () => void
declare type Subscriber<T extends any[]> = (
  callback: (...values: T) => void
) => Unsubscriber

declare function monomitter<T extends any[]>(): [Publisher<T>, Subscriber<T>]

export { Publisher, Subscriber, Unsubscriber }
export default monomitter
