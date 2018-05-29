const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const PORT = 3000;

app.use("/public",express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

//declaration de ejs
app.set("views", "./views");
app.set('view engine', "ejs");

let frenchLivres =  [];


app.get("/", (req,res) => {
    res.render("index");
});

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

app.post("/livres", (req, res) =>{
    console.log("le titre : " + req.body.livretitle);
    console.log("l'année : " + req.body.livreyear);
    const newLivre = { title : req.body.livretitle, year: req.body.livreyear};
    frenchLivres = [...frenchLivres, newLivre];
    console.log(frenchLivres);

    res.sendStatus(201);
});

app.get("/livres/add", (req,res) => {
    res.send("prochainement, un formulaire d'ajout ici !")
});

app.get("/livres/:id", (req, res) => {
    const id = req.params.id;
    res.render("livre-details", {livreId: id});
});

app.listen(PORT, () => {
    console.log(`Le serveur ${PORT} tourne !`)
});