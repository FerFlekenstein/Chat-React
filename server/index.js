import express from 'express';
import morgan from 'morgan';
import {Server as IOServer } from 'socket.io';
import http from 'http';
import {PORT} from './config.js'
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import cors from "cors";
const app = express();
//creo el servidor http puro. (el de express no sirve porque le agrega metadata)
const server = http.createServer(app);
//recibe un servidor http como parametro
const io = new IOServer(server, {
    cors:{
        origin: "*"
    }
});
const __dirname = dirname(fileURLToPath(import.meta.url))
app.use(express.static(join(__dirname, "../client/dist")));
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
//escucho la conexion del cliente
io.on('connection', (socket) => {
    //escucho el evento "mensaje" del cliente(socket)
    socket.on("mensaje", (data) => {
        const infoMensaje = {
            ...data,
            from: socket.id,
        }
        //genero un evento ("mensaje2") hacia los demas clientes (!= cliente que genero el evento "mensaje")
        socket.broadcast.emit("mensaje2", infoMensaje)
    })
})
server.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`))