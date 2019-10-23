import Layout from '../comps/Layout.js'
import ChooseFile from '../comps/ChooseFile.js'
import ChooseDirectory from '../comps/ChooseDirectory.js'
import {useState, useCallback} from 'react';
import {unzip, enumerateFiles} from '../comps/Zip.js';
import { Line } from 'rc-progress';
import {StatusBox, statusUpdater, resultState} from '../comps/StatusBox.js'

function Unarchive(props) {
  return (
    <div style={{margin: 5}}>
      <button disabled={!props.inputFile || !props.outputDirectory} onClick={
        async () => {
          props.setRunning(true);
          props.statusUpdater.clearStatus();
          await unzip(props.inputFile, props.outputDirectory, props.setProgress, props.statusUpdater);
          props.setRunning(false);
          props.reset();
        }
      } style={{'font-size': 14, padding: 5}}>Decompress! 💥</button>
    </div>
  )
}

function createRows(files) {
  const items = [];
  for (const file of files) 
    items.push(<li>{file}</li>);
  return items;
}

function Index() {
  // Declare a state variable for the input file.
  const [inputFile, setInputFile] = useState(null);

  // Declare a state variable for the output directory handle.
  const [outputDirectory, setOutputDirectory] = useState(null);

  // Declare state variables for tracking running and the progress indicator.
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const [files, setFiles] = useState([]);

  const [resultStatus, setStatus] = useState({state: resultState.UNKNOWN, message: null});

  var setInputFileInterceptor = useCallback(async (inputFile) => {
    setInputFile(inputFile);
    console.log(inputFile);
    if (inputFile != null) {
      let enumerated = await enumerateFiles(inputFile);
      setFiles(enumerated);
    }
    else {
      setFiles([]);
    }
    setStatus({state: resultState.UNKNOWN, message: null});
    console.log("set files");
  }, [setInputFile, setFiles, setStatus]);

  function reset() {
    setInputFile(null);
    setOutputDirectory(null);
    setFiles([]);
  }

  return (
    <Layout>
      <div>
        <ChooseFile
            inputFile={inputFile}
            setChosenFile={setInputFileInterceptor} />
        <ChooseDirectory
            chosenDirectory={outputDirectory}
            setChosenDirectory={setOutputDirectory} />
        <Unarchive
            inputFile={inputFile}
            outputDirectory={outputDirectory}
            reset={reset}
            setProgress={setProgress}
            setRunning={setRunning}
            statusUpdater={statusUpdater(setStatus)} />
        { running ?
            <Line percent={progress} strokeWidth="1" />
            : ''
        }
        { files != null && files.length != 0 && (
          <div>
            Files to extract:
            <ul>
              {createRows(files)}
            </ul>
          </div>
        )}
        <StatusBox
            resultStatus={resultStatus.state}
            message={resultStatus.message} />
      </div>
    </Layout>
  );
}

export default Index;
