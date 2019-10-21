// This is the Link API
import Link from 'next/link';
import Dropzone from 'react-dropzone';

const Index = () => (
  <div>
    <p>Unarchiver</p>

    <Dropzone onDrop={acceptedFiles => console.log(acceptedFiles)}>
      {({getRootProps, getInputProps}) => (
        <section>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
          </div>
        </section>
      )}
    </Dropzone>

    <Link href="/about">
      <a>About</a>
    </Link>
  </div>
);
  
export default Index;
