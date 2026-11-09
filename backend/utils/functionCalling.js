/**
 * Generic Function Calling & Action Execution Engine
 * Allows the chatbot to trigger external JS/React environment actions or API integrations
 * (e.g., checking order status, booking consultation, checking inventory, dynamic discounts).
 */

const toolDefinitions = [
  {
    name: 'check_order_status',
    description: 'Lookup current delivery and processing status of a customer order.',
    parameters: {
      type: 'object',
      properties: {
        orderId: { type: 'string', description: 'The order reference ID (e.g., ORD-10294)' },
        email: { type: 'string', description: 'Customer email address' },
      },
      required: ['orderId'],
    },
    handler: async (args) => {
      // Generic execution logic / external API mock
      const orderId = args.orderId.toUpperCase();
      return {
        success: true,
        orderId,
        status: 'In Transit 🚚',
        estimatedDelivery: 'Tomorrow by 5:00 PM',
        trackingCarrier: 'FedEx Express',
        items: 'Standard Order Package',
      };
    },
  },
  {
    name: 'book_consultation',
    description: 'Schedule an appointment or consultation meeting for the customer.',
    parameters: {
      type: 'object',
      properties: {
        preferredDate: { type: 'string', description: 'Preferred appointment date' },
        preferredTime: { type: 'string', description: 'Preferred appointment time' },
        serviceType: { type: 'string', description: 'Type of consultation requested' },
      },
      required: ['preferredDate'],
    },
    handler: async (args) => {
      return {
        success: true,
        bookingRef: `APT-${Math.floor(100000 + Math.random() * 900000)}`,
        date: args.preferredDate,
        time: args.preferredTime || '10:00 AM',
        status: 'Confirmed',
        note: 'A calendar invitation has been sent to your registered email.',
      };
    },
  },
  {
    name: 'check_inventory',
    description: 'Check stock availability for a product or service item.',
    parameters: {
      type: 'object',
      properties: {
        productName: { type: 'string', description: 'Name of the item or product' },
      },
      required: ['productName'],
    },
    handler: async (args) => {
      return {
        success: true,
        product: args.productName,
        inStock: true,
        status: 'Available',
      };
    },
  },
];

class FunctionCallingEngine {
  /**
   * Return list of available tool definitions
   */
  static getTools() {
    return toolDefinitions;
  }

  /**
   * Detect intent and check if query matches any registered tool
   */
  static detectToolIntent(message) {
    const lower = message.toLowerCase();

    if (lower.includes('order') && (lower.includes('status') || lower.includes('track') || lower.includes('where is'))) {
      const match = message.match(/(?:order\s*(?:#|id|number)?\s*|ord-)([a-z0-9-]+)/i);
      return {
        toolName: 'check_order_status',
        args: { orderId: match ? match[1] : 'ORD-98421' },
      };
    }

    if (lower.includes('book') || lower.includes('appointment') || lower.includes('schedule') || lower.includes('consultation')) {
      return {
        toolName: 'book_consultation',
        args: { preferredDate: 'Next Available Business Day', serviceType: 'General Inquiry' },
      };
    }

    if (lower.includes('stock') || lower.includes('in stock') || lower.includes('inventory')) {
      return {
        toolName: 'check_inventory',
        args: { productName: 'Standard Tier' },
      };
    }

    return null;
  }

  /**
   * Execute tool by name with arguments
   */
  static async executeTool(toolName, args = {}) {
    const tool = toolDefinitions.find((t) => t.name === toolName);
    if (!tool) {
      throw new Error(`Tool "${toolName}" not found in function calling registry.`);
    }

    console.log(`⚡ [FunctionCalling] Executing ${toolName} with args:`, args);
    const result = await tool.handler(args);
    return {
      toolName,
      args,
      result,
      // Client action metadata for the React widget
      clientAction: {
        type: toolName.toUpperCase(),
        payload: result,
      },
    };
  }
}

module.exports = FunctionCallingEngine;
