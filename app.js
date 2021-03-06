//install dependencies
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const multer = require("multer");
const upload = multer();
const mongoose = require("mongoose");


const config = require('./config');

// console.log(config);
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
    livrecouv : String,
    livreauteur: String,
    livreyear: Number,
    livredescription: String,
    livreprix: Number
});

const Livre = mongoose.model("livres", livresSchema);


//port a ecouter
const PORT = 3000;

//fichier static fichier css
app.use("/public",express.static("public"));
// app.use(bodyParser.urlencoded({ extended: false }));
var urlencodedParser = bodyParser.urlencoded({extended: false});

//declaration de ejs
app.set("views", "./views");
app.set('view engine', "ejs");

let frenchLivres =  [];

// route home
app.get("/", (req,res) => {

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

    // const title = "Livres francais des trente dernieres années;"

    frenchLivres = [];
    Livre.find((err, livres) => {
        if(err) {
            console.error('rien trouvé');
            res.sendStatus(500);
        } else {
            frenchLivres = livres;
            console.log(frenchLivres);
            res.render("livre", { livres: frenchLivres});
        }
    })
});

//permet de faire fonctionner le formulaire et d'inserer des livres
app.post("/livres/add", urlencodedParser, (req,res) => {
    if(!req.body) {
        return res.sendStatus(500);
    } else {
        const formData = req.body;
        console.log("formDtata", formData);

        const title = req.body.livretitle;
        const couv = req.body.livrecouv;
        const auteur = req.body.livreauteur;
        const year = req.body.livreyear;
        const description = req.body.livredescription;
        const prix = req.body.livreprix;

        const myLivre = new Livre({ 
            livretitle: title, 
            livrecouv: couv, 
            livreauteur: auteur, 
            livreyear: year, 
            livredescription: description,
            livreprix : prix
         });
        myLivre.save((err, saveLivre) => {
            if(err) {
                console.error(err);
                return;
            } else {
                console.log(saveLivre);
                res.redirect("/");
            }
            

        })  

    }
});

app.delete("/livres-details/:id", (req, res) => {
    const id = req.params.id;
    Livre.findByIdAndRemove(id, (err, livre) => {
        res.sendStatus(202);
    });
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

app.get("/livres-details/:id", (req,res) => {
    const id = req.params.id;
    Livre.findById(id, (err, livre) => {
        res.render("livre-details", {livre: livre})
    });
});

app.get("/livres-info/:id", urlencodedParser, (req, res) => {

const id = req.params.id;
Livre.findById(id, (err, livre) => {
    console.log(livre)
    res.render("livre-info", {livres: livre})
});
});


app.post("/livres-details/:id", urlencodedParser, (req, res) => {
    // console.log("ceci est le req.body: "req.body);
    if(!req.body) {
        return res.sendStatus(500);
    }
    // console.log("livretitle: ", req.body.livretitle, "livreyear: ", req.body.livreyear);
    const id = req.params.id;
    Livre.findByIdAndUpdate(id, {$set: {
        livreid : req.body._id,
        livretitle: req.body.livretitle, 
        livrecouv: req.body.livrecouv, 
        livreauteur: req.body.livreauteur, 
        livreyear: req.body.livreyear, 
        livredescription: req.body.livredescription,
        livreprix : req.body.livreprix
    }}, {new : true},(err,livre) => {
       if(err) {
           console.log(error);
           return res.send("le livre n'a pas pu etre mis a jour")
       } 
       res.redirect("/livres");
    })
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