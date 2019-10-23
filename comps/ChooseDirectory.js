import {useState, useCallback} from 'react';

async function promptUserForDirectory(setDirectory) {
  try {
    const handle = await window.chooseFileSystemEntries({type: 'openDirectory'});
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
      <button onClick={() => promptUserForDirectory(setChosenDirectoryCallback)}>Choose output folder</button>
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
