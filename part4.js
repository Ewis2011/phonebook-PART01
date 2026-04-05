import express from "express";
import mongoose from "mongoose";

const app = express();

if(process.argv.length < 3){
    console.log("Password must be an arg in cmd");
    process.exit();
}

const passwd = process.argv[2];
const mongouri = `mongodb+srv://aewis20:${passwd}@persons.vwdnoit.mongodb.net/phonebook?appName=Cluster0`;

mongoose.connect(mongouri, { family: 4 });

const emp = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        minlength: [3, "Name must be at least 3 characters long"]
    },
    number: {
        type: String,
        required: [true, "Number is required"],
        minlength: [8, "Number must be at least 8 characters long"],
        validate: {
            validator: v => /^\d{2,3}-\d+$/.test(v),
            message: props => `${props.value} is not a valid phone number!`
        }
    }
});

const Person = mongoose.model("person", emp, "Persons");

app.use(express.json());

app.get("/api/persons", (req, res, next) => {
    Person.find({})
        .then(person => res.json(person))
        .catch(err => next(err));
});

app.get("/api/persons/:id", (req, res, next) => {
    const { id } = req.params;
    Person.findOne({ _id: id })
        .then(result => {
            if(result) res.json(result);
            else res.status(404).end();
        })
        .catch(err => next(err));
});

app.get("/info", (req, res, next) => {
    Person.countDocuments({})
        .then(count => {
            const time = new Date();
            res.send(`Phonebook has info of ${count} persons \n${time}`);
        })
        .catch(err => next(err));
});

app.post("/api/persons", (req, res, next) => {
    const { name, number } = req.body;

    if (!(name && number)) return res.status(400).json({ error: "The name or number is missing" });

    const newData = new Person({ name, number });
    newData.save()
        .then(newPer => res.status(201).json(newPer))
        .catch(err => next(err));
});

app.delete("/api/persons/:id", (req, res, next) => {
    const { id } = req.params;
    Person.deleteOne({ _id: id })
        .then(removed => {
            if(removed) res.status(200).json(removed);
            else res.status(404).end();
        })
        .catch(err => next(err));
});

app.put("/api/persons/:id", (req, res, next) => {
    const { number } = req.body;

    if (!number) return res.status(400).json({ error: "Number is required" });

    Person.findByIdAndUpdate(
        req.params.id,
        { number },
        { new: true, runValidators: true, context: "query" }
    )
        .then(updated => {
            if(updated) res.json(updated);
            else res.status(404).end();
        })
        .catch(err => next(err));
});

app.use((err, req, res, next) => {
    if(err.name === "ValidationError") return res.status(400).json({ error: err.message });
    res.status(500).json({ error: err.message });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log("Server is running...");
});