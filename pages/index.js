// This is the Link API
import Link from 'next/link';
import {useCallback} from 'react';
import {useDropzone} from 'react-dropzone';

function MyDropzone() {
  const onDrop = useCallback(acceptedFiles => {
    const reader = new FileReader();

    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');
    reader.onload = () => {
      // Do whatever you want with the file contents
      const binaryStr = reader.result;
      console.log(binaryStr);
    };

    acceptedFiles.forEach(file => reader.readAsArrayBuffer(file));
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

const Index = () => (
  <div>
    <p>Unarchiver</p>

    <MyDropzone/>

    <Link href="/about">
      <a>About</a>
    </Link>
  </div>
);
  
export default Index;
