const User = require("../models/userModel");
const Admin = require("../models/adminModel");

// Unique credentials per seeded account (keep in sync with Notion Project Secrets + demo READMEs)
const ADMIN_PASSWORD = "AptusAdmin2026!";
const LANDING_PASSWORD = "AptusBiz2026!";

const seedAccounts = async () => {
  try {
    // 1. Seed / sync Super Admin
    const adminEmail = "aptusai@example.com";
    let existingAdmin = await Admin.findOne({ email: adminEmail }).select("+password");
    if (!existingAdmin) {
      await Admin.create({
        email: adminEmail,
        password: ADMIN_PASSWORD,
      });
      console.log("🌱 [Seed] Super Admin created: aptusai@example.com");
    } else {
      existingAdmin.password = ADMIN_PASSWORD;
      await existingAdmin.save();
    }

    // 2. Ensure Aptus AI Business exists
    const landingToken = "A1ED-AC9D6DEE-46A3DFD8";
    const aptusBiz = await User.findOne({ chatbot_token: landingToken }).select("+password");
    if (!aptusBiz) {
      await User.create({
        name: "Aptus AI Business",
        email: "business-aptus@example.com",
        password: LANDING_PASSWORD,
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
        allowedDomains: [],
        allowedDomain: null,
      });
    } else {
      aptusBiz.password = LANDING_PASSWORD;
      aptusBiz.email = "business-aptus@example.com";
      aptusBiz.allowedDomains = [];
      aptusBiz.allowedDomain = null;
      await aptusBiz.save();
    }

    // 3. Ensure Demo Businesses exist (unique passwords per account)
    const demos = [
      {
        email: "nexuscloud@example.com",
        password: "NexusCloud2026!",
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
        password: "VeloVita2026!",
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
        password: "FitLife2026!",
        token: "A1ED-E8E08127-D535E9F7",
        name: "FitLife Pro Coach",
        bussinessName: "FitLife Pro",
        bussinessCategory: "Health & Fitness",
        botName: "FitLife Assistant",
        welcomeMessage: "Hey there! Ready to level up your fitness? Ask me anything about memberships, classes, or our 3-day guest pass!",
        theme: "chatgpt",
        primaryColor: "#A3E635",
        avatar: "cyber",
      },
    ];

    for (const d of demos) {
      const exists = await User.findOne({ email: d.email }).select("+password");
      if (!exists) {
        await User.create({
          name: d.name,
          email: d.email,
          password: d.password,
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
          allowedDomains: [],
          allowedDomain: null,
        });
      } else {
        exists.botName = d.botName;
        exists.welcomeMessage = d.welcomeMessage;
        exists.theme = d.theme;
        exists.chatbotAvatar = d.avatar;
        exists.primaryColor = d.primaryColor;
        exists.chatbot_token = d.token;
        exists.password = d.password;
        exists.allowedDomains = [];
        exists.allowedDomain = null;
        await exists.save();
      }
    }
  } catch (err) {
    console.warn("⚠️ [Seed] Seed operation error:", err.message);
  }
};

module.exports = seedAccounts;
