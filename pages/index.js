import Layout from '../comps/Layout.js'
import ChooseFile from '../comps/ChooseFile.js'
import ChooseDirectory from '../comps/ChooseDirectory.js'
import {useState, useCallback} from 'react';
import {unzip, enumerateFiles} from '../comps/Zip.js';
import {Untar} from '../comps/Tar.js';
import { Line } from 'rc-progress';
import {StatusBox, statusUpdater, resultState} from '../comps/StatusBox.js'

// TODO(enne): add a "supported" function here and feature detect
// DecompressionStream.
const extractors = [
  {
    mimes: ['application/zip'],
    extensions: ['.zip'],
    func: (props) => unzip(props.inputFile, props.outputDirectory, props.setProgress, props.statusUpdater),
    supported: true,
  },
  {
    mimes: ['application/x-tar'],
    extensions: ['.tar'],
    func: (props) => Untar(props.inputFile.stream(), props.outputDirectory),
    supported: true,
  },
  {
    mimes: [],
    extensions: ['.tgz', '.tar.gz'],
    func: (props) => {
      const input = props.inputFile.stream();
      const decompressor = new DecompressionStream("gzip");
      Untar(input.pipeThrough(decompressor), props.outputDirectory);
    },
    supported: (() => (typeof DecompressionStream !== 'undefined'))(),
  },
];

function findExtractor(mime, filename) {
  for (let i = 0; i < extractors.length; ++i) {
    let extractor = extractors[i];
    if (extractor.mimes.indexOf(mime) >= 0) {
      if (extractor.supported)
        return extractor;
    }
  }

  for (let i = 0; i < extractors.length; ++i) {
    let extractor = extractors[i];
    for (let j = 0; j < extractor.extensions.length; ++j) {
      let extension = extractor.extensions[j];
      if (filename.endsWith(extension)) {
        if (extractor.supported)
          return extractor;
      }
    }
  }
  return null;
}

async function extract(props) {
  let ex = findExtractor(props.inputFile.type, props.inputFile.name);
  if (!ex) {
    // TODO: make this better
    props.statusUpdater.setError('no extractor found');
    return;
  }
  ex.func(props);
}


function Unarchive(props) {
  return (
    <div style={{margin: 10}}>
      <button disabled={!props.inputFile || !props.outputDirectory} onClick={
        async () => {
          props.setRunning(true);
          props.statusUpdater.clearStatus();
          await extract(props);
          props.setRunning(false);
          props.reset();
        }
      } style={{'fontSize': 18, padding: 8}}>Decompress! 💥</button>
    </div>
  )
}

function filePreview(files) {
  if (files === null || files.length === 0)
    return null;
  return (
    <div>
      Files to extract:
      <ul>
        { files.map((file, i) => <li key={i}>{file}</li>) }
      </ul>
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

  const [files, setFiles] = useState([]);

  const [resultStatus, setStatus] = useState({state: resultState.UNKNOWN, message: null});

  var setInputFileInterceptor = useCallback(async (inputFile) => {
    setInputFile(inputFile);
    console.log(inputFile);
    setFiles([]);
    if (inputFile != null && inputFile.type == "application/zip") {
      let enumerated = await enumerateFiles(inputFile);
      setFiles(enumerated);
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
        { filePreview(files) }
        <StatusBox
            resultStatus={resultStatus.state}
            message={resultStatus.message} />
      </div>
    </Layout>
  );
}

export default Index;
