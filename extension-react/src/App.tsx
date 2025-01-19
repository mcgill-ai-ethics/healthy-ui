import React, { useState } from 'react'

import "./App.css"

const App = () => {
  const [url, setUrl] = useState("")

  const showURL = async () => {

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      console.log(tabs)
      setUrl(tabs[0].id)
    })

  }
  return (
    <>
      <button onClick={showURL}>Click me</button>
      <div>{url}</div>
    </>
  );
}

export default App;
