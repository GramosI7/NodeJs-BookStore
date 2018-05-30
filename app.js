//install dependencies
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const multer = require("multer");
const upload = multer();
const mongoose = require("mongoose");


//connect mongodb avec message pour savoir si on est connecté 
mongoose.connect('mongodb://livres:expresslivres1@ds241530.mlab.com:41530/expresslivres');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: cannot connect to my DB"));
db.once("open", () => {
    console.log("connected to the DB !");
});

//envoie données sur mlab
const livresSchema = mongoose.Schema({
    livretitle: String,
    livreyear: Number
});

const Livre = mongoose.model("livres", livresSchema);
const title = "Terminator";
const year = 1980;

const myLivre = new Livre({ livretitle: title, livreyear: year});
myLivre.save((err, saveLivre) => {
    if(err) {
        console.log(error);
    } else {
        console.log("savedLivre", saveLivre);
    }
});

//port a ecouter
const PORT = 3000;

//fichier static fichier css
app.use("/public",express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

//declaration de ejs
app.set("views", "./views");
app.set('view engine', "ejs");

let frenchLivres =  [];

// route home
app.get("/", (req,res) => {
    res.render("index");
});

//route content tous les livres
app.get("/livres", (req, res) => {

    const title = "Livres francais des trente dernieres années;"

    frenchLivres = [
        {title: "Le Fabuleux destin d'amelie Poulain", year: 2001},
        {title: "Buffet froid", year: 1979},
        {title: "Le diner de cons", year: 1998},
        {title: "De rouille et d'os", year: 2012}
    ];
    res.render("livre", { livres: frenchLivres, title: title });
});

// app.post("/livres", (req, res) =>{
//     console.log("le titre : " + req.body.livretitle);
//     console.log("l'année : " + req.body.livreyear);
//     const newLivre = { title : req.body.livretitle, year: req.body.livreyear};
//     frenchLivres = [...frenchLivres, newLivre];
//     console.log(frenchLivres);

//     res.sendStatus(201);
// });


//permet de faire fonctionner le formulaire et d'inserer des livres
app.post("/livres", upload.fields([]), (req,res) => {
    if(!req.body) {
        return res.sendStatus(500);
    } else {
        const formData = req.body;
        console.log("formDtata", formData);
        const newLivre = { title : req.body.livretitle, year: req.body.livreyear};
        frenchLivres = [...frenchLivres, newLivre];
        res.sendStatus(201);
        
    }
});
//en cours
app.get("/livres/add", (req,res) => {
    res.send("prochainement, un formulaire d'ajout ici !")
});

//route pour details du livre
app.get("/livres/:id", (req, res) => {
    const id = req.params.id;
    res.render("livre-details", {livreId: id});
});

//ecouter le port
app.listen(PORT, () => {
    console.log(`Le serveur ${PORT} tourne !`)
});