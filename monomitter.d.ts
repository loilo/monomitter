declare type Publisher<T extends any[]> = (...values: T) => void
declare type Subscriber<T extends any[]> = (
  callback: (...values: T) => void
) => void

declare function monomitter<T extends any[]>(): [Publisher<T>, Subscriber<T>]

export { Publisher, Subscriber }
export default monomitter
