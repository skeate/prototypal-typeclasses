import { map } from 'src/Functor'
import * as O from 'src/Option'
import { pipe } from 'src/pipe'

describe('Option', () => {
  it('has data constructors', () => {
    expect(O.none).toBeInstanceOf(O.Option)
    expect(O.some(3)).toBeInstanceOf(O.Option)
    expect(O.some('foo')).toBeInstanceOf(O.Option)
  })

  it('has a Functor instance', () => {
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
  })
})
