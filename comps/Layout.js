import Header from './Header'

const layoutStyle = {
  margin: 20,
  padding: 20,
  border: '1px solid #DDD'
}

export default function Layout(props) {
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
