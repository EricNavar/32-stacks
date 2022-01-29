import React from 'react';

function Home() {
  return (
    <div>
      <h1>32Stacks</h1>
      <p>This is literally the best card game that there is.</p>
      <div style={{margin:"2.5rem"}}>
        <div>
          <label for="name">Create a username:</label>
          <input type="text" id="name" name="name" required minlength="4" maxlength="8" size="10"/>
          <button>set</button>
        </div>
        <p>
          or
        </p>
        <div>
          <button>Join a game</button>
        </div>
      </div>
    </div>
  );
}

export { Home };
