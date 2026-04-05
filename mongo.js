import mongoose from "mongoose";
if(process.argv.length < 3){
    console.log("Password must be an arg in cmd")
    process.exit();
}
const passwd = process.argv[2];

const mongouri = `mongodb+srv://aewis20:${passwd}@persons.vwdnoit.mongodb.net/phonebook?appName=Cluster0`;
mongoose.connect(mongouri, {family: 4});

const emp = new mongoose.Schema({
    name:String,
    number:String,
});
const Person = mongoose.model("person", emp, "Persons");

const name = process.argv[3];
const number = process.argv[4];
if(name && number){
    const pers = new Person({
    name,
    number
});
pers.save().then(person => {
    console.log(`added Anna number 040-1234556 to phonebook`);
    mongoose.connection.close();
});
}
else
    Person.find({}).then((persons) => {
        persons.forEach(person => {
           console.log(person); 
        });
        mongoose.connection.close();
    });
    


