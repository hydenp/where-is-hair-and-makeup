import './App.css';
import Location from "./components/Location";
import {useEffect, useState} from "react";


// const data = [
//   {
//     location: 'traded to the jets',
//     day: '2023-04-23',
//     id: 1
//   },
//   {
//     location: 'some more to come for tomorrow',
//     day: '2023-04-23',
//     id: 1
//   },
// ]

function App() {

  const [whereabouts, setWhereabouts] = useState([{day: 'xxxx-xx-xx', location: 'loading'}])

  useEffect(() => {

    // fetch(`http://localhost/api`)
    fetch(`http://${window.API_URI}/api`)
      .then((response) =>
        response.json()
      )
      .then((data) => {
        console.log(data)
        setWhereabouts(data.locations)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  return (
    <div className="App" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <p style={{
        fontSize: 60
      }}>Where is Hair and Makeup?</p>

      {whereabouts.map((item) => (
        <Location key={item.day} props={item}/>
      ))}

    </div>

  );
}

export default App;
