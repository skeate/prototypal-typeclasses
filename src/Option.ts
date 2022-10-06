import { functor, Functor, map, Map, amap, MapParam } from './Functor'
import { TypeLambda, Lambda } from './TypeLambda'

interface OptionLambda extends TypeLambda {
  readonly result: Option<this['params']>
}

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

export interface Option<A> {
  [Lambda]: OptionLambda
}

export const none = new Option<never>()
export const some = <A>(a: A) => new Option<A>(a)

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
