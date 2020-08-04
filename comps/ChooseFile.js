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

import {useCallback, useEffect} from 'react';
import {useDropzone} from 'react-dropzone';

const compStyle = {
  display: 'flex',
  flexDirection: 'column',
}

export default function ChooseFile(props) {
  const onDrop = useCallback((acceptedFiles) => {
    props.setChosenFile(acceptedFiles[0]);
  }, [props.setChosenFile]);

  const {getRootProps, getInputProps, isDragActive, open, acceptedFiles} =
      useDropzone({multiple: false, onDrop});

  // The contents of the drop zone changes based on if a file is selected or
  // not.  props.inputFile is null if no file has been selected.
  // Because |multiple| is set to false above, props.inputFile is undefined
  // if multiple files are dropped.
  let dropZoneContents;
  if (!props.inputFile) {
    // It'd be nice to maybe set the status box here, but that creates an
    // infinite loop of updating effects? Instead, just change the text.
    dropZoneContents =
        <div>
          First, drop the {props.inputFile === undefined ? '(single) ' : ''} compressed file here!
          <div style={{fontSize: 18, textDecoration: 'underline'}}>(or click here to manually select)</div>
        </div>;
  } else {
    dropZoneContents =
        <div>Extracting from: <span style={{fontFamily: 'monospace'}}>{props.inputFile.name}</span></div>;
  }

  useEffect(() => {
    async function handleDrop() {
      if (!window.launchParams ||
          !window.launchParams.files ||
          !window.launchParams.files.length) {
          return;
      }
      let files = [];
      async function getFiles() {
        for (let file of window.launchParams.files)
          files.push('getFile' in file ? await file.getFile() : await file.getFileHandle());
      }
      await getFiles();
      onDrop(files);
    }
    handleDrop();
  }, []);

  return (
    <div style={compStyle}>
      <div {...getRootProps()}
          className={"dropZone" + (isDragActive ? "  dragActive" : "") +
                                  (props.inputFile ? " fileSelected" : "") +
                                  (props.isSupported ? " isSupported" : "")}>
        <input {...getInputProps()}/>
        {dropZoneContents}
      </div>
      <style jsx>{`
        .dropZone {
          margin: 5px;
          padding: 5px;
          font-size: 24px;
          text-align: center;
          border: dashed 3px #bbbbbb;
          background-color: #ffdddd;
          border-radius: 0.25em;
          cursor: pointer;
          min-height: 60px;
        }
        .dropZone.fileSelected {
          border: none;
          min-height: 46px;
          padding-top: 25px;
        }
        .dropZone.fileSelected.isSupported {
          background-color: #aaddaf;
        }
        .dropZone.dragActive {
          border: dashed 3px #888888;
          background-color: #aaaadd;
          cursor: grabbing;
        }
      `}</style>
    </div>
  );
}
