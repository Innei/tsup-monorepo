import { readFileSync } from 'fs'
// @ts-ignore
import { load } from 'js-yaml'
import { fetch } from 'zx'

type PromiseCaller<T = any> = () => Promise<T>
type ResolverCB<T = any> = (args: T | PromiseLike<T>) => void

class QueueItem<T> {
  constructor(
    protected caller: PromiseCaller<T>,
    protected resolve: ResolverCB<T>,
    protected reject: (reason: any) => void,
    protected complete: () => void,
  ) {}

  run() {
    this.caller()
      .then((val) => {
        this.resolve(val)
      })
      .catch((err) => {
        this.reject(err)
      })
      .then(() => {
        this.complete()
      })
  }
}

export class AsyncQueue<T = any> {
  protected waitingList: QueueItem<T>[] = []
  protected running = 0

  constructor(public concurrency: number) {}

  enqueue<T = any>(caller: () => Promise<T>): Promise<T> {
    const ret = new Promise<T>((resolve, reject) => {
      const item = new QueueItem<any>(caller, resolve, reject, () => {
        this.running--
        this.process()
      })
      this.waitingList.push(item)
    })

    this.process()

    return ret
  }

  get waitingcount() {
    return this.waitingList.length
  }

  protected process() {
    while (this.running < this.concurrency && this.waitingList.length > 0) {
      this.running++
      this.waitingList.shift()?.run()
    }
  }
}

const __dirname = import.meta.url
  .replace('file://', '')
  .split('/')
  .slice(0, -1)
  .join('/')

const lock = load(readFileSync(`${__dirname}/../pnpm-lock.yaml`))

const { dependencies, devDependencies, packages } = lock

const keys: string[] = []

for (const key in dependencies) {
  keys.push(key)
}

for (const key in devDependencies) {
  keys.push(key)
}

for (const key in packages) {
  const splitArray = key.split('/').filter(Boolean)
  if (splitArray[0][0] === '@') {
    keys.push(`${splitArray[0]}/${splitArray[1]}`)
  } else {
    keys.push(splitArray[0])
  }
}

const queue = new AsyncQueue(1)
async function main() {
  keys.forEach((name) => {
    queue.enqueue(() =>
      fetch(`http://npm.devops.xiaohongshu.com:7002/sync/${name}`, {
        method: 'PUT',
      }),
    )
  })
}

main()
