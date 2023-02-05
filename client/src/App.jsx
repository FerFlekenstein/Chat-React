import './App.css';
import io from 'socket.io-client';
import { useState, useEffect } from 'react';
import Chat from './components/Chat';

//con io conecto al servidor del backend y me devuelve un objeto (socket) 
const socket = io();

function App() {
  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err}`)
  })
  //state para guardar el mensaje
  const [mensaje, setMensaje] = useState();
  //state de mensajes
  const [mensajes, setMensajes] = useState([]);
  //recibo los mensajes del form, los mando al back y al state
  const manejoEnvio = (e) => {
    e.preventDefault();
    const date = new Date();
    const fecha = date.toLocaleString();
    const infoObj = {
      body: mensaje,
      tiempo: fecha
    }
    socket.emit("mensaje", infoObj);
    const mensajePropio = {
      body: mensaje,
      from: "Yo",
      tiempo: fecha
    }
    setMensajes([...mensajes, mensajePropio])
    setMensaje("");
  }
  //cuando se carga la app, escucha el evento "mensaje2" y despues desuscribo -la esucha- de ese evento "mensaje2"
  useEffect(() => {
    const recibirMensaje = (mensaje) => {
      setMensajes([...mensajes, mensaje])
    }
    socket.on("mensaje2", recibirMensaje)
    return () => {
      socket.off("mensaje2", recibirMensaje)
    }
  }, [mensajes]);

  return (
    <div className="App">
      <div className='chat'>
        <form onSubmit={manejoEnvio}>
          <input type="text" onChange={e => setMensaje(e.target.value)} value={mensaje}/>
          <button>enviar</button>
        </form>
        {/* `este map muestra los mensajes, podria ser un componente */}
        <Chat mensajes={mensajes}/>
      </div>
    </div>
  )
}

export default App;
