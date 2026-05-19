// Minimal opt-in realtime wrapper. Disabled by default via Vite env var `VITE_ENABLE_REALTIME`.
// If enabled, attempts to dynamically import `pusher-js` and `laravel-echo`.
// Exposes `initRealtime`, `subscribe`, and `unsubscribe` helpers that are safe no-ops when disabled.

type Channel = Record<string, unknown> | null

let echo: Record<string, unknown> | null = null

export const isRealtimeEnabled = () => Boolean(import.meta.env.VITE_ENABLE_REALTIME === 'true')

export async function initRealtime(options?: { key?: string; cluster?: string }): Promise<Record<string, unknown> | null> {
  if (!isRealtimeEnabled()) return null
  if (echo) return echo

  try {
    const [{ default: Pusher }, { default: Echo }] = await Promise.all([
      // dynamic import to avoid bundling if not used
      import('pusher-js'),
      import('laravel-echo'),
    ])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pusher = new (Pusher as any)(options?.key ?? import.meta.env.VITE_PUSHER_KEY, {
      cluster: options?.cluster ?? import.meta.env.VITE_PUSHER_CLUSTER,
      authEndpoint: '/broadcasting/auth',
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    echo = new (Echo as any)({ broadcaster: 'pusher', client: pusher })
    return echo
  } catch {
    // If packages aren't installed, just noop
    // console.warn('Realtime disabled or missing deps', err)
    echo = null
    return null
  }
}

export async function subscribe(channelName: string, event: string, cb: (payload: unknown) => void): Promise<Channel> {
  if (!isRealtimeEnabled()) return null
  const e = echo || (await initRealtime())
  if (!e) return null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const channel: Channel = (e as any).channel?.(channelName) || (e as any).private?.(channelName) || (e as any).join?.(channelName) || null
  if (!channel) return null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const listenFn = (channel as any).listen
  if (typeof listenFn === 'function') listenFn.call(channel, event, cb)
  return channel
}

export function unsubscribe(channel: Channel, event?: string): void {
  if (!channel) return
  try {
    if (typeof channel === 'object' && channel !== null) {
      if (event && 'stopListening' in channel) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (channel as any).stopListening(event)
      } else if ('unsubscribe' in channel) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (channel as any).unsubscribe()
      }
    }
  } catch {
    // ignore
  }
}

export default {
  initRealtime,
  subscribe,
  unsubscribe,
  isRealtimeEnabled,
}
