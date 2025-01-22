import React, { useState } from 'react'

import { fetchVideosById, fetchTestData, fetchNewsFactCheck } from './api/api-calls'
import "./App.css"

const App = () => {
  const [currVideoURL, setCurrVideoURL] = useState("")
  const [formattedData, setFormattedData] = useState()

  const showURL = async () => {
    const chromeQuery = async () => {
      return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          console.log(tabs)//test
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError)
          }
          else {
            console.log("tabs[0].url", tabs[0].url)
            setCurrVideoURL(tabs[0].url)
            resolve(tabs[0].url)
          }
        })
      })
    }
    await chromeQuery()

    //    const id = await chromeQuery();
    //
    //    console.log("id out of await: ", id)
    //
    //    if (!id) {
    //      setFormattedData("undefined id")
    //    }
    //    else {
    //      const currFormattedData = await fetchNewsFactCheck(id)
    //      setFormattedData(currFormattedData)
    //    }
  }

  return (
    <>
      <button onClick={showURL}>Click me</button>
      <div>{currVideoURL}</div>
      <div>{formattedData}</div>
    </>
  );
}

export default App;
