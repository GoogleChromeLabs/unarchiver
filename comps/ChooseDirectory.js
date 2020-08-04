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

import {useState, useCallback} from 'react';

async function promptUserForDirectory(setDirectory) {
  try {
    let handle;
    if ('showDirectoryPicker' in window) {
      handle = await window.showDirectoryPicker();
    } else {
      handle = await window.chooseFileSystemEntries({type: 'open-directory'});
    }
    setDirectory(handle);
  } catch (e) {
    console.log(`ERROR: ${JSON.stringify(e.message)}`);
  }
}

export default function ChooseDirectory(props) {
  var setChosenDirectoryCallback = useCallback((directory) => {
    props.setChosenDirectory(directory);
  }, [props.setChosenDirectory]);
  return (
    <div id="chooseBox" className={props.chosenDirectory !== null ? "chosen" : ''}>
      <button onClick={() => promptUserForDirectory(setChosenDirectoryCallback)}>Then, choose an output folder</button>
      {props.chosenDirectory !== null ?
          <div id="directoryBox">Saving to: <span id="directoryName">{props.chosenDirectory.name}</span></div> :
          ""
      }
      <style jsx>{`
      #chooseBox {
        display: flex;
        flex-direction: row;
        padding: 5px;
        margin: 5px;
        background-color: #ffdddd;
        border-radius: 0.25em;
        min-height: 40px;
      }
      #chooseBox.chosen {
        background-color: #aaddaf;
      }
      button {
        font-size: 14px;
      }
      #directoryName {
        font-family: monospace;
      }
      #directoryBox {
        margin: 5px;
        flex-grow: 4;
        text-align: end;
        font-size: 18px;
      }
      `}</style>
    </div>
  )
}
