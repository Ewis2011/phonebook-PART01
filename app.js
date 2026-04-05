import express from "express"
import {data} from "./db.js"
const app = express();

app.use(express.json());

app.get("/api/persons",(req, res, next)=>{
    res.json(data);
});

app.get("/api/persons/:id",(req, res, next) => {

    const {id} = req.params;
    const person = data.find(person => person.id === id);
    if(person)
        res.json(person);
    else
        res.status(404).end();
});

app.get("/info",(req, res) => {
    const persons = data.length - 1;
    const time = new Date();
    res.send(`Phonebook has info of ${persons} persons \n${time}`);
});

app.delete("/api/persons/:id",(req, res, next) => {
        const {id} = req.params;
        const person = data.find(person => person.id === id);
        if(person)
            res.status(200).json(person);
        else
            res.status(404).end();
});

app.post("/api/persons", (req, res, next) => {

    const newData = req.body;

    if(data.find(d => d.name === newData.name))
        {
            return res.status(400).json({error: "name must be unique!"});
        };
    if (!(newData.name && newData.number)){
            return res.status(400).json({ error: "The name or number is missing" });
        }
    newData.id = Math.floor(Math.random()*1234560);
    data.push(newData);

    res.status(201).json(newData);
});

const PORT = 3001;
app.listen(PORT,() => {
    console.log("Server is running...");
});