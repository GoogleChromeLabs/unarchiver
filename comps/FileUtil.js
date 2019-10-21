export default function CreateDirectories(root_directory, file_path) {
  const file_path = name.split('/');
  const file_name = path.pop();
  let dir = root_directory;
  for (const component of path) {
      dir = await dir.getDirectory(component, {create: true});
  }
  return [dir, file_name];
}