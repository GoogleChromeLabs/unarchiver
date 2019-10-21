// This is the Link API
import {useCallback} from 'react';
import {useDropzone} from 'react-dropzone';
import JSZip from 'jszip';
import Layout from '../comps/Layout.js'

function MyDropzone() {
  const onDrop = useCallback(async acceptedFiles => {
    const zip = await JSZip.loadAsync(acceptedFiles[0]);
    zip.forEach((name, file) => {
        console.log(name);
        console.log(file);
    });
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
  <Layout>
    <div>
      <p>Unarchiver</p>

      <MyDropzone/>
    </div>
  </Layout>
);
  
export default Index;
