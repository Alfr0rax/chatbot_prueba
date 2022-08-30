import express, { application } from "express"

/*
Configuracion de vista para Node App
*/

let configViewEngine = (app) => {
    app.use(express.static("./src/public"));
    app.set("view engine", "ejs");
    app.set("views", "./src/views");
};

module.exports = configViewEngine;