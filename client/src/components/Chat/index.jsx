import React from 'react'

const Chat = ({mensajes}) => {
  return (
    <div>
        {mensajes.map((mensaje, indice) => (
        <div key={indice}>
          <p><b>{mensaje.from}</b> [{mensaje.tiempo}]: <i>{mensaje.body}</i></p>
        </div>
        ))}
    </div>
  )
}

export default Chat