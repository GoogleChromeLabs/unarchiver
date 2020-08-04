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

import {extract} from "tar-stream"
import CreateDirectories from "./FileUtil.js"

export async function untar(file_stream, output_dir) {
  var extractObj = extract();
  extractObj.on('entry', async function(header, stream, next) {
    const [directory, file_name] = await CreateDirectories(output_dir, header.name);

    // Skip over everything but files.
    // TODO handle symlinks
    if (header.type != "file") {
      stream.resume();
      next();
      return;
    }

    const output_file = 'getFile' in directory ? await directory.getFile(file_name, {create: true}) : await directory.getFileHandle(file_name, {create: true});

    const writer = await output_file.createWritable({keepExistingData: false});
    let offset = 0;
    let write_op;
    stream.on('end', function() {
      next() // ready for next entry
    })
    stream.on('data', async (chunk) => {
      stream.pause();
      console.log(`Writing ${chunk.length} bytes of data.`);
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
  });

  extractObj.on('finish', function() {
    console.log("finished processing tar");
  });

  // Read the file.
  const reader = file_stream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done)
      break;
    extractObj.write(value);
  }
  extractObj.end();
  reader.releaseLock();
}
