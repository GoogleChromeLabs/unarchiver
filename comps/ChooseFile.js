import {useCallback, useState} from 'react';
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
          Drop the compressed file here!
          <div style={{fontSize: 18, textDecoration: 'underline'}}>Click Here</div>
        </div>;
  } else {
    dropZoneContents =
        <div>Extracting from: <span style={{fontFamily: 'monospace'}}>{props.inputFile.name}</span></div>;
  }

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
        }
        .dropZone.fileSelected {
          border: none;
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
