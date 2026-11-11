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
    }

    // 2. Ensure Aptus AI Business exists
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
      });
    }

    // 3. Ensure Demo Businesses exist
    const demos = [
      {
        email: "nexuscloud@example.com",
        token: "A1ED-CD70379B-E72B6C6D",
        name: "NexusCloud Admin",
        bussinessName: "NexusCloud Solutions",
        bussinessCategory: "Software & Technology",
        botName: "NexusCloud Assistant",
        welcomeMessage: "Welcome to NexusCloud Solutions. How can I assist you with your cloud infrastructure today?",
        theme: "compute",
        primaryColor: "#6366F1",
        avatar: "bot",
      },
      {
        email: "velovitawellness@example.com",
        token: "A1ED-EEB2866D-48C86113",
        name: "VeloVita Manager",
        bussinessName: "VeloVita Wellness Hub",
        bussinessCategory: "Health & Fitness",
        botName: "VeloVita Guide",
        welcomeMessage: "Welcome to VeloVita Wellness Sanctuary! How can I assist you with your fitness and recovery goals?",
        theme: "boty",
        primaryColor: "#10B981",
        avatar: "smart",
      },
      {
        email: "fitlifepro@example.com",
        token: "A1ED-E8E08127-D535E9F7",
        name: "FitLife Pro Coach",
        bussinessName: "FitLife Pro",
        bussinessCategory: "Health & Fitness",
        botName: "FitLife Assistant",
        welcomeMessage: "Hey there! Ready to level up your fitness? Ask me anything about memberships, classes, or our 3-day guest pass!",
        theme: "chatgpt",
        primaryColor: "#A3E635",
        avatar: "cyber",
      }
    ];

    for (const d of demos) {
      const exists = await User.findOne({ email: d.email });
      if (!exists) {
        await User.create({
          name: d.name,
          email: d.email,
          password: "AptusAI2026!",
          bussinessName: d.bussinessName,
          bussinessCategory: d.bussinessCategory,
          botName: d.botName,
          welcomeMessage: d.welcomeMessage,
          chatbot_token: d.token,
          chatbotAvatar: d.avatar,
          theme: d.theme,
          primaryColor: d.primaryColor,
          textColor: "#FFFFFF",
          tokenLimit: 1000000,
          provider: "groq",
          modelName: "openai/gpt-oss-120b",
        });
      } else {
        // Sync bot branding if missing or unconfigured
        await User.updateOne(
          { email: d.email },
          {
            $set: {
              botName: d.botName,
              welcomeMessage: d.welcomeMessage,
              theme: d.theme,
              chatbotAvatar: d.avatar,
              primaryColor: d.primaryColor,
              chatbot_token: d.token,
            }
          }
        );
      }
    }
  } catch (err) {
    console.warn("⚠️ [Seed] Seed operation error:", err.message);
  }
};

module.exports = seedAccounts;
