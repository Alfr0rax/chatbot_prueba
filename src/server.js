require("dotenv").config();
import express from "express";
import viewEngine from "./config/viewEngine";
import initWbRoute from "./routes/web";
import bodyParser from "body-parser";

let app = express();

//Configuracion viewEngine
viewEngine(app);

//usando body-parser para publicar datos
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//iniciamos todas la rutas de web
initWbRoute(app);

let port = process.env.PORT || 8080;

app.listen(port, ()=>{
    console.log(`Esta App se está corriendo en el puerto ${port}`);
});
