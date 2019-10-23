import {useCallback, useState, useEffect} from 'react';
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
  // not.
  let dropZoneContents;
  if (props.inputFile === null) {
    dropZoneContents =
        <div>
          First, drop the compressed file here!
          <div style={{fontSize: 18, textDecoration: 'underline'}}>(or click here to manually select)</div>
        </div>;
  } else {
    dropZoneContents =
        <div>Extracting from: <span style={{fontFamily: 'monospace'}}>{props.inputFile.name}</span></div>;
  }

  useEffect(() => {
      if (!window.launchParams ||
          !window.launchParams.files ||
          !window.launchParams.files.length) {
          return;
      }
      let files = [];
      async function getFiles() {
        for (let file of window.launchParams.files)
            files.push(await file.getFile());
      }
      getFiles();
      onDrop(files);
  }, []);

  return (
    <div style={compStyle}>
      <div {...getRootProps()}
          className={"dropZone" + (isDragActive ? "  dragActive" : "") +
                                  (props.inputFile !== null ? " fileSelected" : "")}>
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
