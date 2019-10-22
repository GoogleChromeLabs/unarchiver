import {useCallback, useState} from 'react';
import {useDropzone} from 'react-dropzone';

const compStyle = {
  display: 'flex',
  flexDirection: 'column',
}

export default function Dropzone(props) {
  // Declare a state variable for when onDrop is called.
  const [acceptedFile, setAcceptedFile] = useState(undefined);
  const [onDropCalled, setOnDropCalled] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    setOnDropCalled(true);
    setAcceptedFile(acceptedFiles[0]);
    props.setInputFile(acceptedFiles[0]);
  }, [props.setInputFile, setAcceptedFile]);

  const {getRootProps, getInputProps, isDragActive, open, acceptedFiles} =
      useDropzone({multiple: false, onDrop});

  return (
    <div style={compStyle}>
      <div {...getRootProps()}
          className={"dropZone" + (isDragActive ? "  dragActive" : "") +
                                  (onDropCalled ? " fileSelected" : "")}>
        <input {...getInputProps()}/>
        <div>{
          acceptedFile === undefined ? 
              "Drop the compressed file here!" :
              <span className="acceptedFile">{acceptedFile.name}</span>
        }</div>
        <span className="clickHere">Click Here</span>
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
        .acceptedFile {
          font-family: monospace;
        }
        .clickHere {
          font-size: 18px;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
