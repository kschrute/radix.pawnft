import React from 'react'

type Props = {
  data: Record<string, unknown>
}

export const Debug = ({ data }: Props) => (
  <div className="mt-10">
    <pre className="mt-10 text-left whitespace-pre-wrap" style={{ lineHeight: 1, whiteSpace: 'pre-wrap' }}>
      <small>{JSON.stringify(data, null, 2)}</small>
    </pre>
  </div>
)
