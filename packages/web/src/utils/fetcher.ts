// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export default async function fetcher<JSON = any>(input: RequestInfo, init?: RequestInit): Promise<JSON> {
  const res = await fetch(input, init)
  return res.json()
}
