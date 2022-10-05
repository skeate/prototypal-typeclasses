import { match } from "ts-adt";

export const Functor = Symbol();

export interface TypeLambda {
  readonly params: unknown;
  readonly result: unknown;
}

export const Lambda = Symbol();
export type Lambda = typeof Lambda;

export const Map = Symbol();
export type Map = typeof Map;

export type Kind<F extends { [Lambda]: TypeLambda }, A> = (F[Lambda] & {
  params: A;
})["result"];

export interface Functor<F extends { [Lambda]: TypeLambda }> {
  [Lambda]: F[Lambda] & {
    readonly result: F[Lambda]["result"] & {
      // [Map]: <A, B>(f: (a: A) => B) => (fa: Kind<F, A>) => Kind<F, B>;
      [Map]: <A>(fa: Kind<F, A>) => <B>(f: (a: A) => B) => Kind<F, B>;
    };
  };
  // [Map]: <A, B>(f: (a: A) => B) => (fa: Kind<F, A>) => Kind<F, B>;
  [Map]: <A>(fa: Kind<F, A>) => <B>(f: (a: A) => B) => Kind<F, B>;
}

type Newable = NewableFunction & (abstract new (...args: any) => any);

export const functor = <F extends Newable>(
  f: F,
  def: Functor<InstanceType<F>>
) => {
  f.prototype[Functor] = def;
};

export const map =
  <F extends { _marker: unknown; [Lambda]: TypeLambda }, B>(f: (a: F['_marker']) => B) =>
  (fa: F & Functor<F>) : Kind<F, B>=>
    fa[Map](fa)(f);
