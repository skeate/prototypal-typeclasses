# prototypal-typeclasses

This repository contains my experiments in bringing typeclass functionality to
Typescript.

## Compared to fp-ts

[fp-ts](https://github.com/gcanti/fp-ts) is another library that implements
typeclasses in Typescript. This is absolutely not[^yet] meant to be a competitor
to that library. This library[^lib] actually uses some of the same core ideas in
how higher-kinded types are encoded.

One major difference is that in `fp-ts` you must pass instances around, or use
instance functions imported from the relevant modules. For instance, if you want
to use `Functor`'s `map` function on an `Option`, you must
`import { map } from 'fp-ts/Option'`. If you want to `map` on some unknown
_thing_, then you must take the instance of `Functor` for that _thing_ as an
argument to the function; something like:

```ts
const add3InContext =
  <F>(F: Functor<F>) =>
  (fa: HKT<F, number>) =>
  F.map(fa, x => x + 3)
```

One of the goals of this library is to reduce that complexity. It does this by
extending prototypes, which is generally thought to be a Bad Idea[^extension].
For what it's worth, this library does avoid namespace collisions (which seems
to be the primary concern) by extending them with `Symbol`s which are, by
design, unique.

Because the implementations of typeclass functions exist on the prototype of
actual values, we can write functions which can run those implementations. So,
for example, the `Functor` module exports a `map` (and `lift`; see below)
function which can take as an argument _anything_ which has a `Functor` instance
defined. The above `add3InContext` can be rewritten:

```ts
const add3InContext = lift((x: number) => x + 3)
```

And, through some pretty gnarly type manipulation, it does this all with correct
types.

An arguable downside to this is that, since `fp-ts` requires you to _always_
pass in the instance you are using, that means it's actually remarkably easy to
use _different instances_ on a single data type. For instance, the `number`
module defines both [`MonoidProduct`] and [`MonoidSum`], so if you want to sum
or product a list of numbers, the only difference is the monoid you pass to
`foldMap`. In a language like Haskell, you can only have a single instance for a
particular data type, so the usual pattern is to use `newtype`s to provide
different instances.

Effectively that "make a `newtype`" pattern will be required with how this
library operates. Depending on the context, this is a minor inconvenience (if
even noticeable), while instance passing/module-specific implementations are
pervasive and actually make some patterns in Haskell needlessly
complicated/verbose to implement in `fp-ts`.


## Current status

Things that work:

- `Functor` module. For some reason, even though they're functionally the same
  thing, `map` and `lift` are separate exports because `map`'s type inference
  works in a `pipe` while `lift`'s works outside of one. :shrug:
- `Eq` module.
- `Number` module with `Eq` instance.
- `Option` module with `Functor` and `Eq` instances.
  - `Option` only has a valid `Eq` instance if the type contained inside _also_
    has an `Eq` instance -- this is also validated at the type level.

I fully expect to run into a wall eventually and find some particular (but
important) case where this whole system fails. Honestly I expected it to be that
constraint on `Option`'s `Eq` instance, but apparently Typescript can be made to
validate even that.


[^yet]: yet?
[^lib]: """library"""... there's barely anything here other than a proof of
    concept, at time of writing.
[^extension]: For more information about this, see [Inheritance and the
    prototype chain][IATPC], especially the first big red "**Warning**" box. 

[IATPC]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain
[`MonoidProduct`]:
    https://gcanti.github.io/fp-ts/modules/number.ts.html#monoidproduct
[`MonoidSum`]:
    https://gcanti.github.io/fp-ts/modules/number.ts.html#monoidsum
