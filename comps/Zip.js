// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import CreateDirectories from "./FileUtil.js"
import JSZip from "jszip"
import PrettyMs from "pretty-ms";

export async function enumerateZip(inputFile) {
  const zip = await JSZip.loadAsync(inputFile);
  let files = [];
  for (const name in zip.files) {
    files.push(name);
  }
  console.log(files);
  return files;
}

export async function unzip(inputFile, outputDirHandle, setProgress, statusUpdater) {
  try {
    let start_ms = Date.now();

    // |progress| tracks the current progress indicator value.
    let progress = 0;
    setProgress(progress);

    const zip = await JSZip.loadAsync(inputFile);

    // Uncomment to use the user-selected directory handle:
    const output_dir = outputDirHandle;
    // Uncomment to use the spec-provided sandbox folder:
    // const output_dir = await FileSystemDirectoryHandle.getSystemDirectory({ type: "sandbox" });
    if (output_dir === '') {
      console.log("No output directory selected, please select an output directory first");
      return;
    }

    // Run through each entry first to test if the file already exists.
    // This ensures that we only begin unarchiving if all files in the
    // archive didn't already exist on disk.
    for (const name in zip.files) {
      const [dir, file_name] = await CreateDirectories(output_dir, name)
      const file = zip.files[name];

      // Skip over directories
      if (file.dir) continue;

      // Try to get |file_name| in |dir|.  If this doesn't reject,
      // then |file_name| exists.
      let exists;
      try {
        'getFile' in dir ? await dir.getFile(file_name, {create: false}) : await dir.getFileHandle(file_name, {create: false});
        exists = true;
      } catch(e) {
        // Continue.
        exists = false;
      }

      if (exists) {
        statusUpdater.setError('Error: Could not extract ' + file_name + '.  File already exists.');
        // TODO: Throw an error here and handle rejected async calls
        // in callers.
        // throw new Error(`file ${file_name} already exists`);
        return;
      }
    }

    // |progress_step| is the amount of progress we increment by on the
    // progress indicator.  There are progress indicator steps for each entry
    // in the keys array plus the final "100%" bump after the for loop
    // completes.
    let num_files = Object.keys(zip.files).length;
    let progress_step = 100 / (num_files + 1);

    for (const name in zip.files) {
      progress += progress_step;
      setProgress(progress);
      const [dir, file_name] = await CreateDirectories(output_dir, name)
      const file = zip.files[name];

      // Skip over directories
      if (file.dir) continue;

      const output_file = 'getFile' in dir ? await dir.getFile(file_name, {create: true}) : await dir.getFileHandle(file_name, {create: true});
      const writer = await output_file.createWritable({keepExistingData: false});

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

    progress += progress_step;
    setProgress(progress);

    let plural_files = num_files > 1 ? 'files' : 'file';
    let message = `Extracted ${num_files} ${plural_files} from ` +
        `${inputFile.name} in ${PrettyMs(Date.now() - start_ms)}.`;
    statusUpdater.setSuccess(message);
  } catch (error) {
    console.error('Failed to load zip file');
    console.error(error);
    statusUpdater.setError('Failed to load zip file');
  }
}
