var db = require('./models');

db.user.findOrCreate({
    where: {
        email: "test@test.co"
    }, defaults: {
        name: "Obama",
        password: "password",
        img: "https://upload.wikimedia.org/wikipedia/commons/8/8d/President_Barack_Obama.jpg"
    }
}).then(user => console.log('found or created', user));

db.user.findOrCreate({
    where: {
        email: "thinh@test.com"
    }, defaults: {
        name: "Thinh",
        password: "password",
        img: "https://media-exp1.licdn.com/dms/image/C5603AQGGfkbI4PADCw/profile-displayphoto-shrink_200_200/0?e=1588809600&v=beta&t=ZjzWq6A8NMso2JfnM0uq2qrETmYc383plImbX_YdNao"
    }
}).then(user => console.log('found or created', user));

db.animal.findOrCreate({
    where: {
        speciesKey: 2436886
    }, defaults: {
        name: "Florida Cottontail",
        lat: 41.3318,
        long: -74.3568,
        location: "Florida, New York, United States",
        img: "https://static.inaturalist.org/photos/45617645/original.jpeg?1563711910",
        userID: 2
    }
}).then(animal => console.log('found or created an animal'));

db.journal.findOrCreate({
    where: {
        title: "Saw a Crow on Pennsylvania avenue"
    }, default: {
        animalId: 1,
        userId: 1,
        date: 2012-01-08,
        content: "Dark wings, dark words",
        img: "https://picsum.photos/id/237/200/300",
        public: true
    }
}).then(journal => console.log('found or created', journal));