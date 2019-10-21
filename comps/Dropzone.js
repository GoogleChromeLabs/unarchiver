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
        for (let name in zip.files) {
            console.log(name);
            const file = zip.files[name];

            // Skip over directories
            if (file.dir) continue;

            const stream = file.nodeStream();
            // Too bad stream is not a native stream, but instead a node stream
            // with a totally different API...
            stream.on('data', chunk => {
                console.log(chunk);
            });
            await new Promise((resolve, reject) => {
                stream.on('error', reject);
                stream.on('end', resolve);
            });
        };
    } catch (error) {
        console.error('Failed to load zip file');
        console.error(error);
    }
  }, []);
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

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
