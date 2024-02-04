import {useState} from 'react';
import logo from './assets/images/logo-universal.png';
import './App.css';
import {Greet} from "../wailsjs/go/main/App";
import { SendStatus } from './commuicate';
const _15Hz = 1000 / 15;

function App() {
    const [resultText, setResultText] = useState("Please enter your name below 👇");
    const [name, setName] = useState('');
    const [status, setStatus] = useState({id: 0, x:0, y:0, items:[]} as any); // [id, x, y, items
    const updateName = (e: any) => setName(e.target.value);
    const updateResultText = (result: string) => setResultText(result);

    function greet() {
        Greet(name).then(updateResultText);
    }
    setInterval(() => SendStatus({id: 1, x:0, y:3, items:[]}), _15Hz)

    return (
        <div id="App">
            <img src={logo} id="logo" alt="logo"/>
            <div id="result" className="result">{resultText}</div>
            <div id="input" className="input-box">
                <input id="name" className="input" onChange={updateName} autoComplete="off" name="input" type="text"/>
                <button className="btn" onClick={greet}>Greet</button>
            </div>
        </div>
    )
}

export default App
