type AsyncFnToObservable<T> =
  T extends (...args: infer A) => Promise<infer R>
    ? (...args: A) => Observable<R>
    : T;

export type GrpcToObservable<T> = {
  [K in keyof T]: AsyncFnToObservable<T[K]>;
};
