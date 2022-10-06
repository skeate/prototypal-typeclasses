import { match } from 'ts-adt'

export const Functor = Symbol()

export interface TypeLambda {
  readonly params: unknown
  readonly result: unknown
}

export const Lambda = Symbol()
export type Lambda = typeof Lambda

export const Map = Symbol()
export type Map = typeof Map

export const MapParam = Symbol()
export type MapParam = typeof MapParam

export type Kind<F extends { [Lambda]: TypeLambda }, A> = (F[Lambda] & {
  params: A
})['result']

export interface Functor<F extends { [Lambda]: TypeLambda }> {
  [Map]: <A, B>(f: (a: A) => B) => (fa: Kind<F, A>) => Kind<F, B>
}

type Newable = NewableFunction & (abstract new (...args: any) => any)

export const functor = <F extends Newable>(
  f: F,
  def: Functor<InstanceType<F>>,
) => {
  f.prototype[Functor] = def
}

export const map =
  <A, B, F extends { [Lambda]: TypeLambda; [MapParam]: A }>(
    f: (a: A & F[MapParam]) => B,
  ) =>
  (fa: F & Functor<F>): Kind<F, B> =>
    fa[Map](f)(fa)

export const amap =
  <A, B, F extends { [Lambda]: TypeLambda; [MapParam]: A }>(
    f: (a: A & F[MapParam]) => B,
  ) =>
  <F2 extends F & Functor<F2>>(fa: F2): Kind<F2, B> =>
    fa[Map](f)(fa)
