import './App.css';
import Location from "./components/Location";
import React, {useEffect, useState} from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";


function App() {

  const [whereabouts, setWhereabouts] = useState([{day: 'xxxx-xx-xx', location: 'loading'}])
  const [date, setDate] = useState(new Date())
  const [newLocation, setNewLocation] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState(null)
  const [showButtons, setShowButtons] = useState(false)

  const handleSetWhereabouts = (newValue) => {
    setWhereabouts(newValue);
  }

  const handleSetShowForm = (newValue) => {
    setShowForm(newValue)
  }

  const parseDate = (date) => {
    const dateSecs = Date.parse(date)
    return new Date(dateSecs).toISOString().slice(0, 10)
  }

  const newItem = async () => {

    let response;
    let data;
    try {
      response = await fetch(
        `http://${window.API_URI}/api`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            'location': newLocation,
            'day': parseDate(date)
          })
        })
      data = await response.json();
    } catch {
    }

    if (response?.ok) {
      setWhereabouts(data.locations)
      setError(null)
      setDate(new Date())
      setNewLocation("")
      setShowForm(false)
    } else {
      setError(data.errorMessage)
    }
  }

  useEffect(() => {
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
      <p
        style={{
          fontSize: 60,
          cursor: "pointer"
        }}
        onClick={() => setShowButtons(!showButtons)}
      >Where is Hair and Makeup?</p>

      <div style={{
        width: '50%',
        borderRadius: 20,
        display: showButtons ? 'flex' : 'none',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: 20,
        margin: 15,
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.25)"
      }}>

        {showForm === false ?
          <button
            style={{
              width: '100%'
            }}
            onClick={() => setShowForm(true)}
          >Add new</button> :
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%'
          }}>
            <div
              style={{
                display: 'flex',
                marginBottom: 10
              }}
            >
              <input
                style={{
                  width: '90%',
                  marginRight: 5,
                }}
                placeholder={'Enter a location and select a date to the right'}
                value={String(newLocation)}
                onChange={(e) => setNewLocation(e.target.value)}
              />
              <div>
                <DatePicker selected={date} onChange={(date) => setDate(date)} style={{
                  width: '5%'
                }
                }/>
              </div>
            </div>
            {error && <p>request failed: {error}</p>}
            <div style={{
              display: 'flex',
              justifyContent: 'space-evenly'
            }}>

              <button
                style={{
                  width: '40%'
                }}
                onClick={
                  () => setShowForm(false)}
              >
                Cancel
              < /button>
              <button
                style={{
                  width: '40%'
                }}
                disabled={newLocation === ""}
                onClick={() => newItem()}
              >
                Save
              </button>
            </div>
          </div>
        }
      </div>

      {whereabouts.map((item) => (
        <Location
          key={item.day}
          props={item}
          showButtons={showButtons}
          handleSetWhereabouts={handleSetWhereabouts}
          handleSetShowForm={handleSetShowForm}
          parseDate={parseDate}
        />
      ))}
    </div>

  );
}

export default App;
