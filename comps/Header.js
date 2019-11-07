// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
        <link rel="preconnect" href="https://storage.googleapis.com" />
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
