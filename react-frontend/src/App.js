import './App.css';
import Location from "./components/Location";


const data = [
  {
    location: 'traded to the jets',
    day: '2023-04-23',
    id: 1
  },
  {
    location: 'some more to come for tomorrow',
    day: '2023-04-23',
    id: 1
  },

]

function App() {
  return (
    <div className="App" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <p style={{
        fontSize: 60
      }}>Where is Hair and Makeup?</p>

      <Location props={data[0]} />
      <Location props={data[1]} />

    </div>

  );
}

export default App;
