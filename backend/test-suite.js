require("dotenv").config({ path: "./config/.env" });
const { connectDB } = require("./database/database");
const http = require("http");
const app = require("./index");
const { initSocket } = require("./sockets/socketHandler");
const LLMService = require("./utils/llmService");
const RAGService = require("./utils/ragService");
const FunctionCallingEngine = require("./utils/functionCalling");
const User = require("./models/userModel");
const Session = require("./models/sessionModel");
const Lead = require("./models/leadModel");
const KnowledgeBase = require("./models/knowledgeBaseModel");
const Message = require("./models/messageModel");
const { io: Client } = require("../frontend/node_modules/socket.io-client");

async function runTestSuite() {
  console.log("🧪 ===========================================================");
  console.log("🧪 STARTING COMPREHENSIVE END-TO-END VERIFICATION TEST SUITE");
  console.log("🧪 ===========================================================\n");

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, testName) {
    totalTests++;
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passedTests++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      process.exitCode = 1;
    }
  }

  try {
    // 1. Database Connection
    console.log("🔹 Step 1: Connecting to MongoDB Atlas...");
    await connectDB();
    assert(true, "MongoDB Atlas database connected successfully");

    // 2. Multi-Model LLM Service (Groq)
    console.log("\n🔹 Step 2: Testing Multi-Model LLM Service with Groq (Llama 3)...");
    const llm = new LLMService({ provider: "groq" });
    const groqRes = await llm.generateText("Reply with the single word: CONFIRMED");
    console.log(`   Groq Response: "${groqRes.text.trim()}" (tokens: ${groqRes.usage.totalTokens})`);
    assert(
      groqRes.text.length > 0 && groqRes.usage.totalTokens > 0,
      "Groq Llama 3 generated text and tracked token usage"
    );

    // Multi-Model LLM Service (OpenAI Config Validation)
    console.log("\n🔹 Step 2b: Testing Multi-Model LLM Service Provider Switching...");
    const openaiLLM = new LLMService({ provider: "openai", model: "gpt-4o" });
    assert(openaiLLM.provider === "openai" && openaiLLM.model === "gpt-4o", "Multi-model provider switching correctly instantiates OpenAI configuration");

    // 3. RAG Knowledge Base Ingestion & Semantic Search
    console.log("\n🔹 Step 3: Testing RAG Knowledge Base Ingestion & Vector Retrieval...");
    // Find or pick a test user
    let testUser = await User.findOne();
    if (!testUser) {
      testUser = await User.create({
        name: "Test Business",
        email: `test-${Date.now()}@example.com`,
        password: "Password123!",
        chatbot_token: `token-${Date.now()}`,
        bussinessName: "Aptus Test Labs",
        bussinessCategory: "Software & Technology",
        bussinessDescription: "Automated testing lab for AI chatbots",
        bussinessDetails: [
          { question: "What is your return policy?", answer: "30-day money-back guarantee." },
          { question: "Where are you located?", answer: "San Francisco, CA." },
          { question: "Do you ship worldwide?", answer: "Yes, worldwide shipping is free." },
          { question: "How to contact support?", answer: "Email support@aptus.ai anytime." },
          { question: "What payment methods do you accept?", answer: "Visa, Mastercard, and PayPal." },
        ],
      });
    }

    const testDocTitle = `Refund Policy Test Doc ${Date.now()}`;
    const testDocText = "Aptus AI guarantees full refunds within 30 days of purchase for all enterprise and starter subscriptions without questions asked. Contact billing@aptus.ai to initiate a refund.";
    
    const ingestResult = await RAGService.ingestDocument({
      chatbotId: testUser._id,
      sourceType: "text",
      title: testDocTitle,
      text: testDocText,
    });
    assert(ingestResult.chunksCount > 0, `RAG ingested document into ${ingestResult.chunksCount} chunks`);

    const ragContext = await RAGService.searchRelevantContext(testUser._id, "How do I get a refund?", 2);
    console.log(`   RAG Retrieved Context snippet: "${ragContext.substring(0, 100)}..."`);
    assert(
      ragContext.includes("refunds within 30 days"),
      "RAG vector semantic search successfully retrieved relevant policy chunk"
    );

    // Clean up test RAG chunk
    await KnowledgeBase.deleteMany({ chatbotId: testUser._id, title: testDocTitle });

    // 4. Function Calling Engine
    console.log("\n🔹 Step 4: Testing Generic Function Calling & Action Execution...");
    const toolIntent = FunctionCallingEngine.detectToolIntent("Please check order status for ORD-99214");
    assert(
      toolIntent && toolIntent.toolName === "check_order_status",
      "FunctionCallingEngine accurately detected order status intent"
    );

    const toolExecution = await FunctionCallingEngine.executeTool(toolIntent.toolName, toolIntent.args);
    assert(
      toolExecution.result.status.includes("In Transit") && toolExecution.clientAction.type === "CHECK_ORDER_STATUS",
      "FunctionCallingEngine executed tool and created client action payload"
    );

    // 5. Lead Generation & Pre-Chat Form
    console.log("\n🔹 Step 5: Testing Pre-Chat and Offline Lead Capture...");
    const testLead = await Lead.create({
      name: "Alex Smith",
      email: "alex.smith@test.com",
      phone: "+1-555-0199",
      chatbotId: testUser._id,
      source: "pre_chat",
      message: "Looking for pricing details",
    });
    assert(testLead && testLead._id, "Lead successfully captured with Name, Email, and Phone");
    await Lead.findByIdAndDelete(testLead._id);

    // 6. Token Tracking & Quota Enforcement
    console.log("\n🔹 Step 6: Testing Token Tracking & Daily Usage Recording...");
    const { recordTokenUsage } = require("./middleware/tokenTracker");
    const initialTokens = testUser.tokenUsage?.totalTokens || 0;
    await recordTokenUsage(testUser._id, 150);
    const updatedUser = await User.findById(testUser._id);
    assert(
      (updatedUser.tokenUsage?.totalTokens || 0) === initialTokens + 150,
      `Token tracker recorded 150 consumed tokens (Total: ${updatedUser.tokenUsage?.totalTokens})`
    );

    // 7. Discord Webhook Integration
    console.log("\n🔹 Step 7: Testing Discord Bot Webhook Architecture...");
    const { handleDiscordWebhook } = require("./controllers/discordController");
    const discordResult = await new Promise(async (resolve) => {
      const discordReq = {
        body: {
          content: "What is your return policy?",
          chatbot_token: testUser.chatbot_token,
        },
        headers: {},
        query: {},
      };
      const discordRes = {
        statusCode: 200,
        status(code) {
          this.statusCode = code;
          return this;
        },
        json(data) {
          resolve({ status: this.statusCode, body: data });
          return this;
        },
      };
      await handleDiscordWebhook(discordReq, discordRes, (err) => resolve({ status: 500, error: err }));
    });

    assert(
      discordResult.status === 200 && discordResult.body && discordResult.body.reply,
      `Discord Webhook responded with AI message (Reply length: ${discordResult.body?.reply?.length} chars)`
    );

    // 8. Live Agent Socket.io Integration
    console.log("\n🔹 Step 8: Testing Live Agent Handoff via Socket.io...");
    const testServer = http.createServer(app);
    initSocket(testServer);
    await new Promise((resolve) => testServer.listen(0, resolve));
    const testPort = testServer.address().port;

    const socketUrl = `http://127.0.0.1:${testPort}`;
    const clientSocket = Client(socketUrl, { transports: ["websocket"] });

    await new Promise((resolve) => {
      clientSocket.on("connect", () => {
        console.log("   Client socket connected to test server");
        clientSocket.emit("join_session", {
          sessionId: "test-session-123",
          chatbotId: testUser._id.toString(),
        });

        // Request human agent
        clientSocket.emit("request_human_agent", {
          sessionId: "test-session-123",
          chatbotId: testUser._id.toString(),
          userDetails: { name: "Test User", email: "test@example.com" },
        });
      });

      // Expect offline fallback since no agent socket is active
      clientSocket.on("human_agent_offline", (data) => {
        assert(
          data.available === false && data.message.includes("Right now our team is offline"),
          "Live agent handoff correctly triggered out-of-office message when agents are offline"
        );
        clientSocket.disconnect();
        testServer.close();
        resolve();
      });
    });

    console.log("\n===========================================================");
    console.log(`🎉 TEST SUMMARY: ${passedTests}/${totalTests} TESTS PASSED!`);
    console.log("===========================================================\n");

    if (passedTests === totalTests) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ TEST SUITE FAILED WITH EXCEPTION:", err);
    process.exit(1);
  }
}

runTestSuite();
