import {extract, pack} from "tar-stream"
import CreateDirectories from "FileUtil"

function Untar(file, output_dir) {
  return new Promise((resolve, reject) => {
    extract.on('entry', async function(header, stream, next) {
      console.log("Got tar entry with headers", header);
      // stream is the content body (might be an empty stream)
      // call next when you are done with this entry
      const [directory, file_name] = CreateDirectories(output_dir, output_file)

      // Skip over everything but files.
      // TODO handle symlinks
      if (header.type =! "file") continue;

      const output_file = await directory.getFile(file_name, {create: true});
      console.log('Created file ' + file_name);

      const writer = await output_file.createWriter({keepExistingData: false});
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

    extract.on('finish', function() {
      console.log("finished processing tar");
    });

    pack.pipe(extract)
  })
}