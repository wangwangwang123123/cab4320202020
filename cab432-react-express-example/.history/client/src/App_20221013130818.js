import React, { useEffect, useState } from 'react';
import './App.css';



function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          <FavoriteAnimal url="/api/question" />
        </p>
      </header>
    </div>
  );
}

export default App;
