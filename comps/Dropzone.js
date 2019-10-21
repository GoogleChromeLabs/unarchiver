import {useCallback} from 'react';
import {useDropzone} from 'react-dropzone';
import JSZip from 'jszip';

const compStyle = {
  display: 'flex',
  flexDirection: 'row',
}

export default function Dropzone() {
  const onDrop = useCallback(async acceptedFiles => {
    try {
        const zip = await JSZip.loadAsync(acceptedFiles[0]);
        const output_dir = await FileSystemDirectoryHandle.getSystemDirectory({ type: "sandbox" });
        for (const name in zip.files) {
            const path = name.split('/');
            const file_name = path.pop();
            let dir = output_dir;
            for (const component of path) {
                dir = await dir.getDirectory(component, {create: true});
            }

            const file = zip.files[name];


            // Skip over directories
            if (file.dir) continue;

            const output_file = await dir.getFile(file_name, {create: true});
            const writer = await output_file.createWriter({keepExistingData: false});

            const stream = file.nodeStream();
            // Too bad stream is not a native stream, but instead a node stream
            // with a totally different API...
            let offset = 0;
            stream.on('data', async chunk => {
                stream.pause();
                await writer.write(offset, chunk);
                offset += chunk.length;
                stream.resume();
            });
            await new Promise((resolve, reject) => {
                stream.on('error', reject);
                stream.on('end', resolve);
            });
            writer.close();
        };
    } catch (error) {
        console.error('Failed to load zip file');
        console.error(error);
    }
  }, []);
  const {getRootProps, getInputProps, isDragActive, isDragReject, acceptedFiles, rejectedFiles} = useDropzone({multiple: false, onDrop});

  return (
    <div style={compStyle}>
      <div {...getRootProps()} className={"dropZone" + (isDragActive ? "  dragActive" : "") }>
      <input {...getInputProps()} />
      <span>{
        isDragActive ? "Drop the file here!": "Click to select a file, or drag-and-drop here."
      }</span>
      </div>
      {acceptedFiles.length == 1 ? (
        <div className="selectedFile">
          {acceptedFiles[0].name}
        </div>
      ) : ''}
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
  );
}
