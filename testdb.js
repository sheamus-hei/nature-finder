var db = require('./models');

db.animal.findOrCreate({
    where: {
        speciesKey: 2482507
    }, defaults: {
        name: "Corvus"
    }
}).then(animal => console.log('found or created', animal));

db.user.findOrCreate({
    where: {
        email: "test@test.co"
    }, defaults: {
        name: "Obama",
        password: "password",
        img: "https://upload.wikimedia.org/wikipedia/commons/8/8d/President_Barack_Obama.jpg"
    }
}).then(user => console.log('found or created', user));

db.journal.findOrCreate({
    where: {
        title: "Saw a Crow on Pennsylvania avenue"
    }, default: {
        animalId: 1,
        userId: 1,
        date: 2012-01-08,
        content: "Dark wings, dark words",
        img: "https://picsum.photos/id/237/200/300"
    }
}).then(journal => console.log('found or created', journal));