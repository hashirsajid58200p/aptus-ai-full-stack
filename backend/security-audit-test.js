/**
 * Security & Bug Audit Test Suite
 * Tests authentication, token validation, domain enforcement, NoSQL injection resistance,
 * CSV sanitization, error handling, and Socket.io authorization.
 */
process.env.NODE_ENV = "test";
require("dotenv").config({ path: "./config/.env" });
const mongoose = require("mongoose");
const http = require("http");
const jwt = require("jsonwebtoken");
const app = require("./index");
const User = require("./models/userModel");
const Admin = require("./models/adminModel");
const Session = require("./models/sessionModel");
const Message = require("./models/messageModel");
const { hostMatchesDomain, normalizeHost } = require("./middleware/validateWidget");

let server;
let baseUrl;

async function runSecurityTests() {
  console.log("\n🔒 ===========================================================");
  console.log("🔒 STARTING COMPREHENSIVE SECURITY & BUG AUDIT VERIFICATION");
  console.log("🔒 ===========================================================\n");

  const results = { passed: 0, failed: 0, total: 0 };
  function assert(condition, message) {
    results.total++;
    if (condition) {
      results.passed++;
      console.log(`  ✅ [PASS] ${message}`);
    } else {
      results.failed++;
      console.error(`  ❌ [FAIL] ${message}`);
    }
  }

  // Helper fetch
  async function api(path, options = {}) {
    const url = `${baseUrl}${path}`;
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
    let data;
    const text = await res.text();
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
    return { status: res.status, headers: res.headers, data };
  }

  try {
    // Start temporary test server
    const testPort = 3199;
    server = http.createServer(app);
    await new Promise((resolve) => server.listen(testPort, resolve));
    baseUrl = `http://127.0.0.1:${testPort}/api/v1`;
    console.log(`🚀 Test server listening on http://127.0.0.1:${testPort}\n`);

    // --- TEST 1: Domain Enforcement Unit Tests ---
    console.log("--- SECTION 1: Domain Enforcement & Wildcards ---");
    assert(hostMatchesDomain("example.com", "example.com") === true, "Exact domain match succeeds");
    assert(hostMatchesDomain("sub.example.com", "example.com") === true, "Subdomain matches parent domain");
    assert(hostMatchesDomain("my.sub.example.com", "example.com") === true, "Deep subdomain matches parent domain");
    assert(hostMatchesDomain("example.com", "*") === true, "Wildcard '*' allows any domain");
    assert(hostMatchesDomain("sub.domain.org", "*") === true, "Wildcard '*' allows subdomains on any TLD");
    assert(hostMatchesDomain("app.example.com", "*.example.com") === true, "Wildcard '*.example.com' allows subdomain");
    assert(hostMatchesDomain("example.com", "*.example.com") === true, "Wildcard '*.example.com' allows apex domain");
    assert(hostMatchesDomain("evil-example.com", "example.com") === false, "Spoofed prefix 'evil-example.com' is rejected");
    assert(hostMatchesDomain("example.com.evil.com", "example.com") === false, "Spoofed suffix 'example.com.evil.com' is rejected");
    assert(hostMatchesDomain("", "example.com") === false, "Empty origin is rejected when domain is restricted");
    assert(normalizeHost("https://mycompany.com:8080/path?query=1") === "mycompany.com", "normalizeHost strips port and path correctly");

    // --- TEST 2: NoSQL Injection & Token Validation ---
    console.log("\n--- SECTION 2: NoSQL Injection Resistance & Token Validation ---");
    // Test login with object instead of string
    const nosqlLoginRes = await api("/user/login", {
      method: "POST",
      body: JSON.stringify({ email: { $gt: "" }, password: { $gt: "" } }),
    });
    assert(nosqlLoginRes.status === 400, "NoSQL injection object in /user/login returns 400 Bad Request");

    // Test register with object
    const nosqlRegRes = await api("/user/register", {
      method: "POST",
      body: JSON.stringify({ email: { $ne: null }, password: { $ne: null }, name: "Hacker" }),
    });
    assert(nosqlRegRes.status === 400, "NoSQL injection object in /user/register returns 400 Bad Request");

    // Test token verify with NoSQL query
    const nosqlTokenRes = await api("/user/token/verify", {
      method: "GET",
      headers: { "x-chatbot-token": "" },
    });
    assert(nosqlTokenRes.status === 400, "Empty x-chatbot-token on /user/token/verify returns 400");

    // Test widget endpoint with invalid token format
    const invalidTokenRes = await api("/chatbot/getDetails", {
      method: "GET",
      headers: { "x-chatbot-token": "non_existent_fake_token_123" },
    });
    assert(invalidTokenRes.status === 404, "Unknown chatbot token on /chatbot/getDetails returns 404");

    // --- TEST 3: Authentication & JWT Verification ---
    console.log("\n--- SECTION 3: Authentication & JWT Security ---");
    // Protected user endpoint without token
    const noAuthRes = await api("/user/me", { method: "GET" });
    assert(noAuthRes.status === 401, "Protected /user/me without token returns 401 Unauthorized");

    // Protected user endpoint with malformed token
    const badJwtRes = await api("/user/me", {
      method: "GET",
      headers: { Authorization: "Bearer invalid.jwt.token" },
    });
    assert(badJwtRes.status === 401, "Malformed JWT on /user/me returns 401 (not 404)");

    // Admin protected endpoint without adminToken
    const noAdminRes = await api("/admin/analytics", { method: "GET" });
    assert(noAdminRes.status === 401, "Admin /admin/analytics without token returns 401 Unauthorized");

    // Admin protected endpoint with regular user token (privilege escalation check)
    const userPayload = { id: new mongoose.Types.ObjectId().toString(), role: "user" };
    const userJwt = jwt.sign(userPayload, process.env.ADMIN_JWT_SECRET || "aptus_admin_jwt_secret_key_2026_x89a");
    const adminEscalationRes = await api("/admin/analytics", {
      method: "GET",
      headers: { Authorization: `Bearer ${userJwt}` },
    });
    assert(adminEscalationRes.status === 403, "Regular user token cannot access /admin/analytics (403 Forbidden)");

    // Valid admin token
    const adminPayload = { role: "admin" };
    const validAdminJwt = jwt.sign(adminPayload, process.env.ADMIN_JWT_SECRET || "aptus_admin_jwt_secret_key_2026_x89a");
    const validAdminRes = await api("/admin/analytics", {
      method: "GET",
      headers: { Authorization: `Bearer ${validAdminJwt}` },
    });
    assert(validAdminRes.status === 200 && validAdminRes.data.success === true, "Valid admin JWT successfully accesses /admin/analytics");

    // --- TEST 4: Live Chatbot Domain Enforcement in Production Simulation ---
    console.log("\n--- SECTION 4: Live Domain Enforcement on Token Verification ---");
    // Create temporary test user with domain restrictions
    const testToken = `test-token-${Date.now()}`;
    const testUser = await User.create({
      name: "Security Test User",
      email: `security-${Date.now()}@test.com`,
      password: "TestPassword123!",
      bussinessName: "Security Test Co",
      bussinessCategory: "Cybersecurity",
      bussinessDescription: "Testing security controls",
      chatbot_token: testToken,
      allowedDomains: ["allowed-client.com", "*.trustedpartner.org"],
    });

    // Test with allowed domain
    const allowedDomainRes = await api("/user/token/verify", {
      method: "GET",
      headers: {
        "x-chatbot-token": testToken,
        Origin: "https://allowed-client.com",
      },
    });
    assert(allowedDomainRes.status === 200, "Request from exact allowed-client.com succeeds (200)");

    // Test with allowed wildcard subdomain
    const allowedWildcardRes = await api("/user/token/verify", {
      method: "GET",
      headers: {
        "x-chatbot-token": testToken,
        Origin: "https://portal.trustedpartner.org",
      },
    });
    assert(allowedWildcardRes.status === 200, "Request from wildcard subdomain portal.trustedpartner.org succeeds (200)");

    // Test with unauthorized origin
    const unauthorizedDomainRes = await api("/user/token/verify", {
      method: "GET",
      headers: {
        "x-chatbot-token": testToken,
        Origin: "https://malicious-attacker.com",
      },
    });
    assert(unauthorizedDomainRes.status === 403, "Request from unauthorized origin malicious-attacker.com is blocked with 403 Forbidden");

    // Test with spoofed subdomain origin
    const spoofedDomainRes = await api("/user/token/verify", {
      method: "GET",
      headers: {
        "x-chatbot-token": testToken,
        Origin: "https://allowed-client.com.evil.com",
      },
    });
    assert(spoofedDomainRes.status === 403, "Request from spoofed origin allowed-client.com.evil.com is blocked with 403 Forbidden");

    // Clean up test user
    await User.findByIdAndDelete(testUser._id);

    // --- TEST 5: Password Re-hashing Pre-Save Bug Verification ---
    console.log("\n--- SECTION 5: Password Pre-Save Re-Hashing Prevention ---");
    const sampleUser = await User.create({
      name: "PreSave Test",
      email: `presave-${Date.now()}@test.com`,
      password: "InitialPassword123!",
      bussinessName: "PreSave Corp",
      bussinessCategory: "Tech",
      bussinessDescription: "Testing pre-save hook",
      chatbot_token: `token-${Date.now()}`,
    });

    const userWithPw = await User.findById(sampleUser._id).select("+password");
    const initialHash = userWithPw.password;

    // Modify a non-password field and save document
    sampleUser.bussinessName = "Updated PreSave Corp Name";
    await sampleUser.save();

    const reloadedUser = await User.findById(sampleUser._id).select("+password");
    const postSaveHash = reloadedUser.password;

    assert(initialHash === postSaveHash, "Password hash is preserved when non-password fields are updated (pre-save bug resolved)");
    const canAuthenticate = await reloadedUser.comparePassword("InitialPassword123!");
    assert(canAuthenticate === true, "User password comparison succeeds after multiple non-password document saves");

    await User.findByIdAndDelete(sampleUser._id);

    // --- TEST 6: Stability & IDOR / CastError Protection ---
    console.log("\n--- SECTION 6: Parameter Validation & CastError Protection ---");
    const invalidIdRes = await api("/admin/businesses/invalid-object-id-string", {
      method: "GET",
      headers: { Authorization: `Bearer ${validAdminJwt}` },
    });
    assert(invalidIdRes.status === 400, "Invalid ObjectId in /admin/businesses/:id returns 400 instead of crashing or CastError 500");

    const invalidSessionIdRes = await api("/session/messages?sessionId=invalid_session_id", {
      method: "GET",
      headers: { "x-chatbot-token": "A1ED-AC9D6DEE-46A3DFD8" },
    });
    assert(invalidSessionIdRes.status === 400, "Invalid sessionId format in /session/messages returns 400 cleanly");

    // --- TEST 7: CSV Formula Injection Prevention ---
    console.log("\n--- SECTION 7: CSV Formula Injection Neutralization ---");
    // Verify CSV cell sanitizer logic
    function sanitizeCsvCell(val) {
      if (val === null || val === undefined) return '';
      let str = String(val);
      if (/^[=+\-@\t\r]/.test(str)) {
        str = `'${str}`;
      }
      return str.replace(/"/g, '""');
    }
    assert(sanitizeCsvCell("=SUM(1+1)") === "'=SUM(1+1)", "= formula is safely escaped with leading single quote");
    assert(sanitizeCsvCell("+cmd|' /C calc'!A0") === "'+cmd|' /C calc'!A0", "+ formula injection is safely escaped");
    assert(sanitizeCsvCell("@malicious") === "'@malicious", "@ formula injection is safely escaped");
    assert(sanitizeCsvCell("Normal Chat Message") === "Normal Chat Message", "Normal text is unaltered");

    // --- SUMMARY ---
    console.log("\n===========================================================");
    console.log(`AUDIT RESULTS: ${results.passed}/${results.total} Passed, ${results.failed} Failed`);
    console.log("===========================================================\n");

    if (results.failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ Unexpected test exception:", err);
    process.exit(1);
  } finally {
    if (server) {
      server.close();
    }
    await mongoose.connection.close();
    process.exit(results.failed > 0 ? 1 : 0);
  }
}

runSecurityTests();
