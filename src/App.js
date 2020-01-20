import React, { useState, useEffect } from 'react';
import MyBoard from './board';
import axios from 'axios';
import ConfigApp from './configApp';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {

    fetch('/users/1')
    .then(response => response.json())
    .then(data => setUser(data));
    
  }, []);

  console.log(user);
  return (
    <div className="App">
      {
        user &&
        <MyBoard userId={user.id} boardId={3}/>
      }
    </div>
  );
}

export default App;