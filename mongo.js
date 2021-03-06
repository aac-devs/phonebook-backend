import mongoose from 'mongoose';

if (process.argv.length < 3) {
  console.log(
    'Please provide the password as an argument: node mongo.js <password>'
  );
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://aac-devs:${password}@aac-devs-cluster.0arqf.mongodb.net/phonebook-app?retryWrites=true&w=majority`;
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});
const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log('phonebook:');
    result.forEach((person) => {
      const { name, number } = person;
      console.log(name, number);
    });
    mongoose.connection.close();
  });
} else {
  if (process.argv.length < 5) {
    console.log(
      'Please provide the name and number after de password as arguments: node mongo.js <password> <name> <number>'
    );
    process.exit(1);
  }
  const name = process.argv[3];
  const number = process.argv[4];
  const person = new Person({ name, number });
  person.save().then((result) => {
    const { name, number } = result;
    console.log(`Added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
}
