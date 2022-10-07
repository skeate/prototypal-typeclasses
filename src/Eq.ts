import {
  Apply,
  Kind,
  TypeConstructor,
  TypeLambda,
  Unconstrained,
} from './TypeLambda'

export const Equals = Symbol()
export type Equals = typeof Equals

export interface Eq<A, Constraints extends TypeLambda = Unconstrained> {
  [Equals]: (a: Apply<Constraints, A>) => (b: Apply<Constraints, A>) => boolean
}

export const equals = <A extends Eq<A>>(a: A) => a[Equals](a)

export const eq =
  <F extends TypeConstructor>(f: F) =>
  <Constraints extends TypeLambda = Unconstrained>(
    def: Eq<InstanceType<F>, Constraints>,
  ) => {
    f.prototype[Equals] = def[Equals]
  }
