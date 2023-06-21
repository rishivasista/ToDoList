import express from 'express';
import bodyParser from 'body-parser';
import {
    fileURLToPath
} from 'url';
import {
    dirname
} from 'path';

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = dirname(__filename);
const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"))
app.set("view engine", "ejs");

let items = ["Buy Food", "Cook Food", "Eat Food"];
let workListItems = [];

app.get("/", (req, res) => {
    let today = new Date();
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    let day = today.toLocaleDateString("en-US", options);
    res.render("list", {
        listTitle: day,
        listitems: items
    });
});

app.post("/", (req, res) => {
    let item = req.body.todoitem;
    items.push(item);
    res.redirect("/");
});


app.get("/work", (req, res) => {
    res.render("list", {
        listTitle: "Work List",
        listitems: workListItems
    });
});

app.post("/work", (req, res)=>{
    let item = req.body.todoitem;
    workListItems.push(item);
    res.redirect("/work");
});


app.get("/about", (req, res)=>{
    res.render("about");
})

app.listen(process.env.PORT || 3000, () => console.log("Server started successfully!!"));