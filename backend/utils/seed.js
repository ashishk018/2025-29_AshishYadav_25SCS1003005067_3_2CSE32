// Run with: npm run seed
require("dotenv").config();
const connectDB = require("../config/db");
const User = require("../models/User");
const Lead = require("../models/Lead");
const Customer = require("../models/Customer");
const Deal = require("../models/Deal");

const seed = async () => {
  await connectDB();

  console.log("Clearing existing data...");
  await Promise.all([User.deleteMany(), Lead.deleteMany(), Customer.deleteMany(), Deal.deleteMany()]);

  console.log("Creating users...");
  const admin = await User.create({
    name: "Admin User",
    email: "admin@crm.com",
    password: "admin123",
    role: "admin",
  });

  const sales = await User.create({
    name: "Sales Rep",
    email: "sales@crm.com",
    password: "sales123",
    role: "sales",
  });

  console.log("Creating sample leads...");
  const lead1 = await Lead.create({
    name: "Rohan Sharma",
    email: "rohan@example.com",
    phone: "9876543210",
    company: "Sharma Textiles",
    source: "Website",
    status: "Qualified",
    assignedTo: sales._id,
    createdBy: admin._id,
  });

  await Lead.create({
    name: "Priya Verma",
    email: "priya@example.com",
    phone: "9123456780",
    company: "Verma Logistics",
    source: "Referral",
    status: "New",
    assignedTo: sales._id,
    createdBy: admin._id,
  });

  console.log("Creating sample customer...");
  const customer = await Customer.create({
    name: "Rohan Sharma",
    email: "rohan@example.com",
    phone: "9876543210",
    company: "Sharma Textiles",
    industry: "Manufacturing",
    convertedFromLead: lead1._id,
    accountOwner: sales._id,
    createdBy: admin._id,
  });

  console.log("Creating sample deal...");
  await Deal.create({
    title: "Sharma Textiles - Annual Contract",
    customer: customer._id,
    value: 500000,
    stage: "Proposal",
    probability: 60,
    owner: sales._id,
  });

  console.log("✅ Seed data created successfully!");
  console.log("Admin login: admin@crm.com / admin123");
  console.log("Sales login: sales@crm.com / sales123");
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
