import { Equals, Eq, eq, equals } from './Eq'

declare global {
  interface Number extends Eq<Number> {}
}

eq(Number)({
  [Equals]: (a) => (b) => a === b,
})

const x = 3

equals(3)(3)
