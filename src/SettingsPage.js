import React from 'react';

function SettingsPage() {
  // eslint-disable-next-line no-unused-vars
  const [board, setBoard] = React.useState(0);
  const onClick = (b) => {
    setBoard(b);
  }; 

  return (
    <div>
      <h1>
        Choose a board map
      </h1>
      <button onClick={()=>onClick(0)}>Among Us board</button>
      <button onClick={()=>onClick(0)}>Minimalist dark mode</button>
      <button onClick={()=>onClick(0)}>Minimalist light mode</button>
      <br/>
      <a href='/'>Return to home</a>
    </div>
  );
}

export { SettingsPage };
