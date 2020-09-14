import React, { useState, useEffect, useCallback } from 'react';
import { useStopwatch } from 'react-timer-hook';
import { useSpeechSynthesis } from 'react-speech-kit';
import './App.css';

export default function App() {
  const [timers, setTimers] = useState([
    { time: 2, text: 'this is my mess'},
    { time: 5, text: 'hello'},
    { time: 8, text: 'whats up'},
  ]);
  const { seconds, isRunning, start, reset } = useStopwatch();
  const { speak, speaking, supported } = useSpeechSynthesis();
  const doReset = useCallback(() => reset(), []);
  const doSpeak = useCallback(() => speak(), []);

  useEffect(() => {
    const foundTimer = timers.find((t) => t.time === seconds);
    if(foundTimer) doSpeak({ text: foundTimer.text });

    //Stop timer at end of `timers`
    if (seconds > timers[timers.length - 1].time) doReset();
  }, [seconds, timers, doReset, doSpeak]);

  function updateTimers(index, time, text) {
    const newTimers = [...timers];
    newTimers[index].time = time;
    newTimers[index].text = text;

    setTimers(newTimers);
  }

/*   function removeTimer(index) {
    const newTimers = [...timers];
    var removeIndex = newTimers.map(function(item) { return item.time; }).indexOf(index);
    newTimers.splice(removeIndex, 1);
    setTimers(newTimers);
  } */

  function addTimer() {
    const newTimers = [...timers, { time: 100, text: 'yooo' }];
    setTimers(newTimers);
  }

  if (!supported) {
    return <div>Your browser is not supported. Sorry.</div>
  }

  return (
    <div className="app">
      <h2>Talk the Talk</h2>

      <div className="timers">
        {timers.map((timer, index) => (
          <TimerSlot key={index} index={index} timer={timer} updateTimers={updateTimers} /* removeTimer={removeTimer} *//>
        ))}
        <button className="add-button" onClick={addTimer}>Add</button>
      </div>

      {/* seconds */}
      <h2>{seconds}</h2>

      {/* buttons */}
      <div className="buttons">
        {!isRunning && <button className="start-button" onClick={start}>Start</button>}
        {isRunning && <button className="stop-button" onClick={reset}>Stop</button>}
        {speaking && <p>I am speaking...</p>}
      </div>
    </div>
  );
}

function TimerSlot({ index, timer, updateTimers, removeTimer}) {
  const [time, setTime] = useState(timer.time);
  const [text, setText] = useState(timer.text);

  function handleBlur() {
    updateTimers(index, time, text);
  }
/*   function removeHandle(index) {
    // removeTimer(e.target.value.index);
    console.log(index);
    debugger;
  } */

  return (
    <form className="timer">
      <input
        type="number"
        value={time}
        onChange={(e) => setTime(Number(e.target.value))}
        onBlur={handleBlur}
      />
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleBlur}
      />
{/*       <button
        className="stop-button"
        onClick={removeHandle({index})}
        index={index}
      >Delete</button> */}
    </form>
  )
}
