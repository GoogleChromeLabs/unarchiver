import {useCallback} from 'react';
import {useDropzone} from 'react-dropzone';
import JSZip from 'jszip';

const dropZoneStyle = {
  margin: 5,
  padding: 5,
  fontSize: 24,
  border: 'solid 1px #dddddd',
  backgroundColor: '#dddddd',
  borderRadius: '0.5em',
  cursor: 'pointer',
  boxShadow: '#cccccc 2px 2px',
}

const dropZoneStyleOnDragActive = {
  margin: 5,
  padding: 5,
  fontSize: 24,
  border: 'dashed 1px #aaaaaa',
  backgroundColor: '#eeeeee',
  borderRadius: '0.5em',
  cursor: 'grabbing'
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
  const {getRootProps, getInputProps, isDragActive} = useDropzone({multiple: false, onDrop});

  return (
    <div {...getRootProps()} style={isDragActive ? dropZoneStyleOnDragActive : dropZoneStyle }>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <span>Drop the file here!</span> :
          <span>Click to select a file, or drag-and-drop here.</span>
      }
    </div>
  );
}
