import React, {useState} from 'react';


function Location({props, windowWidth, showButtons, handleSetWhereabouts, handleSetShowForm, parseDate}) {

  const [location, setLocation] = useState(props.location)
  const [editing, setEditing] = useState(false)

  const deleteItem = () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      fetch(
        `http://${window.API_URI}/api/${parseDate(props.day)}`, {
          method: 'DELETE',
        })
        .then((response) =>
          response.json()
        )
        .then((data) => {
          console.log(data)
          handleSetWhereabouts(data.locations)
        })

    }
  }

  const updateItem = () => {

    if (props.location === location) {
      setEditing(false)
      return
    }

    fetch(
      `http://${window.API_URI}/api/${parseDate(props.day)}`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          'location': location
        })
      })
      .then((response) =>
        response.json()
      )
      .then((data) => {
        console.log(data)
        handleSetWhereabouts(data.locations)
        setEditing(false)
      })
  }

  return (
    <div style={{
      width: windowWidth < 800 ? '80%' : '50%',
      borderRadius: 20,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: 20,
      margin: 15,
      boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.25)"
    }}>
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        {editing ?
          <textarea
            style={{
              marginBottom: 10,
              width: '80%',
              height: 40
            }}
            value={String(location)}
            onChange={(e) => setLocation(e.target.value)}
          /> :
          <p style={{
            fontSize: 20,
            textAlign: 'left'
          }}>{props.location}</p>
        }
        <p>{props.day.substring(0, 11)}</p>
      </div>
      <div style={{
        width: '100%',
        display: showButtons ? 'flex' : 'none',
        justifyContent: 'space-around'
      }}>

        {editing === false ?
          <button
            style={{
              width: '40%'
            }}
            onClick={() => {
              setEditing(true)
              handleSetShowForm(false)
            }}
          >Edit
          </button> :
          <>
            <button
              onClick={
                () => setEditing(false)
              }
            >
              Cancel
            </button>
            <button
              onClick={() => updateItem()}
            >
              Save
            </button>
          </>

        }

        <button style={{
          width: '40%'
        }}
                onClick={deleteItem}
        >Delete
        </button>
      </div>
    </div>
  );
}

export default Location;