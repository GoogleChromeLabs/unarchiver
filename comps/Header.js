import Link from 'next/link'
import Head from 'next/head'

const linkStyle = {
  marginRight: 15
}

export default function Header() {
  return (
    <div>
      <Head>
        <link rel="manifest" href="/static/manifest.json" />
        <meta http-equiv="origin-trial" content="AucV22yiUOQFnchsKcbTK0w6kW7pYxqgTZme6YoXqwsUT+ogAoTzzYybtcwTiya4RdmgvEIbeXJ9veB7N8TGSwkAAABTeyJvcmlnaW4iOiJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJmZWF0dXJlIjoiTmF0aXZlRmlsZVN5c3RlbSIsImV4cGlyeSI6MTU3NTMyODIzOX0=" />
      </Head>
      <Link href="/">
        <a style={linkStyle}>Home</a>
      </Link>
      <Link href="/about">
        <a style={linkStyle}>About</a>
      </Link>
    </div>
  )
}
