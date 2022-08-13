// App.js - Input editable UI

import Editable from "./Editable";
import React, { useEffect, useState, useRef } from 'react'

function App() {

    const inputRef = useRef();
  // State for the input
  const [task, setTask] = useState("");

  /*
    Enclose the input element as the children to the Editable component to make it as inline editable.
  */
  return (
    <Editable
      text={task}
      placeholder="Write a task name"
      type="input"
    >
      <input
        type="text"
        name="task"
        placeholder="Write a task name"
        value={task}
        onChange={e => setTask(e.target.value)}
      />
    </Editable>
  );
}

export default App;