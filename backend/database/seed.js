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
        chatbotAvatar: "chat",
        theme: "aptus",
        primaryColor: "#FF4D00",
        textColor: "#FFFFFF",
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
  } catch (err) {
    console.warn("⚠️ [Seed] Seed operation error:", err.message);
  }
};

module.exports = seedAccounts;
