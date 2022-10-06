export interface TypeLambda {
  readonly params: unknown
  readonly result: unknown
}

export const Lambda = Symbol()
export type Lambda = typeof Lambda

export interface HKT {
  [Lambda]: TypeLambda
}

export type Kind<F extends HKT, A> = (F[Lambda] & {
  params: A
})['result']

export type TypeConstructor = abstract new (...args: any) => any
