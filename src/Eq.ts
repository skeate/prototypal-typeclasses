import { TypeConstructor } from './TypeLambda'

export const Equals = Symbol()
export type Equals = typeof Equals

export interface Eq<A> {
  [Equals]: (a: A) => (b: A) => boolean
}

export const equals = <A extends Eq<A>>(a: A) => a[Equals](a)

export const eq = <F extends TypeConstructor>(
  f: F,
  equal: (a: InstanceType<F>) => (b: InstanceType<F>) => boolean,
) => {
  f.prototype[Equals] = equal
}
