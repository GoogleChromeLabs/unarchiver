import Link from 'next/link'
import Head from 'next/head'

const linkStyle = {
  marginRight: 15
}

const OriginTrials = [
  // http://localhost:3000
  "AucV22yiUOQFnchsKcbTK0w6kW7pYxqgTZme6YoXqwsUT+ogAoTzzYybtcwTiya4RdmgvEIbeXJ9veB7N8TGSwkAAABTeyJvcmlnaW4iOiJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJmZWF0dXJlIjoiTmF0aXZlRmlsZVN5c3RlbSIsImV4cGlyeSI6MTU3NTMyODIzOX0=",

  // https://charging-penguin.appspot.com
  "AilpfnXIrOFTRsL8OTDbxBxka0FR7IbGkvX0bujj69NMOeFfiyX/9oTysIu0oZyyYPxSTizdaY/26qvqHe6PHgMAAAB5eyJvcmlnaW4iOiJodHRwczovL2NoYXJnaW5nLXBlbmd1aW4uYXBwc3BvdC5jb206NDQzIiwiZmVhdHVyZSI6Ik5hdGl2ZUZpbGVTeXN0ZW0iLCJleHBpcnkiOjE1NzU0ODUzMTMsImlzU3ViZG9tYWluIjp0cnVlfQ==",
];

export default function Header() {
  return (
    <div>
      <Head>
        <title>xd</title>

        <meta name="Description" content="Explosive Decompression pwa unarchiver" />

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

        <meta httpEquiv="origin-trial" content={OriginTrials[0]} key="0" />
        <meta httpEquiv="origin-trial" content={OriginTrials[1]} key="1" />
      </Head>
    </div>
  )
}
