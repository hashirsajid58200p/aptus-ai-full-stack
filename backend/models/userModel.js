const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
        select: false,
    },

    chatbot_token: {
        type: String,
        required: true,
    },
    allowedDomain: {
        type: String,
        default: null,
    },
    allowedDomains: [
        {
            type: String,
        }
    ],
    theme: {
        type: String,
        default: 'aptus',
    },
    primaryColor: {
        type: String,
        default: '#f97316',
    },
    botName: {
        type: String,
        default: 'Aptus AI',
    },
    welcomeMessage: {
        type: String,
        default: 'Hello! How can I assist you today?',
    },
    chatbotAvatar: {
        type: String,
        default: 'bot',
    },
    textColor: {
        type: String,
        default: '',
    },
    borderRadius: {
        type: String,
        default: '',
    },
    bussinessName: {
        type: String,
        required: true,
    },
    bussinessCategory: {
        type: String,
        required: true,
    },
    bussinessDescription: {
        type: String,
        required: true,
    },
    bussinessDetails: [
        {
            question: {
                type: String,
                required: true,
            },
            answer: {
                type: String,
                required: true,
            }
        }
    ],
    provider: {
        type: String,
        enum: ['groq', 'gemini', 'deepseek', 'mistral', 'cohere', 'perplexity', 'openai', 'anthropic', 'xai', 'openrouter', 'custom'],
        default: 'groq',
    },
    modelName: {
        type: String,
        default: 'openai/gpt-oss-120b',
    },
    groqApiKey: {
        type: String,
        default: null,
    },
    geminiApiKey: {
        type: String,
        default: null,
    },
    deepseekApiKey: {
        type: String,
        default: null,
    },
    mistralApiKey: {
        type: String,
        default: null,
    },
    cohereApiKey: {
        type: String,
        default: null,
    },
    perplexityApiKey: {
        type: String,
        default: null,
    },
    openaiApiKey: {
        type: String,
        default: null,
    },
    anthropicApiKey: {
        type: String,
        default: null,
    },
    xaiApiKey: {
        type: String,
        default: null,
    },
    openrouterApiKey: {
        type: String,
        default: null,
    },
    customApiKey: {
        type: String,
        default: null,
    },
    customBaseUrl: {
        type: String,
        default: null,
    },
    tokenUsage: {
        totalTokens: {
            type: Number,
            default: 0,
        },
        dailyUsage: [
            {
                date: {
                    type: String,
                },
                tokens: {
                    type: Number,
                    default: 0,
                },
            }
        ]
    },
    tokenLimit: {
        type: Number,
        default: 500000,
    },
    isLiveAgent: {
        type: Boolean,
        default: false,
    },
    liveAgentAvailable: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
});

userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.getJWTToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const maskApiKey = (key) => {
    if (!key || typeof key !== "string") return null;
    if (key.length <= 8) return "••••••••";
    return `${key.slice(0, 4)}••••••••${key.slice(-4)}`;
};

userSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.password;
    const keyFields = [
        "groqApiKey",
        "geminiApiKey",
        "deepseekApiKey",
        "mistralApiKey",
        "cohereApiKey",
        "perplexityApiKey",
        "openaiApiKey",
        "anthropicApiKey",
        "xaiApiKey",
        "openrouterApiKey",
        "customApiKey",
    ];
    for (const field of keyFields) {
        if (obj[field]) {
            obj[field] = maskApiKey(obj[field]);
        }
    }
    return obj;
};

module.exports = mongoose.model("User", userSchema);

