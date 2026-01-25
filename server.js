const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'enrollments.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve static files from current directory

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/enroll', (req, res) => {
    const newEnrollment = req.body;

    // Add timestamp
    newEnrollment.timestamp = new Date().toISOString();

    console.log('Received enrollment:', newEnrollment);

    // Read existing data
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Error saving data' });
        }

        const enrollments = JSON.parse(data || '[]');
        enrollments.push(newEnrollment);

        // Write back to file
        fs.writeFile(DATA_FILE, JSON.stringify(enrollments, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: 'Error saving data' });
            }
            res.json({ success: true, message: 'Enrollment successful!' });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Enrollment data will be saved to ${DATA_FILE}`);
});
