import { match } from "ts-adt";

export const Functor = Symbol();

export interface TypeLambda {
  readonly params: unknown;
  readonly result: unknown;
}

export interface HKT {
  readonly typeLambda: TypeLambda;
  readonly result: unknown;
}

export const Lambda = Symbol();
export type Lambda = typeof Lambda;

export const Map = Symbol();
export type Map = typeof Map;

export type App<F extends TypeLambda, A> = (F & { params: A })["result"];

export interface Functor<F extends { [Lambda]: TypeLambda; _marker: unknown }> {
  [Map]: <A, B>(f: (a: A) => B) => (fa: App<F[Lambda], A>) => App<F[Lambda], B>;
}

type Newable = NewableFunction & (abstract new (...args: any) => any);

export const functor = <F extends Newable>(
  f: F,
  def: Functor<InstanceType<F>>
) => {
  f.prototype[Functor] = def;
};

export const map =
  <A, B>(f: (a: A) => B) =>
  <F extends { _marker: A; [Lambda]: TypeLambda } & Functor<F>>(
    fa: App<F[Lambda], A> & F
  ): App<F[Lambda], B> =>
    fa[Map](f);
