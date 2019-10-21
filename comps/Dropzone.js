import {useCallback} from 'react';
import {useDropzone} from 'react-dropzone';
import JSZip from 'jszip';

export default function Dropzone() {
  const onDrop = useCallback(async acceptedFiles => {
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
        await new Promise(resolve => {
            stream.on('end', resolve);
        });
    };
  }, []);
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
  );
}
