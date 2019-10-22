import Layout from '../comps/Layout.js'
import Dropzone from '../comps/Dropzone.js'
import {useState} from 'react';
import JSZip from 'jszip';

function OutputSelector(props) {
  return (
    <div>
      <button onClick={() => props.chooseDirHandle()}>2. Pick an output folder</button>
    </div>
  )
}

async function chooseDirHandle(setDirHandle) {
  try {
    const handle = await window.chooseFileSystemEntries({type: 'openDirectory'});
    setDirHandle(handle);
  } catch (e) {
    console.log(`ERROR: ${JSON.stringify(e.message)}`);
  }
}

async function unzip(inputFile, outputDirHandle) {
  try {
    const zip = await JSZip.loadAsync(inputFile);

    // Uncomment to use the user-selected directory handle:
    const output_dir = outputDirHandle;
    // Uncomment to use the spec-provided sandbox folder:
    // const output_dir = await FileSystemDirectoryHandle.getSystemDirectory({ type: "sandbox" });
    if (output_dir === '') {
      console.log("No output directory selected, please select an output directory first");
      return;
    }

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
      let write_op;
      stream.on('data', async chunk => {
          stream.pause();
          write_op = writer.write(offset, chunk);
          await write_op;
          offset += chunk.length;
          stream.resume();
      });
      await new Promise((resolve, reject) => {
          stream.on('error', reject);
          stream.on('end', resolve);
      });
      // Make sure the last write operation actually finished.
      await write_op;
      writer.close();
    };
  } catch (error) {
      console.error('Failed to load zip file');
      console.error(error);
  }
}

function Unarchive(props) {
  return (
    <div>
      <button onClick={
        () => unzip(props.inputFile, props.outputDirHandle)
      }>3. Unarchive</button>
    </div>
  )
}

function Index() {
  // Declare a state variable for the input file.
  const [inputFile, setInputFile] = useState('');

  // Declare a state variable for the output directory handle.
  const [outputDirHandle, setDirHandle] = useState('');
  const chooseAndSetDirHandle = chooseDirHandle.bind(this, setDirHandle);

  return (
    <Layout>
      <div>
        <p>Unarchiver</p>

        <Dropzone setInputFile={setInputFile} />
        <OutputSelector chooseDirHandle={chooseAndSetDirHandle} />
        <Unarchive inputFile={inputFile} outputDirHandle={outputDirHandle}/>
      </div>
    </Layout>
  );
}

export default Index;
