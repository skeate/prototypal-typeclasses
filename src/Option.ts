import { eq, Eq, equals, Equals } from './Eq'
import { functor, Functor, Map, MapParam } from './Functor'
import { TypeLambda, Lambda, HKT } from './TypeLambda'

export class Option<A> {
  readonly value:
    | { readonly _type: 'some'; readonly value: A }
    | { readonly _type: 'none' }

  constructor()
  constructor(a: A)
  constructor(a?: A) {
    if (arguments.length === 0) {
      this.value = { _type: 'none' }
    } else {
      this.value = { _type: 'some', value: arguments[0] }
    }
  }
}

interface OptionLambda extends TypeLambda {
  readonly result: Option<this['params']>
}

export interface Option<A> extends HKT {
  [Lambda]: OptionLambda
}

export const none = new Option<never>()
export const some = <A>(a: A) => new Option<A>(a)

// #region Functor instance

export interface Option<A> extends Functor<Option<A>> {
  [MapParam]: A
}

functor(Option, {
  [Map]:
    <A, B>(f: (a: A) => B) =>
    (fa: Option<A>) =>
      fa.value._type === 'some'
        ? new Option<B>(f(fa.value.value))
        : (none as unknown as Option<B>),
})

// #endregion

// #region Eq instance

interface A_Has_Eq extends TypeLambda {
  readonly result: this['params'] extends Option<infer A>
    ? Option<Eq<A>>
    : never
}

export interface Option<A> extends Eq<Option<A>, A_Has_Eq> {}

eq(Option)<A_Has_Eq>({
  [Equals]: (a) => (b) =>
    a.value._type === 'some'
      ? b.value._type === 'some' && equals(a.value.value)(b.value.value)
      : b.value._type === 'none',
})

// #endregion
