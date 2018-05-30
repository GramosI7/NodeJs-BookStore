//install dependencies
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const multer = require("multer");
const upload = multer();
const mongoose = require("mongoose");


const config = require('./config');

console.log(config);
//connect mongodb avec message pour savoir si on est connecté 
mongoose.connect(`mongodb://${config.db.user}:${config.db.password}@ds241530.mlab.com:41530/expresslivres`);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: cannot connect to my DB"));
db.once("open", () => {
    console.log("connected to the DB !");
});

//envoie données sur mlab
const livresSchema = mongoose.Schema({
    livretitle: String,
    livreauteur: String,
    livreyear: Number,
    livredescription: String
});

const Livre = mongoose.model("livres", livresSchema);


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
    const title = "Livres francais des trente dernieres années;"

    frenchLivres = [];
    Livre.find((err, livres) => {
        if(err) {
            console.error('rien trouvé');
            res.sendStatus(500);
        } else {
            frenchLivres = livres
            res.render("index", { livres: frenchLivres });
        }
    })
});

//route content tous les livres
app.get("/livres", (req, res) => {

    const title = "Livres francais des trente dernieres années;"

    frenchLivres = [];
    Livre.find((err, livres) => {
        if(err) {
            console.error('rien trouvé');
            res.sendStatus(500);
        } else {
            frenchLivres = livres;
            console.log(frenchLivres);
            res.render("livre", { livres: frenchLivres, title: title });
        }
    })
});

//permet de faire fonctionner le formulaire et d'inserer des livres
app.post("/livres/add", upload.fields([]), (req,res) => {
    if(!req.body) {
        return res.sendStatus(500);
    } else {
        const formData = req.body;
        console.log("formDtata", formData);

        const title = req.body.livretitle;
        const couverture = req.body.livrecouverture;
        const auteur = req.body.livreauteur;
        const year = req.body.livreyear;
        const description = req.body.livredescription;

        const myLivre = new Livre({ livretitle: title, livrecouverture: couverture, livreauteur: auteur, livreyear: year, livredescription: description });
        myLivre.save((err, saveLivre) => {
            if(err) {
                console.error(err);
                return;
            } else {
                console.log(saveLivre);
                res.sendStatus(201);
            }
        })  
    }
});
//en cours
app.get("/livres/add", (req,res) => {
    res.render("addBook")
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


// app.post("/livres", (req, res) =>{
//     console.log("le titre : " + req.body.livretitle);
//     console.log("l'année : " + req.body.livreyear);
//     const newLivre = { title : req.body.livretitle, year: req.body.livreyear};
//     frenchLivres = [...frenchLivres, newLivre];
//     console.log(frenchLivres);

//     res.sendStatus(201);
// });