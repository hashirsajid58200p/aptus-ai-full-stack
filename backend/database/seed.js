const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const Admin = require("../models/adminModel");

const seedAccounts = async () => {
  try {
    // 1. Seed Admin
    const adminEmail = "aptusai@example.com";
    let existingAdmin = await Admin.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await Admin.create({
        email: adminEmail,
        password: "AptusAI2026!",
      });
      console.log("🌱 [Seed] Super Admin created: aptusai@example.com");
    } else {
      existingAdmin.password = "AptusAI2026!";
      await existingAdmin.save();
      console.log("🌱 [Seed] Super Admin password refreshed: aptusai@example.com");
    }

    // 2. Seed Default Business (Aptus AI with landing page token)
    const landingToken = "A1ED-AC9D6DEE-46A3DFD8";
    const aptusBiz = await User.findOne({ chatbot_token: landingToken });
    if (!aptusBiz) {
      await User.create({
        name: "Aptus AI Business",
        email: "business-aptus@example.com",
        password: "AptusAI2026!",
        bussinessName: "Aptus AI",
        bussinessCategory: "AI & Automation",
        bussinessDescription: "Aptus AI delivers cutting-edge intelligent chatbot widgets, multi-model LLM generation, and automated customer support for modern SaaS platforms.",
        chatbot_token: landingToken,
        tokenLimit: 1000000,
        provider: "groq",
        modelName: "openai/gpt-oss-120b",
        bussinessDetails: [
          {
            question: "What is Aptus AI?",
            answer: "Aptus AI is a comprehensive SaaS chatbot platform that empowers companies to train, customize, and deploy AI chatbots to their websites in minutes."
          },
          {
            question: "How do I embed the chatbot widget?",
            answer: "You can install our npm package 'aptus-ai-chatbot-widget' or embed our lightweight script tag with your unique chatbot token."
          },
          {
            question: "What AI models are supported?",
            answer: "We support ultra-fast open-source models via Groq (Llama 3) as well as OpenAI GPT-4o with custom API key support."
          },
          {
            question: "Can I connect live human agents?",
            answer: "Yes! Aptus AI includes built-in live agent handoff via WebSockets with out-of-office automated lead capture."
          },
          {
            question: "What is your pricing and trial policy?",
            answer: "We offer flexible starter and enterprise tiers with a 30-day money-back satisfaction guarantee."
          }
        ],
      });
      console.log("🌱 [Seed] Default Aptus AI Chatbot created with token:", landingToken);
    }

    // 3. Seed Registered Test Businesses from Master Credentials
    const businesses = [
      {
        bussinessName: "NovaByte Digital",
        bussinessCategory: "Software & Technology",
        email: "novabytedigital@example.com",
        password: "NovaByte2026!",
        chatbot_token: "NOVABYTE-TOKEN-2026",
        bussinessDescription: "Custom cloud software, microservices architecture, and DevOps automation.",
      },
      {
        bussinessName: "VeloVita Wellness Hub",
        bussinessCategory: "Health & Fitness",
        email: "velovitawellness@example.com",
        password: "VeloVita2026!",
        chatbot_token: "VELOVITA-TOKEN-2026",
        bussinessDescription: "Holistic health coaching, nutrition plans, and personalized wellness retreats.",
      },
      {
        bussinessName: "FitLife Pro",
        bussinessCategory: "Health & Fitness",
        email: "fitlifepro@example.com",
        password: "FitLife2026!",
        chatbot_token: "FITLIFE-TOKEN-2026",
        bussinessDescription: "Personalized fitness coaching, workout tracking, and performance nutrition.",
      },
      {
        bussinessName: "NexusCloud Solutions",
        bussinessCategory: "Software & Technology",
        email: "nexuscloud@example.com",
        password: "NexusCloud2026!",
        chatbot_token: "NEXUSCLOUD-TOKEN-2026",
        bussinessDescription: "Next-generation cloud infrastructure, managed Kubernetes, and security.",
      },
    ];

    for (const biz of businesses) {
      const exists = await User.findOne({ email: biz.email });
      if (!exists) {
        await User.create({
          name: biz.bussinessName,
          email: biz.email,
          password: biz.password,
          bussinessName: biz.bussinessName,
          bussinessCategory: biz.bussinessCategory,
          bussinessDescription: biz.bussinessDescription,
          chatbot_token: biz.chatbot_token,
          tokenLimit: 500000,
          provider: "groq",
          modelName: "openai/gpt-oss-120b",
          bussinessDetails: [
            { question: "What services do you provide?", answer: biz.bussinessDescription },
            { question: "How can I contact support?", answer: `Reach out directly via ${biz.email}.` },
            { question: "What are your business hours?", answer: "Monday through Friday, 9:00 AM to 6:00 PM EST." },
            { question: "Do you offer free consultations?", answer: "Yes, we provide an initial 30-minute discovery call." },
            { question: "What payment methods do you accept?", answer: "All major credit cards, wire transfers, and PayPal." }
          ],
        });
        console.log(`🌱 [Seed] Business "${biz.bussinessName}" created.`);
      }
    }
  } catch (err) {
    console.warn("⚠️ [Seed] Seed operation error:", err.message);
  }
};

module.exports = seedAccounts;
