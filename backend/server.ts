import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5001;

// Setup Multer for file uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadDir));

// Helpers
const generateComplaintId = () => 'CYB-' + Math.floor(100000 + Math.random() * 900000);

// Routes
// 1. Get Live Alerts
app.get('/api/alerts', async (req, res) => {
  try {
    const alerts = await prisma.alert.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// 2. Submit Complaint
app.post('/api/complaints', upload.single('evidence'), async (req, res) => {
  try {
    const { category, description } = req.body;
    const file = req.file;

    const newComplaint = await prisma.complaint.create({
      data: {
        id: generateComplaintId(),
        category,
        description,
        status: 'filed',
        evidenceUrl: file ? `/uploads/${file.filename}` : null
      }
    });

    res.status(201).json({ 
      message: 'Complaint filed successfully', 
      complaintId: newComplaint.id 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit complaint' });
  }
});

// 3. Track Complaint
app.get('/api/complaints/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const complaint = await prisma.complaint.findUnique({
      where: { id }
    });

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Node Cyber Server running on http://localhost:${PORT}`);
});
