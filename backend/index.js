
const express = require('express');
const cors = require('cors'); // Importing CORS for handling cross-origin requests                   
const bodyParser = require('body-parser'); // Importing body-parser for parsing JSON requests
const connectDB = require('./config/db');  
const dotenv = require('dotenv');         

dotenv.config(); // Load environment variables from .env file      

const app = express();


const PORT = process.env.PORT ; 

// Connect MongoDB
connectDB();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));



app.use(bodyParser.json());

// Routes
const dijkstraRoutes = require('./routes/dijkstraRoutes');
const authRoutes = require('./routes/authRoutes');
const graphRoutes = require('./routes/graphRoutes');

const mstRoutes = require('./routes/mstRoutes');

const schedulerRoutes = require("./routes/scheduler");  

const { config } = require('dotenv');


app.use("/api", dijkstraRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/graphs", graphRoutes);

app.use('/api/mst', mstRoutes);
app.use("/api/mstDesign", require("./routes/mstDesignRoutes"));
app.use('/api/mst/designs', require('./routes/mstDesignRoutes'));

app.use("/api/topo", schedulerRoutes);  


app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


