import React from 'react';


function Location({props}) {

  return (
    <div style={{
      width: '50%',
      borderRadius: 20,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      margin: 15,
      boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.25)"
    }}>
      <p style={{fontSize: 20}}>{props.location}</p>
      <p>{props.day.substring(0, 11)}</p>
    </div>
  );
}

export default Location;