import { HKT, Kind, Lambda, TypeConstructor, TypeLambda } from './TypeLambda'

export const Functor = Symbol()

export const Map = Symbol()
export type Map = typeof Map

export const MapParam = Symbol()
export type MapParam = typeof MapParam

export interface Functor<F extends HKT> {
  [Map]: <A, B>(f: (a: A) => B) => (fa: Kind<F, A>) => Kind<F, B>
}

export const functor = <F extends TypeConstructor>(
  f: F,
  def: Functor<InstanceType<F>>,
) => {
  f.prototype[Map] = def[Map]
}

/**
 * Pipeable map
 */
export const map =
  <A, B, F extends HKT & { [MapParam]: A }>(f: (a: A & F[MapParam]) => B) =>
  (fa: F & Functor<F>): Kind<F, B> =>
    fa[Map](f)(fa)

/**
 * `map` works great in pipes, like:
 *
 *     pipe(
 *       O.some('foo'),
 *       map(s => s.length),
 *     )
 *
 * However, if you want to to lift a function `a -> b` so it becomes `f a -> f b`, like
 *
 *     const lengthify = map((s: string) => s.length)
 *     const olength = lengthify(O.some('foo'))
 *
 * then the type checking fails. `lift` is a version of `map` with slightly tweaked types
 * that support this, so this typechecks properly:
 *
 *     const lengthify = lift((s: string) => s.length)
 *     const olength = lengthify(O.some('foo'))
 */
export const lift =
  <A, B, F extends HKT & { [MapParam]: A }>(f: (a: A & F[MapParam]) => B) =>
  <F2 extends F & Functor<F2>>(fa: F2): Kind<F2, B> =>
    fa[Map](f)(fa)
