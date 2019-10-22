import Link from 'next/link'
import Head from 'next/head'

const linkStyle = {
  marginRight: 15
}

export default function Header() {
  return (
    <div>
      <Head>
        <title>xd</title>

        <link rel="manifest" href="/static/manifest.json" />

        <link rel="apple-touch-icon" sizes="180x180" href="/static/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/static/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/static/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/static/favicon/site.webmanifest" />
        <link rel="mask-icon" href="/static/favicon/safari-pinned-tab.svg" color="#69c8a4" />
        <link rel="shortcut icon" href="/static/favicon/favicon.ico" />
        <meta name="msapplication-TileColor" content="#2b5797" />
        <meta name="msapplication-config" content="/static/favicon/browserconfig.xml" />
        <meta name="theme-color" content="#69c8a4" />

        <meta httpEquiv="origin-trial" content="AucV22yiUOQFnchsKcbTK0w6kW7pYxqgTZme6YoXqwsUT+ogAoTzzYybtcwTiya4RdmgvEIbeXJ9veB7N8TGSwkAAABTeyJvcmlnaW4iOiJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJmZWF0dXJlIjoiTmF0aXZlRmlsZVN5c3RlbSIsImV4cGlyeSI6MTU3NTMyODIzOX0=" />
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
