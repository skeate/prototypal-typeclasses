export interface TypeLambda {
  readonly params: unknown
  readonly result: unknown
}

export const Lambda = Symbol()
export type Lambda = typeof Lambda

export interface HKT {
  [Lambda]: TypeLambda
}

export type Apply<F extends TypeLambda, A> = (F & { params: A })['result']

export type Kind<F extends HKT, A> = (F[Lambda] & {
  params: A
})['result']

export type TypeConstructor = abstract new (...args: any) => any

export interface Unconstrained extends TypeLambda {
  readonly result: this['params']
}
