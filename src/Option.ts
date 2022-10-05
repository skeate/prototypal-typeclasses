import { TypeLambda, Lambda, functor, Functor, map, Map } from "./Functor";
import { pipe } from "./pipe";

interface OptionLambda extends TypeLambda {
  readonly result: Option<this["params"]>;
}

export class Option<A> {
  private static None: Option<never>;

  readonly value:
    | { readonly _type: "some"; readonly value: A }
    | { readonly _type: "none" };

  static none = <A>() => new Option<A>();
  static some = <A>(a: A) => new Option<A>(a);

  constructor();
  constructor(a: A);
  constructor(a?: A) {
    if (arguments.length === 0) {
      if (!Option.None) {
        Option.None = this as unknown as Option<never>;
        this.value = { _type: "none" };
      }

      this.value = Option.None.value;

      return Option.None as unknown as Option<A>;
    }

    this.value = { _type: "some", value: arguments[0] };
  }
}

export interface Option<A> {
  _marker: A;
  [Lambda]: OptionLambda;
}

const none = new Option();
const some3 = new Option(3);

export interface Option<A> extends Functor<Option<A>> {}

const m1 = some3[Map];

m1(some3)(f => f.toLocaleString())

// const f = map(some3)(x => x.toLocaleString())

const test = pipe(
  some3,
  map((x) => x.toLocaleString())
);

functor(Option, {
  [Map]:
    <A, B>(f: (a: A) => B) =>
    (fa: Option<A>) => {
      return fa.value._type === "some"
        ? new Option<B>(f(fa.value.value))
        : Option.none<B>();
    },
});

const m = map((x: number) => x.toLocaleString() );
m(some3);
