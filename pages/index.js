import Layout from '../comps/Layout.js'
import Dropzone from '../comps/Dropzone.js'
import {useState} from 'react';

function NativeFSOutput(props) {
  return (
    <div>
      <button onClick={() => props.getDirHandle()}>Pick an output folder</button>
    </div>
  )
}

async function getDirHandle(setDirHandle) {
  try {
    const handle = await window.chooseFileSystemEntries({type: 'openDirectory'});
    setDirHandle(handle);
  } catch (e) {
    console.log(`ERROR: ${JSON.stringify(e.message)}`);
  }
}

function Index() {
  // Declare a new state variable for directory handles.
  const [outputDirHandle, setDirHandle] = useState('');
  const boundGetDirHandle = getDirHandle.bind(this, setDirHandle);

  return (
    <Layout>
      <div>
        <p>Unarchiver</p>

        <NativeFSOutput getDirHandle={boundGetDirHandle} />
        <Dropzone dirHandle={outputDirHandle}/>
      </div>
    </Layout>
  );
}

export default Index;
