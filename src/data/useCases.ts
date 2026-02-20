import { Bot, Cpu, Search, Layers, Box, LayoutDashboard, Plug, GraduationCap } from "lucide-react";

export interface PhaseContent {
  title: string;
  description: string;
  capabilities: string[];
}

export interface UseCase {
  slug: string;
  title: string;
  shortTitle: string;
  icon: any;
  tagline: string;
  description: string;
  phases: {
    preProduction: PhaseContent;
    production: PhaseContent;
    postProduction: PhaseContent;
  };
}

export const useCases: UseCase[] = [
  {
    slug: "ai-operating-system",
    title: "AI Operating System (OS) Wrapper",
    shortTitle: "AI OS Wrapper",
    icon: Cpu,
    tagline: "Unify your AI stack under one intelligent operating layer",
    description: "A centralized AI orchestration layer that wraps around your existing tools and pipelines, providing a unified interface for managing prompts, models, and outputs across your entire content production workflow.",
    phases: {
      preProduction: {
        title: "Pre-Production",
        description: "Establish the AI OS foundation and map your existing tool ecosystem.",
        capabilities: [
          "Audit existing tools and identify integration points",
          "Design unified prompt management architecture",
          "Map model selection logic for different asset types",
          "Define output quality gates and validation rules",
          "Create role-based access controls for AI resources",
          "Establish cost monitoring and budget guardrails",
        ],
      },
      production: {
        title: "Production",
        description: "Deploy and operate the AI OS across active production pipelines.",
        capabilities: [
          "Real-time model routing and load balancing",
          "Centralized prompt versioning and A/B testing",
          "Cross-tool output consistency enforcement",
          "Automated quality scoring and feedback loops",
          "Live dashboard for AI usage metrics and costs",
          "Pipeline-aware scheduling and prioritization",
        ],
      },
      postProduction: {
        title: "Post-Production",
        description: "Optimize, analyze, and scale the AI OS based on production learnings.",
        capabilities: [
          "Performance analytics and ROI reporting",
          "Model drift detection and retraining triggers",
          "Knowledge base building from production outputs",
          "Cost optimization recommendations",
          "Scalability assessment for future productions",
          "Team adoption metrics and training gap analysis",
        ],
      },
    },
  },
  {
    slug: "agentic-bots",
    title: "Agentic Bots Audit or Custom Dev",
    shortTitle: "Agentic Bots",
    icon: Bot,
    tagline: "Autonomous AI agents tailored to your production needs",
    description: "Design, audit, and deploy intelligent AI agents that autonomously handle repetitive tasks, quality checks, and creative assistance across your game dev, animation, and VFX pipelines.",
    phases: {
      preProduction: {
        title: "Pre-Production",
        description: "Identify automation opportunities and design agent architectures.",
        capabilities: [
          "Workflow analysis to identify bot-ready tasks",
          "Agent persona and capability design",
          "Safety and guardrail framework definition",
          "Integration mapping with existing DCCs",
          "Custom tool-calling architecture design",
          "Pilot use case selection and success criteria",
        ],
      },
      production: {
        title: "Production",
        description: "Deploy and monitor agentic bots in live production environments.",
        capabilities: [
          "Autonomous asset generation and iteration",
          "Quality assurance bots for consistency checks",
          "Intelligent task routing and delegation",
          "Real-time monitoring and intervention systems",
          "Multi-agent collaboration orchestration",
          "Human-in-the-loop escalation protocols",
        ],
      },
      postProduction: {
        title: "Post-Production",
        description: "Evaluate agent performance and iterate on capabilities.",
        capabilities: [
          "Agent performance analytics and benchmarking",
          "Cost-per-task analysis and optimization",
          "Capability expansion planning",
          "Knowledge transfer documentation",
          "Compliance and audit trail reporting",
          "Next-gen agent roadmap development",
        ],
      },
    },
  },
  {
    slug: "workflow-processes",
    title: "Workflow & Processes Audit & Discovery",
    shortTitle: "Workflow Audit",
    icon: Search,
    tagline: "Discover hidden efficiencies in your production pipeline",
    description: "Comprehensive analysis of your current workflows and processes to identify bottlenecks, redundancies, and AI-ready opportunities that can dramatically improve throughput and quality.",
    phases: {
      preProduction: {
        title: "Pre-Production",
        description: "Map existing workflows and identify transformation opportunities.",
        capabilities: [
          "End-to-end pipeline documentation and mapping",
          "Bottleneck identification and impact analysis",
          "AI readiness assessment per workflow stage",
          "Stakeholder interviews and pain point discovery",
          "Competitive benchmarking against industry standards",
          "Transformation roadmap with prioritized initiatives",
        ],
      },
      production: {
        title: "Production",
        description: "Implement optimized workflows during active production.",
        capabilities: [
          "Phased workflow migration with minimal disruption",
          "Real-time efficiency tracking and KPI dashboards",
          "Change management support and training",
          "Iterative process refinement based on feedback",
          "Cross-department workflow synchronization",
          "Automated reporting and progress tracking",
        ],
      },
      postProduction: {
        title: "Post-Production",
        description: "Measure impact and plan continuous improvement cycles.",
        capabilities: [
          "Before/after efficiency metrics comparison",
          "ROI analysis and cost savings documentation",
          "Lessons learned and best practices codification",
          "Continuous improvement framework setup",
          "Team satisfaction and adoption surveys",
          "Future optimization opportunity identification",
        ],
      },
    },
  },
  {
    slug: "sandbox-testing",
    title: "Sandbox Environment Testing & Validation",
    shortTitle: "Sandbox Testing",
    icon: Box,
    tagline: "Risk-free AI experimentation in controlled environments",
    description: "Purpose-built sandbox environments for testing AI tools, workflows, and integrations before deploying to production — ensuring quality, compatibility, and team confidence.",
    phases: {
      preProduction: {
        title: "Pre-Production",
        description: "Design and provision sandbox environments tailored to your pipeline.",
        capabilities: [
          "Environment architecture matching production setup",
          "Test data generation and dataset curation",
          "Evaluation criteria and success metric definition",
          "Tool isolation and dependency management",
          "Security and access control configuration",
          "Baseline performance benchmarking",
        ],
      },
      production: {
        title: "Production",
        description: "Execute structured testing programs in sandbox environments.",
        capabilities: [
          "Controlled A/B testing of AI tools and models",
          "Stress testing at production-scale volumes",
          "Integration compatibility validation",
          "Quality comparison against manual baselines",
          "Team usability testing and feedback collection",
          "Automated regression testing suites",
        ],
      },
      postProduction: {
        title: "Post-Production",
        description: "Analyze results and generate actionable recommendations.",
        capabilities: [
          "Comprehensive test results documentation",
          "Tool recommendation reports with evidence",
          "Risk assessment for production deployment",
          "Cost-benefit analysis per tool evaluated",
          "Migration plan from sandbox to production",
          "Ongoing validation framework design",
        ],
      },
    },
  },
  {
    slug: "integrations",
    title: "Integrations",
    shortTitle: "Integrations",
    icon: Plug,
    tagline: "Seamless AI integration into your existing pipeline",
    description: "End-to-end integration of AI tools and services into your studio's existing DCC applications, render farms, asset management systems, and production pipelines.",
    phases: {
      preProduction: {
        title: "Pre-Production",
        description: "Plan integration architecture and identify dependencies.",
        capabilities: [
          "Technical stack audit and compatibility assessment",
          "API and plugin architecture design",
          "Data flow mapping between systems",
          "Authentication and security planning",
          "Rollback and failover strategy design",
          "Integration timeline and milestone planning",
        ],
      },
      production: {
        title: "Production",
        description: "Execute integrations with production-grade reliability.",
        capabilities: [
          "Custom plugin development for DCCs",
          "API gateway and middleware implementation",
          "Real-time data synchronization setup",
          "Monitoring and alerting configuration",
          "Performance optimization and caching",
          "User training and documentation delivery",
        ],
      },
      postProduction: {
        title: "Post-Production",
        description: "Stabilize, document, and plan future integration expansions.",
        capabilities: [
          "Integration health monitoring setup",
          "Performance baselines and SLA definition",
          "Technical documentation and runbooks",
          "Support handoff and escalation procedures",
          "Version upgrade and maintenance planning",
          "Future integration roadmap development",
        ],
      },
    },
  },
  {
    slug: "tool-benchmarking",
    title: "Tool Benchmarking",
    shortTitle: "Benchmarking",
    icon: Layers,
    tagline: "Data-driven tool selection for your pipeline",
    description: "Rigorous testing and comparison of AI tools against your specific production requirements, delivering clear recommendations backed by quantitative evidence.",
    phases: {
      preProduction: {
        title: "Pre-Production",
        description: "Define benchmarking criteria and select tools for evaluation.",
        capabilities: [
          "Requirements gathering and criteria weighting",
          "Tool landscape survey and shortlisting",
          "Test methodology and scoring framework design",
          "Dataset preparation and ground truth creation",
          "Evaluation environment setup",
          "Stakeholder alignment on success criteria",
        ],
      },
      production: {
        title: "Production",
        description: "Execute structured benchmarking across selected tools.",
        capabilities: [
          "Standardized quality and speed comparisons",
          "Cost-per-output analysis across tools",
          "Scalability and throughput testing",
          "Artist usability and workflow fit evaluation",
          "Edge case and failure mode testing",
          "Real-world production scenario simulations",
        ],
      },
      postProduction: {
        title: "Post-Production",
        description: "Compile findings and deliver actionable recommendations.",
        capabilities: [
          "Comprehensive comparison reports with scoring",
          "TCO analysis and licensing recommendations",
          "Implementation priority recommendations",
          "Risk and limitation documentation",
          "Vendor relationship and negotiation support",
          "Re-evaluation schedule and criteria updates",
        ],
      },
    },
  },
  {
    slug: "architecture-blueprint",
    title: "Architecture Blueprint & Technology",
    shortTitle: "Architecture",
    icon: LayoutDashboard,
    tagline: "Future-proof AI architecture for your studio",
    description: "Comprehensive GenAI architecture design including LLM data model training, infrastructure planning, and quality assurance frameworks tailored to your studio's scale and ambitions.",
    phases: {
      preProduction: {
        title: "Pre-Production",
        description: "Design the complete AI technology architecture.",
        capabilities: [
          "Current infrastructure assessment and gap analysis",
          "Target architecture design and technology selection",
          "Data strategy and model training pipeline design",
          "Compute resource planning and cost modeling",
          "Security architecture and compliance framework",
          "Phased implementation roadmap",
        ],
      },
      production: {
        title: "Production",
        description: "Build and deploy the designed architecture.",
        capabilities: [
          "Infrastructure provisioning and configuration",
          "Model training pipeline implementation",
          "CI/CD setup for AI model deployment",
          "Monitoring and observability stack deployment",
          "Performance tuning and optimization",
          "Team enablement and operational handoff",
        ],
      },
      postProduction: {
        title: "Post-Production",
        description: "Validate architecture performance and plan evolution.",
        capabilities: [
          "Architecture performance vs. design goals review",
          "Cost optimization and resource right-sizing",
          "Technology refresh and upgrade planning",
          "Disaster recovery testing and validation",
          "Architecture documentation and knowledge base",
          "Innovation roadmap for emerging technologies",
        ],
      },
    },
  },
  {
    slug: "workshops-education",
    title: "Workshops & Education",
    shortTitle: "Workshops",
    icon: GraduationCap,
    tagline: "Empower your team with AI production skills",
    description: "Certified training programs delivered by Unreal & Unity educators, designed to upskill your team in AI-assisted content creation, tool usage, and best practices.",
    phases: {
      preProduction: {
        title: "Pre-Production",
        description: "Assess skill gaps and design tailored training programs.",
        capabilities: [
          "Team skill assessment and gap analysis",
          "Custom curriculum design per role and department",
          "Training environment and materials preparation",
          "Learning path creation with milestones",
          "Pre-training baseline measurement",
          "Executive briefing on AI landscape and opportunities",
        ],
      },
      production: {
        title: "Production",
        description: "Deliver hands-on training during active production cycles.",
        capabilities: [
          "On-the-job AI tool training and mentoring",
          "Live production project-based learning",
          "Weekly office hours and Q&A sessions",
          "Peer learning circles and knowledge sharing",
          "Real-time problem solving and support",
          "Progress tracking and certification milestones",
        ],
      },
      postProduction: {
        title: "Post-Production",
        description: "Evaluate learning outcomes and establish ongoing education.",
        capabilities: [
          "Skill improvement measurement and reporting",
          "Certification completion and recognition",
          "Internal champion and trainer identification",
          "Self-serve learning resource library creation",
          "Continuous learning program establishment",
          "Advanced topic workshop planning",
        ],
      },
    },
  },
];
