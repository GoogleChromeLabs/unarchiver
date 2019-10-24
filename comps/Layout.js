import Header from './Header'

const layoutStyle = {
  margin: 20,
  padding: 20,
  border: '1px solid #DDD'
}

export default function Layout(props) {
  // Feature detection.
  // For server-side rendering, window is not defined.
  if (typeof window !== 'undefined' && !('chooseFileSystemEntries' in window)) {
    let chromeLink = '';
    if (window.chrome) {
      chromeLink = (
        <div>
          Please enable the flag on the chrome://flags/#native-file-system-api page.
        </div>
      );
    }
    return (
      <div style={layoutStyle}>
        <Header />
        <div>
          <a href="https://wicg.github.io/native-file-system/">
            Native File System API not supported
          </a>
        </div>
        {chromeLink}
      </div>
    );
  }

  return (
    <div style={layoutStyle}>
      <Header />
      {props.children}
      <style jsx>{`
        div,a,button,span {
          font-family: 'Roboto',arial,sans-serif;
        }
      `}</style>
    </div>
  )
}
