import React from 'react'

function SettingsPage() {
  const [board, setBoard] = React.useState(0);

  return (
    <div>
      <h1>
        Choose a board map
      </h1>
      <button>Among Us board</button>
      <button>Minimalist dark mode</button>
      <button>Minimalist light mode</button>
      <br/>
      <a href='/'>Return to home</a>
    </div>
  )
}

export { SettingsPage };
