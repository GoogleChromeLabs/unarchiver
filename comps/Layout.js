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

import Header from './Header'

const layoutStyle = {
  margin: 20,
  padding: 20,
  border: '1px solid #DDD'
}

export default function Layout(props) {
  // Feature detection.
  // For server-side rendering, window is not defined.
  if (typeof window !== 'undefined' && !('showOpenFilePicker' in window || 'chooseFileSystemEntries' in window)) {
    let chromeLink = '';
    if (window.chrome) {
      chromeLink = (
        <div>
          Please enable the flag on the chrome://flags/#native-file-system-api page.
        </div>
      );
    }
    return (
      <div style={layoutStyle}>
        <Header />
        <div>
          <a href="https://wicg.github.io/native-file-system/">
            Native File System API not supported
          </a>
        </div>
        {chromeLink}
      </div>
    );
  }

  return (
    <div style={layoutStyle}>
      <Header />
      {props.children}
      <style jsx>{`
        div,a,button,span {
          font-family: 'Roboto',arial,sans-serif;
        }
      `}</style>
    </div>
  )
}
