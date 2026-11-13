process.env.NODE_ENV = "test";
require("dotenv").config({ path: "./config/.env" });
const LLMService = require("./utils/llmService");
const assert = require("assert");

async function runDynamicModelTests() {
  console.log("🧪 ================================================================");
  console.log("🧪 TESTING LLM DYNAMIC MODEL FETCHING & FUTURE-PROOFING SUBSYSTEM");
  console.log("🧪 ================================================================\n");

  let passed = 0;
  let total = 0;

  function test(name, fn) {
    total++;
    try {
      fn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (e) {
      console.error(`❌ [FAIL] ${name}: ${e.message}`);
    }
  }

  async function testAsync(name, fn) {
    total++;
    try {
      await fn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (e) {
      console.error(`❌ [FAIL] ${name}: ${e.message}`);
    }
  }

  // 1. Fallback to Curated Defaults when no API key is provided
  await testAsync("Curated defaults fallback when API key is unconfigured", async () => {
    const providers = ['openai', 'gemini', 'anthropic', 'deepseek', 'mistral', 'perplexity', 'cohere', 'xai', 'openrouter'];
    for (const prov of providers) {
      const models = await LLMService.listModels(prov, null);
      assert(Array.isArray(models), `Models for ${prov} should be an array`);
      assert(models.length > 0, `Provider ${prov} must return curated default models even with no key`);
      assert(models[0].id && models[0].name, `Provider ${prov} model items must have id and name`);
    }
  });

  // 2. Dynamic Model Listing with live/env key for Groq
  await testAsync("Dynamic model fetching for Groq using platform key", async () => {
    LLMService.clearModelsCache();
    const models = await LLMService.listModels("groq");
    assert(Array.isArray(models) && models.length > 0, "Groq dynamic listing must return models");
    console.log(`   Found ${models.length} active models on Groq:`, models.map(m => m.id).slice(0, 3));
  });

  // 3. In-memory TTL Caching
  await testAsync("TTL caching prevents redundant network calls", async () => {
    const cacheKey = LLMService.getCacheKey("groq", process.env.GROQ_API_KEY, null);
    const cachedBefore = LLMService.modelsCache.get(cacheKey);
    assert(cachedBefore, "Cache must contain entry for Groq after previous call");

    const timestampBefore = cachedBefore.timestamp;
    // Call again immediately
    const modelsSecondCall = await LLMService.listModels("groq");
    const cachedAfter = LLMService.modelsCache.get(cacheKey);

    assert.strictEqual(cachedAfter.timestamp, timestampBefore, "Cache timestamp should not change on cache hit");
    assert.strictEqual(modelsSecondCall.length, cachedBefore.data.length, "Returned data should match cached data");

    // Test forceRefresh bypasses cache
    const modelsRefreshed = await LLMService.listModels("groq", null, null, { forceRefresh: true });
    assert(Array.isArray(modelsRefreshed) && modelsRefreshed.length > 0, "forceRefresh should succeed and reload models");
  });

  // 4. Resilience: Graceful fallback when provider endpoint is unreachable or throws
  await testAsync("Graceful fallback to curated defaults when provider is unreachable", async () => {
    // Test with invalid base URL for custom provider
    const unreachableModels = await LLMService.listModels("custom", "key", "https://invalid-non-existent-domain-12345.ai/v1");
    assert(Array.isArray(unreachableModels), "Should return array on network failure");
    assert(unreachableModels.length > 0, "Should return curated fallback when endpoint is unreachable");
  });

  // 5. listAllConnectedModels handles both connected and unconfigured providers
  await testAsync("listAllConnectedModels populates connected and preview providers", async () => {
    const mockUser = {
      groqApiKey: null, // Should use process.env.GROQ_API_KEY
      openaiApiKey: null,
      geminiApiKey: null,
    };
    const res = await LLMService.listAllConnectedModels(mockUser);
    assert(Array.isArray(res.connectedProviders), "connectedProviders must be an array");
    assert(res.connectedProviders.includes("groq"), "Groq must be connected via platform env key");
    assert(res.modelsByProvider.groq.length > 0, "groq modelsByProvider must have models");
    assert(res.modelsByProvider.openai.length > 0, "openai modelsByProvider must have preview models");
    assert.strictEqual(res.modelsByProvider.openai[0].isConfigured, false, "Unconfigured providers must have isConfigured: false");
    assert.strictEqual(res.modelsByProvider.groq[0].isConfigured, true, "Connected provider must have isConfigured: true");
  });

  // 6. Model Deprecation Graceful Recovery during text generation
  await testAsync("Graceful deprecation recovery: deprecated model automatically recovers to fallback", async () => {
    const llm = new LLMService({
      provider: "groq",
      model: "llama-3.1-70b-versatile", // Decommissioned on Groq
    });

    console.log("   Calling generateText with decommissioned model 'llama-3.1-70b-versatile'...");
    const result = await llm.generateText("Hello, reply with single word: OK");
    assert(result.text && result.text.length > 0, "Response must not be empty");
    assert(result.activeModel, "Must specify activeModel used");
    console.log(`   Recovery successful! Used activeModel: ${result.activeModel}, response: "${result.text.trim()}"`);
  });

  // 7. Deprecation error detector regex/checks
  test("isModelDeprecationOrNotFoundError accurately identifies deprecation errors", () => {
    const err1 = new Error("The model `llama-3.1-70b-versatile` has been decommissioned on 2025-02-15.");
    const err2 = { status: 404, message: "model 'text-davinci-003' not found" };
    const err3 = { code: "model_decommissioned", message: "model decommissioned" };
    const err4 = { type: "not_found_error", message: "model: claude-2.0 is not available" };
    const err5 = new Error("Invalid API key provided");

    assert(LLMService.isModelDeprecationOrNotFoundError(err1), "Must match decommissioned Groq model");
    assert(LLMService.isModelDeprecationOrNotFoundError(err2), "Must match 404 model not found");
    assert(LLMService.isModelDeprecationOrNotFoundError(err3), "Must match model_decommissioned code");
    assert(LLMService.isModelDeprecationOrNotFoundError(err4), "Must match not_found_error");
    assert(!LLMService.isModelDeprecationOrNotFoundError(err5), "Must NOT flag normal auth error as model deprecation");
  });

  // 8. Controller Endpoint: getAvailableModels (provider=all)
  await testAsync("userController.getAvailableModels handles provider=all", async () => {
    const { getAvailableModels } = require("./controllers/userController");
    const mockReq = {
      user: {
        provider: "groq",
        modelName: "openai/gpt-oss-120b",
        groqApiKey: null,
      },
      query: { provider: "all" },
      body: {},
    };
    let responseData = null;
    let statusCode = 200;
    const mockRes = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        responseData = data;
        return this;
      },
    };

    await getAvailableModels(mockReq, mockRes, () => {});
    assert.strictEqual(statusCode, 200, "Must return status 200");
    assert(responseData.success, "success must be true");
    assert(Array.isArray(responseData.connectedProviders), "connectedProviders must be returned");
    assert(responseData.modelsByProvider.groq.length > 0, "modelsByProvider must be populated");
  });

  // 9. Controller Endpoint: getAvailableModels model validation and deprecation detection
  await testAsync("userController.getAvailableModels checks isCurrentModelValid", async () => {
    const { getAvailableModels } = require("./controllers/userController");
    // Test with active model
    const mockReqValid = {
      user: {
        provider: "groq",
        modelName: "openai/gpt-oss-120b",
        groqApiKey: null,
      },
      query: { provider: "groq" },
      body: {},
    };
    let responseValid = null;
    await getAvailableModels(mockReqValid, {
      status() { return this; },
      json(data) { responseValid = data; return this; }
    }, () => {});

    assert(responseValid.success, "Response must succeed");
    assert.strictEqual(responseValid.isCurrentModelValid, true, "Active model must have isCurrentModelValid: true");

    // Test with deprecated model
    const mockReqDeprecated = {
      user: {
        provider: "groq",
        modelName: "decommissioned-llama-model-xyz",
        groqApiKey: null,
      },
      query: { provider: "groq" },
      body: {},
    };
    let responseDeprecated = null;
    await getAvailableModels(mockReqDeprecated, {
      status() { return this; },
      json(data) { responseDeprecated = data; return this; }
    }, () => {});

    assert(responseDeprecated.success, "Response must succeed even for deprecated model");
    assert.strictEqual(responseDeprecated.isCurrentModelValid, false, "Deprecated model must have isCurrentModelValid: false");
  });

  console.log(`\n🏁 Dynamic Model & Deprecation Suite Complete: ${passed}/${total} passed`);
  if (passed === total) {
    console.log("🎉 ALL DYNAMIC MODEL FETCHING & FUTURE-PROOFING TESTS PASSED!\n");
  } else {
    process.exitCode = 1;
  }
}

runDynamicModelTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
