import { lift, map } from 'src/Functor'
import * as O from 'src/Option'
import { pipe } from 'src/pipe'
import { expectTypeOf } from 'expect-type'

describe('Option', () => {
  it('has data constructors', () => {
    expect(O.none).toBeInstanceOf(O.Option)
    expect(O.some(3)).toBeInstanceOf(O.Option)
    expect(O.some('foo')).toBeInstanceOf(O.Option)
  })

  describe('Functor instance', () => {
    it('maps in a pipe', () => {
      expect(
        pipe(
          O.some(3),
          map((x) => x.toLocaleString()),
        ),
      ).toEqual(O.some('3'))

      expect(
        pipe(
          O.some('quux'),
          map((x) => x.length),
        ),
      ).toEqual(O.some(4))

      expect(
        pipe(
          O.none as O.Option<number>,
          map((x) => x.toLocaleString()),
        ),
      ).toEqual(O.none)

      expectTypeOf(
        pipe(
          O.some('quux'),
          map((s) => s.length),
        ),
      ).toEqualTypeOf<O.Option<number>>()
    })

    it('lifts functions outside a pipe', () => {
      const lengthify = lift((s: string) => s.length)

      expect(lengthify(O.some('foo'))).toEqual(O.some(3))

      expectTypeOf(lengthify(O.some('foo'))).toEqualTypeOf<O.Option<number>>()
    })
  })
})
