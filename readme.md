# @xhs/xswr


demo code:

```ts
const key = ['goods', id]
await xswr(key, async ({ key }) => {
   const [, id] = key
   return http.get(`/api/goods/${id}`)
})
```

```ts
xswr(['fetchGoods', itemId, { source, xhsGS }], async ({ queryKey }) => {
    const [, itemId, params] = queryKey
    getApiStoreJpdMainByItemIdPrimary({
        params,
        resourceParams: {
            itemId
        }
    })
})

```