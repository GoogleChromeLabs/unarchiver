import CreateDirectories from "./FileUtil.js"
import JSZip from "jszip"

export async function enumerateFiles(inputFile) {
  const zip = await JSZip.loadAsync(inputFile);
  let files = []; 
  for (const name in zip.files) {
    files.push(name);
  }
  console.log(files);
  return files;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// |sleepTimeMs| is the amount of time in ms to sleep between step updates.
const sleepTimeMs = 200;

// |sleepFinalTimeMs| is the amount of time in ms to sleep on the final step.
const sleepFinalTimeMs = 400;

export async function unzip(inputFile, outputDirHandle, setProgress, statusUpdater) {
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

    // |progress| tracks the current progress indicator value.
    let progress = 0;

    // |progress_step| is the amount of progress we increment by on the
    // progress indicator.  There are progress indicator steps for each entry
    // in the keys array plus the final "100%" bump after the for loop
    // completes.
    let num_files = Object.keys(zip.files).length;
    let progress_step = 100 / (num_files + 1);

    for (const name in zip.files) {
      await sleep(sleepTimeMs);
      progress += progress_step;
      setProgress(progress);
      await sleep(sleepTimeMs);
      const [dir, file_name] = await CreateDirectories(output_dir, name)
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
          stream.on('error', () => {
            statusUpdater.setError('Error: Could not extract ' + file_name + '.');
            reject();
          });
          stream.on('end', resolve);
      });
      // Make sure the last write operation actually finished.
      await write_op;
      writer.close();
    };

    await sleep(sleepTimeMs);
    progress += progress_step;
    setProgress(progress);

    let plural_files = num_files > 1 ? 'files' : 'file';
    let message = 'Extracted ' + num_files + ' ' + plural_files +
        ' from ' + inputFile.path + '.';
    statusUpdater.setSuccess(message);

    await sleep(sleepFinalTimeMs);
  } catch (error) {
    console.error('Failed to load zip file');
    console.error(error);
    statusUpdater.setError('Failed to load zip file');
  }
}
