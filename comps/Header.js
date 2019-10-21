import Link from 'next/link'
import Head from 'next/head'

const linkStyle = {
  marginRight: 15
}

export default function Header() {
  return (
    <div>
      <Head>
        <link rel="manifest" href="/public/manifest.json" />
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
