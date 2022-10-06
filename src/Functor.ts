import { Kind, Lambda, TypeConstructor, TypeLambda } from './TypeLambda'

export const Functor = Symbol()

export const Map = Symbol()
export type Map = typeof Map

export const MapParam = Symbol()
export type MapParam = typeof MapParam

export interface Functor<F extends { [Lambda]: TypeLambda }> {
  [Map]: <A, B>(f: (a: A) => B) => (fa: Kind<F, A>) => Kind<F, B>
}

export const functor = <F extends TypeConstructor>(
  f: F,
  def: Functor<InstanceType<F>>,
) => {
  f.prototype[Map] = def[Map]
}

export const map =
  <A, B, F extends { [Lambda]: TypeLambda; [MapParam]: A }>(
    f: (a: A & F[MapParam]) => B,
  ) =>
  (fa: F & Functor<F>): Kind<F, B> => {
    const m = Map
    return fa[Map](f)(fa)
  }

export const amap =
  <A, B, F extends { [Lambda]: TypeLambda; [MapParam]: A }>(
    f: (a: A & F[MapParam]) => B,
  ) =>
  <F2 extends F & Functor<F2>>(fa: F2): Kind<F2, B> =>
    fa[Map](f)(fa)
