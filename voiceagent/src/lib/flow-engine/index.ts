import type { FlowEdge, FlowNode } from "@/lib/types";

export interface FlowContext {
  variables: Record<string, string>;
  transcript: string[];
}

export interface FlowResult {
  response?: string;
  nextNodeId?: string;
  action?: "transfer" | "end" | "tool";
  toolName?: string;
  toolArgs?: Record<string, unknown>;
}

export class FlowEngine {
  constructor(
    private nodes: FlowNode[],
    private edges: FlowEdge[],
    private startNodeId?: string
  ) {}

  getStartNode(): FlowNode | undefined {
    const greet = this.nodes.find((n) => n.type === "greet");
    if (greet) return greet;
    if (this.startNodeId) return this.nodes.find((n) => n.id === this.startNodeId);
    return this.nodes[0];
  }

  execute(nodeId: string, context: FlowContext, userInput?: string): FlowResult {
    const node = this.nodes.find((n) => n.id === nodeId);
    if (!node) return { action: "end" };

    switch (node.type) {
      case "greet":
        return {
          response: String(node.config.message || "Hello! How can I help?"),
          nextNodeId: this.getNextNode(node.id),
        };

      case "ask":
        if (!userInput) {
          return { response: String(node.config.question || "How can I help?") };
        }
        const varName = String(node.config.variable || "answer");
        context.variables[varName] = userInput;
        return { nextNodeId: this.getNextNode(node.id) };

      case "branch": {
        const conditions = (node.config.conditions as Array<{ match: string; target: string }>) || [];
        const lastAnswer = Object.values(context.variables).pop() || userInput || "";
        for (const cond of conditions) {
          if (lastAnswer.toLowerCase().includes(cond.match.toLowerCase())) {
            return { nextNodeId: cond.target };
          }
        }
        return { nextNodeId: this.getNextNode(node.id) };
      }

      case "tool":
        return {
          action: "tool",
          toolName: String(node.config.tool || "lookup_knowledge"),
          toolArgs: (node.config.args as Record<string, unknown>) || {},
          nextNodeId: this.getNextNode(node.id),
        };

      case "transfer":
        return {
          action: "transfer",
          response: String(node.config.message || "Connecting you now."),
        };

      case "end":
        return {
          action: "end",
          response: String(node.config.message || "Thank you for calling. Goodbye!"),
        };

      default:
        return { nextNodeId: this.getNextNode(node.id) };
    }
  }

  private getNextNode(nodeId: string): string | undefined {
    const edge = this.edges.find((e) => e.source === nodeId);
    return edge?.target;
  }

  validate(): string[] {
    const errors: string[] = [];
    if (!this.nodes.length) errors.push("Flow must have at least one node");
    if (!this.nodes.some((n) => n.type === "greet" || n.type === "ask")) {
      errors.push("Flow should start with a greet or ask node");
    }
    const nodeIds = new Set(this.nodes.map((n) => n.id));
    for (const edge of this.edges) {
      if (!nodeIds.has(edge.source)) errors.push(`Edge references missing source: ${edge.source}`);
      if (!nodeIds.has(edge.target)) errors.push(`Edge references missing target: ${edge.target}`);
    }
    return errors;
  }
}

export const DEFAULT_FLOW_NODES: FlowNode[] = [
  { id: "greet", type: "greet", label: "Greeting", config: { message: "Hello! Thanks for calling. How can I help you today?" } },
  { id: "ask_intent", type: "ask", label: "Ask Intent", config: { question: "Are you calling to book an appointment, ask a question, or speak with someone?", variable: "intent" } },
  {
    id: "branch_intent",
    type: "branch",
    label: "Route Intent",
    config: {
      conditions: [
        { match: "appointment", target: "book" },
        { match: "human", target: "transfer" },
        { match: "question", target: "faq" },
      ],
    },
  },
  { id: "book", type: "tool", label: "Book Appointment", config: { tool: "book_appointment" } },
  { id: "faq", type: "tool", label: "Answer FAQ", config: { tool: "lookup_knowledge" } },
  { id: "transfer", type: "transfer", label: "Transfer to Human", config: { message: "I'll connect you with a team member." } },
  { id: "end", type: "end", label: "End Call", config: { message: "Thank you for calling. Have a great day!" } },
];

export const DEFAULT_FLOW_EDGES: FlowEdge[] = [
  { id: "e1", source: "greet", target: "ask_intent" },
  { id: "e2", source: "ask_intent", target: "branch_intent" },
  { id: "e3", source: "branch_intent", target: "end" },
  { id: "e4", source: "book", target: "end" },
  { id: "e5", source: "faq", target: "end" },
  { id: "e6", source: "transfer", target: "end" },
];
