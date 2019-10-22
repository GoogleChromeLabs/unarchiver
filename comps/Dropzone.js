import {useCallback, useState} from 'react';
import {useDropzone} from 'react-dropzone';

const compStyle = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap'
}

function AcceptedFile(props) {
  let fileText = (<div></div>);
  if (props.onDropCalled) {
    console.log("on drop called true");
    fileText = props.inputFiles.length === 1 ? (
      <div>
        <div className="selectedFile">
          {props.inputFiles[0].name}
        </div>
        <style jsx>{`
          .selectedFile {
            margin: 5px;
            padding: 5px;
            font-size: 24px;
            text-align: center;
            background-color: rgb(192, 255, 176);
            border-radius: 0.25em;
            flex-grow: 2;
          }
        `}</style>
      </div>
    ) : 'Multiple files are not supported.';
  }

  return fileText;
}

export default function Dropzone(props) {
  // Declare a state variable for when onDrop is called.
  const [onDropCalled, setOnDropCalled] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    setOnDropCalled(true);
    props.setInputFile(acceptedFiles[0]);
  }, [props.setInputFile]);
  const {getRootProps, getInputProps, isDragActive, isDragReject, acceptedFiles, rejectedFiles} = useDropzone({multiple: false, onDrop});

  return (
    <div style={compStyle}>
      <div {...getRootProps()} className={"dropZone" + (isDragActive ? "  dragActive" : "") }>
      <input {...getInputProps()} />
      <span>{
        isDragActive ? "1. Drop the file here!": "1. Click to select a file, or drag-and-drop here."
      }</span>
      </div>
      <AcceptedFile onDropCalled={onDropCalled} inputFiles={acceptedFiles} />
      <style jsx>{`
        .dropZone {
          margin: 5px;
          padding: 5px;
          font-size: 24px;
          text-align: center;
          border: solid 1px #dddddd;
          background-color: #dddddd;
          border-radius: 0.25em;
          cursor: pointer;
          min-width: 500px;
          box-shadow: #cccccc 2px 2px;
        }
        .dropZone.dragActive {
          border: dashed 1px #aaaaaa;
          background-color: #eeeeee;
          cursor: grabbing;
          border-radius: 0;
          box-shadow: 0px 0px;
        }
      `}</style>
    </div>
  );
}
