export type ProjectCategory = "automation" | "website" | "enterprise-app";

export interface Project {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  category: ProjectCategory;
  categoryLabel: string;
  coverImage: string;
  caseStudySlug?: string;
  externalUrl?: string;
  summary: string;
  context: string;
  workflowOverview: string;
  keyStages: string[];
  tools: string[];
  status: "verified-active" | "live-site" | "enterprise-ready";
  featured?: boolean;
}

export const projects: Project[] = [
  {
    id: "adaptive-hitl",
    caseStudySlug: "adaptive-hitl",
    number: "01",
    title: "Adaptive Human-in-the-Loop (HITL)",
    subtitle: "Layout-aware retrieval and human review",
    category: "automation",
    categoryLabel: "AI AUTOMATION",
    coverImage: "/assets/automations/01-adaptive-hitl/cover/01-adaptive-hitl-cover-orange-blue.webp",
    summary: "A retrieval workflow for dense PDFs that preserves document structure and routes uncertain results for human review.",
    context: "Dense PDFs can lose important relationships between tables, equations, and surrounding text during simple chunking.",
    workflowOverview: "The workflow parses PDFs with layout context, embeds structured text, and gives an AI agent access to a retriever. A human review path handles results that need verification.",
    keyStages: ["Extract PDF content with layout context", "Split and embed structured text", "Retrieve relevant passages with an AI agent", "Route uncertain results for human review"],
    tools: ["n8n", "LlamaParse", "OpenAI Embeddings", "Pinecone", "Claude"],
    status: "verified-active",
    featured: true,
  },
  {
    id: "content-publishing",
    caseStudySlug: "ai-content-publishing",
    number: "02",
    title: "AI Content Publishing System",
    subtitle: "Image creation and scheduled publishing",
    category: "automation",
    categoryLabel: "CONTENT PIPELINE",
    coverImage: "/assets/automations/02-ai-content-publishing/cover/02-ai-content-publishing-cover-orange-blue.webp",
    summary: "An n8n workflow that prepares image posts and schedules publication for Facebook and Instagram.",
    context: "Recurring social posts need a consistent editorial and visual approach.",
    workflowOverview: "One scheduled n8n workflow loads brand guidelines, generates post ideas and images, prepares captions and alt text, stores assets, and publishes the resulting posts.",
    keyStages: ["Load content settings and brand guidelines", "Generate topics, captions, and alt text", "Generate and store images", "Schedule and publish posts", "Record the publishing run"],
    tools: ["n8n", "Claude", "OpenAI Images API", "Facebook Pages", "Instagram"],
    status: "verified-active",
    featured: true,
  },
  {
    id: "lead-generation",
    caseStudySlug: "ai-lead-generation",
    number: "03",
    title: "AI-Powered Lead Generation & Personalization",
    subtitle: "Business discovery and tailored outreach",
    category: "automation",
    categoryLabel: "LEAD GENERATION",
    coverImage: "/assets/automations/03-ai-lead-generation/cover/03-ai-lead-generation-cover-orange-blue.webp",
    summary: "An outreach workflow that discovers businesses, researches their websites, and drafts personalized emails.",
    context: "Prospect research and outreach writing repeat many of the same steps across businesses.",
    workflowOverview: "The workflow searches Google Maps from supplied criteria, visits business websites to locate contact information, and uses AI analysis to prepare outreach tied to the business.",
    keyStages: ["Receive business search criteria", "Discover businesses in Google Maps", "Locate contact pages and enrich records", "Analyze the business and prepare outreach"],
    tools: ["n8n", "Google Maps"],
    status: "verified-active",
    featured: true,
  },
  {
    id: "bulk-email",
    caseStudySlug: "bulk-email-automation",
    number: "04",
    title: "Bulk Email Automation System",
    subtitle: "Campaigns, follow-ups, and reply routing",
    category: "automation",
    categoryLabel: "EMAIL AUTOMATION",
    coverImage: "/assets/automations/04-bulk-email-automation/cover/04-bulk-email-automation-cover-orange-blue.webp",
    summary: "An n8n workflow for importing campaign leads, drafting personalized emails, and routing replies.",
    context: "Campaign operators need to coordinate lead imports, messages, follow-ups, and responses.",
    workflowOverview: "The system normalizes imported leads, drafts subject lines and copy with Claude, queues messages, and routes replies by intent for follow-up or booking.",
    keyStages: ["Import and normalize lead records", "Draft personalized campaign copy", "Queue and send messages in batches", "Classify replies and route follow-ups", "Record campaign activity"],
    tools: ["n8n", "Claude"],
    status: "verified-active",
  },
  {
    id: "enterprise-automation",
    caseStudySlug: "hybrid-enterprise-automation",
    number: "05",
    title: "Hybrid Low-Code Enterprise Automation",
    subtitle: "Competitor monitoring and client response",
    category: "automation",
    categoryLabel: "ENTERPRISE SYSTEM",
    coverImage: "/assets/automations/05-hybrid-enterprise-automation/cover/05-hybrid-enterprise-automation-cover-orange-blue.webp",
    summary: "Two workflows share an architecture for competitor monitoring and client-response drafting.",
    context: "Competitor research and customer email both require gathering context before deciding what action to take.",
    workflowOverview: "One workflow collects and assesses competitor changes. A second analyzes inbound client email, retrieves relevant organization knowledge, and determines whether to draft a reply or request human review.",
    keyStages: ["Collect competitor updates and assess changes", "Process inbound customer email", "Retrieve relevant organization knowledge", "Draft a response or route to a person"],
    tools: ["n8n", "Claude", "Firecrawl", "RAG", "MCP"],
    status: "verified-active",
  },
  {
    id: "lead-qualification",
    caseStudySlug: "lead-qualification",
    number: "06",
    title: "Lead Qualification & Appointment Booking",
    subtitle: "Lead intake and calendar scheduling",
    category: "automation",
    categoryLabel: "AI WORKFLOW",
    coverImage: "/assets/automations/06-lead-qualification/cover/06-lead-qualification-cover-orange-blue.webp",
    summary: "A documented architecture for qualifying inbound leads and coordinating appointment booking.",
    context: "Inbound inquiries need consistent qualification before they reach a calendar.",
    workflowOverview: "The design routes inbound events through n8n, stores lead state in Supabase, uses Claude for qualification, and uses Google Calendar to coordinate booking.",
    keyStages: ["Capture inbound inquiries", "Store and update lead state", "Assess budget, authority, need, and timeline", "Check availability and coordinate booking"],
    tools: ["n8n", "Claude", "Supabase", "Google Calendar"],
    status: "verified-active",
  },
  {
    id: "time-and-tide",
    number: "07",
    title: "Time and Tide",
    subtitle: "Watch website",
    category: "website",
    categoryLabel: "DIGITAL PRODUCT",
    coverImage: "/assets/websites/time-and-tide/covers/time-and-tide-cover-orange-blue.webp",
    externalUrl: "https://t-ime-tide.vercel.app/",
    summary: "A watch website from the portfolio collection.",
    context: "",
    workflowOverview: "",
    keyStages: [],
    tools: [],
    status: "live-site",
    featured: true,
  },
  {
    id: "sumeri",
    number: "08",
    title: "SUMERI",
    subtitle: "Watch website",
    category: "website",
    categoryLabel: "WEB PLATFORM",
    coverImage: "/assets/websites/sumeri/covers/sumeri-cover-orange-blue.webp",
    externalUrl: "https://sumeri.vercel.app/",
    summary: "A watch website from the portfolio collection.",
    context: "",
    workflowOverview: "",
    keyStages: [],
    tools: [],
    status: "live-site",
  },
  {
    id: "neocut-digital",
    number: "09",
    title: "NeoCut Digital",
    subtitle: "Studio website",
    category: "website",
    categoryLabel: "STUDIO WEBSITE",
    coverImage: "/assets/websites/neocut-digital/covers/neocut-digital-cover-orange-blue.webp",
    externalUrl: "https://neocutdigital.vercel.app/",
    summary: "The website for NeoCut Digital, a video production studio.",
    context: "",
    workflowOverview: "",
    keyStages: [],
    tools: [],
    status: "live-site",
  },
  {
    id: "si-enterprise",
    number: "10",
    title: "SI Enterprise",
    subtitle: "Enterprise application",
    category: "enterprise-app",
    categoryLabel: "ENTERPRISE APPLICATION",
    coverImage: "/assets/enterprise-app/si-enterprise/covers/si-enterprise-cover-orange-blue.webp",
    externalUrl: "https://sienterprise.vercel.app/",
    summary: "An enterprise application. Access may require authorization.",
    context: "",
    workflowOverview: "",
    keyStages: [],
    tools: [],
    status: "enterprise-ready",
    featured: true,
  },
];

export function projectHref(project: Project) {
  return project.caseStudySlug
    ? `/work/automations/${project.caseStudySlug}`
    : project.externalUrl;
}
