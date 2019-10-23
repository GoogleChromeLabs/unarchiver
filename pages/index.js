import Layout from '../comps/Layout.js'
import ChooseFile from '../comps/ChooseFile.js'
import ChooseDirectory from '../comps/ChooseDirectory.js'
import {useState} from 'react';
import {unzip} from '../comps/Zip.js';
import { Line } from 'rc-progress';

function Unarchive(props) {
  return (
    <div>
      <button onClick={
        async () => {
          props.setRunning(true);
          await unzip(props.inputFile, props.outputDirectory, props.setProgress)
          props.setRunning(false);
          props.reset();
        }
      }>3. Unarchive</button>
    </div>
  )
}

function Index() {
  // Declare a state variable for the input file.
  const [inputFile, setInputFile] = useState(null);

  // Declare a state variable for the output directory handle.
  const [outputDirectory, setOutputDirectory] = useState(null);

  // Declare state variables for tracking running and the progress indicator.
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  function reset() {
    setInputFile(null);
    setOutputDirectory(null);
  }

  return (
    <Layout>
      <div>
        <p>Unarchiver</p>

        <ChooseFile
            inputFile={inputFile}
            setChosenFile={setInputFile} />
        <ChooseDirectory
            chosenDirectory={outputDirectory}
            setChosenDirectory={setOutputDirectory} />
        <Unarchive
            inputFile={inputFile}
            outputDirectory={outputDirectory}
            reset={reset}
            setProgress={setProgress}
            setRunning={setRunning} />
        { running ?
            <Line percent={progress} strokeWidth="1" />
            : ''
        }
      </div>
    </Layout>
  );
}

export default Index;
