```ts
// basic use
xswr(['key1', 'key2'], async ({ queryKey }) => {
  await sleep(1000)
  return http.get(`https://example.com/api/${queryKey[0]}`)
}).then((data) => {
  // do thing
})

// in other scope do.. after 10ms
setTimeout(() => {
  xswr(['key1', 'key2'], async ({ queryKey }) => {
    // not do request again, because key is same and dedupe, skip
    return http.get(`https://example.com/api/${queryKey[0]}`)
  }).then((data) => {
    // do thing
  })
}, 10)
```

```ts
interface Query<TData extends unknown> {
  fetch(
    options?: QueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  ): Promise<TData>

  revalidate(): Promise<TData>

  mutate(
    options?: QueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  ): Promise<TData>
  revaliate(): Promise<TData>
}

const query: Query = queryStore.get(key)
query.revalidate()
```

```ts
const key = ['key1']
const query = queryStore.get(key)

const state = query.getState()
```

```ts
interface QueryStore extends Subscription {
  add(query: Query): void
  remove(query: Query): void
  get(queryKeyOrHashKey: QueryKey | string): Query
}
```

```ts
interface QueryState<TData = unknown, TError = unknown> {
  data: TData | undefined
  dataUpdateCount: number
  dataUpdatedAt: number
  error: TError | null
  errorUpdateCount: number
  errorUpdatedAt: number
  fetchFailureCount: number
  fetchFailureReason: TError | null
  fetchMeta: any
  isInvalidated: boolean
  status: 'loading' | 'error' | 'success' | 'revalidating'
  fetchStatus: 'fetching' | 'paused' | 'idle'
}
```

```ts
xswr(
  ['key'],
  async () => {
    return { data }
  },
  {
    retry: true,
    retryDelay: () => 0,
    onErrorRetry(err, failureCount) {
      // do thing.
      if (failureCount == 4) return true
    },
  },
)
```

```ts
interface QueryOptions<QueryFnData, TError, TData, TQueryKey> {
  retry?: ((failureCount: number, error: TError) => boolean) | boolean | number
  retryDelay?: (failureCount: number, error: TError) => number
  onErrorRetry?: (
    err: Error,
    key: TQueryKey,
    config: QueryOptions<QueryFnData, TError, TData, TQueryKey>,
  ) => boolean | void
}
```

```ts
interface QueryLifecycle {
  onLoadingSlow?: (
    key: TQueryKey,
    config: QueryOptions<QueryFnData, TError, TData, TQueryKey>,
    cancel: () => void,
    retry: () => void,
  ) => void

  onSuccess?: (
    data: TData,
    key: TQueryKey,
    config: QueryOptions<QueryFnData, TError, TData, TQueryKey>,
  ) => void | TData

  onError?: (
    err: Error,
    key: TQueryKey,
    config: QueryOptions<QueryFnData, TError, TData, TQueryKey>,
  ) => void

  onErrorRetry?: (
    err: Error,
    key: TQueryKey,
    config: QueryOptions<QueryFnData, TError, TData, TQueryKey>,
  ) => boolean | void

  onRevalidate?: (
    oldData: TData,
    key: TQueryKey,
    config: QueryOptions<QueryFnData, TError, TData, TQueryKey>,
  ) => void

  onPersist?: (data: TData) => void | Promise<void>
}
```
