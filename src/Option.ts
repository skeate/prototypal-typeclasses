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
    (fa: Option<A>) => {
      return fa.value._type === 'some' ? new Option<B>(f(fa.value.value)) : none
    },
})

// #endregion
