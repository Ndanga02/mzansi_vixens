const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public')); // For serving static files like images, CSS, etc.

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MongoDB connection URI
const uri = "mongodb+srv://ndanganedz:Ndanga%4002@cluster0.gqcur.mongodb.net/escortsDB?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db; // Declare db variable to use in routes

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    
    // Access the 'escortsDB' database
    db = client.db("escortsDB");
    
    // Send a ping to confirm a successful connection
    await db.command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// Call the run function to establish the database connection
run().catch(console.dir);

// Multer setup for multiple file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory for storing uploaded images
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Unique filename
    }
});

const upload = multer({ storage: storage });

// GET route to render the homepage with escort data by areas
app.get('/', async (req, res) => {
    try {
        const phalaborwaEscorts = await db.collection('escorts').find({ area: 'Phalaborwa' }).toArray();
        const thohoyandouEscorts = await db.collection('escorts').find({ area: 'Thohoyandou' }).toArray();
        const tzaneenEscorts = await db.collection('escorts').find({ area: 'Tzaneen' }).toArray();
        const polokwaneEscorts = await db.collection('escorts').find({ area: 'Polokwane' }).toArray();

        res.render('index', {
            phalaborwaEscorts,
            thohoyandouEscorts,
            tzaneenEscorts,
            polokwaneEscorts
        });
    } catch (err) {
        console.error('Error fetching escorts:', err);
        res.status(500).send('Error fetching escorts');
    }
});

// POST route to add a new escort
app.post('/api/escorts', upload.array('images', 10), async (req, res) => {
    try {
        const escort = {
            name: req.body.name,
            cellNumber: req.body.cellNumber,
            area: req.body.area,
            message: req.body.message,
            email: req.body.email,
            images: req.files ? req.files.map(file => file.filename) : [], // Collect image filenames
            dateUploaded: new Date()
        };
        
        const result = await db.collection('escorts').insertOne(escort);
        res.status(201).json({ message: 'Escort added successfully', escortId: result.insertedId }); // Provide feedback
    } catch (err) {
        console.error('Error adding escort:', err);
        res.status(500).json({ message: 'Error adding escort', error: err });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
