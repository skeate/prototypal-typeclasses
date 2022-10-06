import {
  TypeLambda,
  Lambda,
  functor,
  Functor,
  map,
  Map,
  amap,
  MapParam,
} from './Functor'
import { pipe } from './pipe'

interface OptionLambda extends TypeLambda {
  readonly result: Option<this['params']>
}

export class Option<A> {
  private static None: Option<never>

  readonly value:
    | { readonly _type: 'some'; readonly value: A }
    | { readonly _type: 'none' }

  static none = <A>() => new Option<A>()
  static some = <A>(a: A) => new Option<A>(a)

  constructor()
  constructor(a: A)
  constructor(a?: A) {
    if (arguments.length === 0) {
      if (!Option.None) {
        Option.None = this as unknown as Option<never>
        this.value = { _type: 'none' }
      }

      this.value = Option.None.value

      return Option.None as unknown as Option<A>
    }

    this.value = { _type: 'some', value: arguments[0] }
  }
}

export interface Option<A> {
  [Lambda]: OptionLambda
}

export const none = Option.none<never>()
export const some = Option.some

const some3 = new Option(3)

export interface Option<A> extends Functor<Option<A>> {
  [MapParam]: A
}

functor(Option, {
  [Map]:
    <A, B>(f: (a: A) => B) =>
    (fa: Option<A>) => {
      return fa.value._type === 'some'
        ? new Option<B>(f(fa.value.value))
        : Option.none<B>()
    },
})

// const f = map(some3)(x => x.toLocaleString())
declare const expect: (x: Option<string>) => void

const test = pipe(
  some3,
  map((x) => x.toLocaleString()),
)
expect(test)

const m = amap((x: number) => x.toLocaleString())
const r = m(some3)
expect(r)
