export interface TypeLambda {
  readonly params: unknown
  readonly result: unknown
}

export const Lambda = Symbol()
export type Lambda = typeof Lambda

export type Kind<F extends { [Lambda]: TypeLambda }, A> = (F[Lambda] & {
  params: A
})['result']

export type TypeConstructor = abstract new (...args: any) => any
