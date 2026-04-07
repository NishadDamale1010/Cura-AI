require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('../src/config/db');
const User = require('../src/models/User');
const HealthRecord = require('../src/models/HealthRecord');
const Alert = require('../src/models/Alert');

const PASS_HASH = bcrypt.hashSync('password123', 10);

const doctors = [
  { name: 'Dr. Aisha Sharma', email: 'aisha@cura.ai', password: PASS_HASH, role: 'doctor' },
  { name: 'Dr. Rajesh Patel', email: 'rajesh@cura.ai', password: PASS_HASH, role: 'doctor' },
  { name: 'Dr. Priya Nair', email: 'priya@cura.ai', password: PASS_HASH, role: 'doctor' },
  { name: 'Dr. Vikram Singh', email: 'vikram@cura.ai', password: PASS_HASH, role: 'doctor' },
  { name: 'Dr. Meena Gupta', email: 'meena@cura.ai', password: PASS_HASH, role: 'doctor' },
];

const patients = [
  { name: 'Arjun Mehta', email: 'arjun@cura.ai', password: PASS_HASH, role: 'patient' },
  { name: 'Sneha Reddy', email: 'sneha@cura.ai', password: PASS_HASH, role: 'patient' },
  { name: 'Kabir Das', email: 'kabir@cura.ai', password: PASS_HASH, role: 'patient' },
  { name: 'Ananya Iyer', email: 'ananya@cura.ai', password: PASS_HASH, role: 'patient' },
  { name: 'Rohan Joshi', email: 'rohan@cura.ai', password: PASS_HASH, role: 'patient' },
  { name: 'Divya Kapoor', email: 'divya@cura.ai', password: PASS_HASH, role: 'patient' },
  { name: 'Amit Verma', email: 'amit@cura.ai', password: PASS_HASH, role: 'patient' },
  { name: 'Pooja Banerjee', email: 'pooja@cura.ai', password: PASS_HASH, role: 'patient' },
  { name: 'Nikhil Rao', email: 'nikhil@cura.ai', password: PASS_HASH, role: 'patient' },
  { name: 'Riya Choudhary', email: 'riya@cura.ai', password: PASS_HASH, role: 'patient' },
];

const cities = [
  { city: 'Mumbai', area: 'Andheri', pincode: '400053', region: 'Maharashtra', lat: 19.1136, lng: 72.8697 },
  { city: 'Delhi', area: 'Connaught Place', pincode: '110001', region: 'Delhi', lat: 28.6315, lng: 77.2167 },
  { city: 'Bangalore', area: 'Koramangala', pincode: '560034', region: 'Karnataka', lat: 12.9352, lng: 77.6245 },
  { city: 'Pune', area: 'Kothrud', pincode: '411038', region: 'Maharashtra', lat: 18.5074, lng: 73.8077 },
  { city: 'Chennai', area: 'T. Nagar', pincode: '600017', region: 'Tamil Nadu', lat: 13.0418, lng: 80.2341 },
  { city: 'Hyderabad', area: 'Banjara Hills', pincode: '500034', region: 'Telangana', lat: 17.4156, lng: 78.4347 },
  { city: 'Kolkata', area: 'Salt Lake', pincode: '700091', region: 'West Bengal', lat: 22.5726, lng: 88.4159 },
  { city: 'Ahmedabad', area: 'Navrangpura', pincode: '380009', region: 'Gujarat', lat: 23.0369, lng: 72.5594 },
  { city: 'Jaipur', area: 'Malviya Nagar', pincode: '302017', region: 'Rajasthan', lat: 26.8583, lng: 75.8089 },
  { city: 'Lucknow', area: 'Gomti Nagar', pincode: '226010', region: 'Uttar Pradesh', lat: 26.8563, lng: 80.9893 },
];

const diseases = [
  { name: 'Dengue Fever', symptoms: ['fever', 'headache', 'body pain', 'nausea'], severity: 'High' },
  { name: 'Malaria', symptoms: ['fever', 'chills', 'fatigue', 'headache'], severity: 'High' },
  { name: 'COVID-19', symptoms: ['fever', 'cough', 'breathing issues', 'fatigue', 'loss of taste'], severity: 'High' },
  { name: 'Influenza', symptoms: ['fever', 'cough', 'sore throat', 'body pain'], severity: 'Moderate' },
  { name: 'Typhoid', symptoms: ['fever', 'fatigue', 'headache', 'nausea'], severity: 'Moderate' },
  { name: 'Gastroenteritis', symptoms: ['nausea', 'diarrhea', 'fatigue'], severity: 'Mild' },
  { name: 'Common Cold', symptoms: ['cough', 'sore throat', 'headache'], severity: 'Mild' },
  { name: 'Bronchitis', symptoms: ['cough', 'breathing issues', 'fatigue'], severity: 'Moderate' },
  { name: 'Tuberculosis', symptoms: ['cough', 'fever', 'fatigue', 'breathing issues'], severity: 'Severe' },
  { name: 'Chikungunya', symptoms: ['fever', 'body pain', 'headache', 'nausea'], severity: 'High' },
];

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function daysAgo(n) { const d = new Date(); d.setDate(d.getDate() - n); return d; }

async function seed() {
  await connectDB();
  console.log('Connected to MongoDB. Seeding...');

  await Promise.all([User.deleteMany({}), HealthRecord.deleteMany({}), Alert.deleteMany({})]);
  console.log('Cleared existing data.');

  const createdDoctors = await User.insertMany(doctors);
  const createdPatients = await User.insertMany(patients);
  console.log(`Created ${createdDoctors.length} doctors and ${createdPatients.length} patients.`);

  const allRecords = [];
  for (const patient of createdPatients) {
    const numRecords = rand(3, 8);
    for (let i = 0; i < numRecords; i++) {
      const disease = pick(diseases);
      const loc = pick(cities);
      const riskLevel = disease.severity === 'Severe' || disease.severity === 'High' ? 'High' : disease.severity === 'Moderate' ? 'Medium' : 'Low';
      const probability = riskLevel === 'High' ? (rand(70, 95) / 100) : riskLevel === 'Medium' ? (rand(40, 69) / 100) : (rand(10, 39) / 100);
      const assignedDoctor = pick(createdDoctors);

      allRecords.push({
        userId: patient._id,
        personalDetails: {
          name: patient.name,
          age: rand(18, 65),
          gender: pick(['Male', 'Female']),
          city: loc.city,
          area: loc.area,
          pincode: loc.pincode,
        },
        symptoms: disease.symptoms.map((s) => ({ name: s, severity: pick(['Low', 'Mild', 'Moderate', 'High', 'Severe']) })),
        location: { city: loc.city, area: loc.area, pincode: loc.pincode, region: loc.region, lat: loc.lat + (Math.random() - 0.5) * 0.1, lng: loc.lng + (Math.random() - 0.5) * 0.1 },
        vitals: { bodyTemperature: +(97.5 + Math.random() * 4.5).toFixed(1), spo2: rand(88, 99), heartRate: rand(60, 110) },
        humidity: rand(40, 90),
        durationDays: rand(1, 14),
        risk: riskLevel,
        probability,
        explanation: `Patient presents with ${disease.symptoms.join(', ')}. Predicted ${disease.name} with ${(probability * 100).toFixed(0)}% confidence.`,
        diagnosis: {
          diseaseName: disease.name,
          severity: pick(['Mild', 'Moderate', 'Severe']),
          status: pick(['Suspected', 'Confirmed', 'Recovered']),
          medicines: pick(['Paracetamol 500mg', 'Azithromycin 250mg', 'Doxycycline 100mg', 'ORS + Zinc', 'Cough Syrup', 'Ibuprofen 400mg', 'Amoxicillin 500mg']),
          advice: pick(['Rest and hydrate', 'Follow up in 3 days', 'Immediate hospitalization', 'Home quarantine', 'Blood test recommended']),
          updatedBy: assignedDoctor._id,
          updatedAt: daysAgo(rand(0, 5)),
        },
        createdAt: daysAgo(rand(0, 60)),
      });
    }
  }

  const createdRecords = await HealthRecord.insertMany(allRecords);
  console.log(`Created ${createdRecords.length} health records.`);

  const alertMessages = [
    'Dengue outbreak detected — 15 cases in 48 hours',
    'COVID-19 cluster identified near hospital zone',
    'Malaria surge — high mosquito density reported',
    'Unusual spike in respiratory infections',
    'Typhoid cases rising — water contamination suspected',
    'Chikungunya alert — 8 new cases this week',
    'Flu season peak — vaccination recommended',
    'Gastroenteritis cluster near food market area',
    'TB screening advised for high-risk area',
    'Air quality deteriorating — respiratory precautions advised',
  ];

  const alerts = [];
  for (let i = 0; i < 25; i++) {
    const loc = pick(cities);
    const rec = pick(createdRecords);
    alerts.push({
      location: `${loc.area}, ${loc.city}`,
      message: pick(alertMessages),
      risk: pick(['Low', 'Medium', 'High']),
      timestamp: daysAgo(rand(0, 14)),
      recordId: rec._id,
    });
  }

  await Alert.insertMany(alerts);
  console.log(`Created ${alerts.length} alerts.`);

  console.log('\n=== SEED COMPLETE ===');
  console.log('\nLogin Credentials (password for all: password123):');
  console.log('\n--- Doctors ---');
  doctors.forEach((d) => console.log(`  ${d.name}: ${d.email}`));
  console.log('\n--- Patients ---');
  patients.forEach((p) => console.log(`  ${p.name}: ${p.email}`));
  console.log('\n================\n');

  process.exit(0);
}

seed().catch((err) => { console.error('Seed failed:', err); process.exit(1); });
