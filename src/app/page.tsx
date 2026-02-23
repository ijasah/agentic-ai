'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Hero } from '@/components/Hero';
import { TableOfContents } from '@/components/TableOfContents';
import { Section } from '@/components/Section';
import { AgentCoreComponents } from '@/components/AgentCoreComponents';
import { ReActSimulator } from '@/components/ReActSimulator';
import { MultiAgentSimulator } from '@/components/MultiAgentSimulator';
import { AgentFrameworks } from '@/components/AgentFrameworks';
import { LangGraphQuickstartSimulator } from '@/components/LangGraphQuickstartSimulator';
import { ThinkingInLangGraph } from '@/components/ThinkingInLangGraph';
import { PersistenceSimulator } from '@/components/PersistenceSimulator';
import { SerializationVisual } from '@/components/SerializationVisual';
import { DurableExecutionSimulator } from '@/components/DurableExecutionSimulator';
import { StreamingSimulator } from '@/components/StreamingSimulator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { InterruptsSimulator } from '@/components/InterruptsSimulator';
import { MCPSimulator } from '@/components/MCPSimulator';
import { CoreConceptsSimulator } from '@/components/CoreConceptsSimulator';

import {
  Bot,
  BrainCircuit,
  ChevronUp,
  ChevronDown,
  Puzzle,
  BookCopy,
  Users,
  CheckCircle,
  XCircle,
  FileWarning,
  Clock,
  Sparkles,
  Rocket,
  ArrowRight,
  ArrowLeft,
  GitBranch,
  Download,
  Server,
  Link as LinkIcon,
  LineChart,
  Lightbulb,
  Workflow,
  Save,
  MemoryStick,
  UserCheck,
  History,
  ShieldCheck,
  Database,
  Wrench,
  Key,
  Lock,
  Binary,
  ArrowDown,
  Layers,
  Zap,
  Shield,
  Code,
  Radio,
  Hand,
  FileJson,
  AlertTriangle,
  ToyBrick,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CodeBlock } from '@/components/ui/code-block';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const sections = [
  { 
    id: 'introduction', 
    title: 'LLM Agents: An Overview', 
    icon: <Bot className="h-8 w-8 text-primary" />,
    subsections: [
        { id: 'core-components', title: 'Core Components' },
        { id: 'tool-integration', title: 'Tool Integration' },
    ]
  },
  { 
    id: 'react-agent', 
    title: 'The ReAct Framework', 
    icon: <BrainCircuit className="h-8 w-8 text-primary" />,
    subsections: [
        { id: 'react-how', title: 'How ReAct Works' },
        { id: 'react-simulation', title: 'ReAct Simulation' },
        { id: 'react-benefits', title: 'Key Benefits' },
    ]
  },
  { 
    id: 'multi-agent', 
    title: 'Multi-Agent Systems', 
    icon: <Users className="h-8 w-8 text-primary" />,
    subsections: [
        { id: 'multi-advantages', title: 'Advantages' },
        { id: 'multi-simulation', title: 'Collaboration Simulation' },
        { id: 'multi-frameworks', title: 'Popular Frameworks' },
        { id: 'multi-challenges', title: 'Challenges' },
    ]
  },
  {
    id: 'langgraph-overview',
    title: 'LangGraph Overview',
    icon: <GitBranch className="h-8 w-8 text-primary" />,
    subsections: [
        { id: 'lg-key-concepts', title: 'Key Concepts' },
        { id: 'lg-core-benefits', title: 'Core Benefits' },
        { id: 'lg-ecosystem', title: 'Ecosystem' },
        { id: 'lg-installation', title: 'Installation' },
    ]
  },
  {
    id: 'thinking-in-langgraph',
    title: 'Thinking in LangGraph',
    icon: <Workflow className="h-8 w-8 text-primary" />,
  },
  { 
    id: 'langgraph-quickstart', 
    title: 'LangGraph Quickstart', 
    icon: <Rocket className="h-8 w-8 text-primary" />,
    subsections: [
        { id: 'qs-graph-simulation', title: 'Graph API Simulation' },
        { id: 'qs-functional-api', title: 'Using the Functional API' },
    ]
  },
    { 
    id: 'langgraph-persistence', 
    title: 'LangGraph Persistence', 
    icon: <Save className="h-8 w-8 text-primary" />,
    subsections: [
        { id: 'persistence-simulation', title: 'Live Simulation' },
        { id: 'persistence-history', title: 'State History API' },
        { id: 'persistence-memory-store', title: 'Memory Store' },
        { id: 'persistence-context-window', title: 'Context Window Management'},
        { id: 'persistence-capabilities', title: 'Key Capabilities' },
        { id: 'persistence-implementation', title: 'Implementation' },
    ]
  },
  {
    id: 'durable-execution',
    title: 'Durable Execution',
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    subsections: [
        { id: 'durable-what-is', title: 'What is Durability?' },
        { id: 'durable-simulation', title: 'Interactive Simulation' },
        { id: 'durable-modes', title: 'Durability Modes' },
    ]
  },
  { 
    id: 'streaming', 
    title: 'Streaming in LangGraph', 
    icon: <Radio className="h-8 w-8 text-primary" />,
    subsections: [
        { id: 'streaming-modes', title: 'Stream Modes Explained' },
        { id: 'streaming-simulation', title: 'Live Simulation' },
    ]
  },
  {
    id: 'interrupts',
    title: 'Human-in-the-loop: Interrupts',
    icon: <UserCheck className="h-8 w-8 text-primary" />,
    subsections: [
        { id: 'interrupts-simulation', title: 'Interactive Simulation' },
        { id: 'interrupts-patterns', title: 'Common Patterns' },
    ]
  },
  {
    id: 'mcp',
    title: 'Model Context Protocol (MCP)',
    icon: <ToyBrick className="h-8 w-8 text-primary" />,
    subsections: [
        { id: 'mcp-what-is', title: 'What is MCP?' },
        { id: 'mcp-simulation', title: 'Interactive Simulation' },
        { id: 'mcp-transports', title: 'Transports' },
        { id: 'mcp-advanced', title: 'Advanced Features' },
    ]
  },
  {
    id: 'references',
    title: 'References',
    icon: <BookCopy className="h-8 w-8 text-primary" />,
  },
];

const allSectionIds = sections.flatMap(s => [s.id, ...(s.subsections ? s.subsections.map(sub => sub.id) : [])]);

const toolCode = `
# Initialize tools
tools = load_tools([’wikipedia’, ’llm-math’], llm=llm)

# Create agent
agent = initialize_agent(tools, llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION)

# Run query
result = agent.run("What is the average age of a cat? Multiply by 4.")
`;

const EcosystemCard = ({ title, icon, href, children }: { title: string, icon: React.ReactNode, href: string, children: React.ReactNode }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block group">
        <Card className="h-full transition-all duration-300 group-hover:border-primary group-hover:shadow-lg group-hover:-translate-y-1">
            <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                    {icon}
                    {title}
                    <ArrowRight className="w-4 h-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{children}</p>
            </CardContent>
        </Card>
    </a>
);

const streamModesData = [
  { mode: '`values`', description: 'Streams the full value of the state after each step of the graph.' },
  { mode: '`updates`', description: 'Streams only the updates to the state after each step of the graph.' },
  { mode: '`messages`', description: 'Streams token-by-token output from LLMs within the graph.' },
  { mode: '`custom`', description: 'Streams any custom data that you manually emit from within your nodes.' },
  { mode: '`debug`', description: 'Streams as much information as possible for deep debugging.' },
];


const Index = () => {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [activeSubSectionId, setActiveSubSectionId] = useState('');
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const isScrolling = useRef(false);

  useEffect(() => {
    allSectionIds.forEach(id => {
        sectionRefs.current[id] = document.getElementById(id);
    })
  }, []);

  const scrollToSection = (id: string) => {
    if (isScrolling.current) return;
    const element = document.getElementById(id);
    if (element) {
      isScrolling.current = true;
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      const parentSection = sections.find(s => s.id === id || s.subsections?.some(sub => sub.id === id));
      if(parentSection) {
          setActiveSection(parentSection.id);
      }
      setActiveSubSectionId(id);

      setTimeout(() => {
        isScrolling.current = false;
      }, 1000); // Prevent rapid scrolling
    }
  };

  const handleNextSection = () => {
    const currentMainIndex = sections.findIndex(s => s.id === activeSection);
    const nextIndex = Math.min(currentMainIndex + 1, sections.length - 1);
    scrollToSection(sections[nextIndex].id);
  };

  const handlePrevSection = () => {
    const currentMainIndex = sections.findIndex(s => s.id === activeSection);
    const prevIndex = Math.max(currentMainIndex - 1, 0);
    scrollToSection(sections[prevIndex].id);
  };

  useEffect(() => {
    const observerOptions = {
      rootMargin: '-100px 0px -40% 0px',
      threshold: 0,
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      if (isScrolling.current) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            const parentSection = sections.find(s => s.id === id || s.subsections?.some(sub => sub.id === id));
            if (parentSection) {
                setActiveSection(parentSection.id);
            }
            setActiveSubSectionId(id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    Object.values(sectionRefs.current).forEach(el => {
        if(el) observer.observe(el);
    });

    return () => {
      Object.values(sectionRefs.current).forEach(el => {
        if(el) observer.unobserve(el);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Hero />
      <div id="content" className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_4fr] gap-8">
          <div className="lg:col-span-1">
            <TableOfContents 
              activeSectionId={activeSection} 
              activeSubSectionId={activeSubSectionId}
              onLinkClick={scrollToSection} 
            />
          </div>
          <main className="lg:col-span-1 space-y-24">
            
             <Section id="introduction" title="LLM Agents: An Overview" icon={<Bot className="h-8 w-8 text-primary" />}>
              <div className="space-y-12">
                <p className="text-muted-foreground text-lg">
                  LLM Agents are advanced systems that utilize Large Language Models (LLMs) as their core engine
                  to solve complex tasks requiring reasoning, planning, memory, and the use of external tools. Unlike
                  static applications of LLMs, agents are dynamic and capable of executing multi-step tasks by
                  breaking them into smaller, manageable subtasks.
                </p>
                
                <div id="core-components">
                    <h3 className="text-xl font-semibold mb-4 text-foreground">Core Components of an LLM Agent</h3>
                    <AgentCoreComponents />
                </div>
                
                <div id="tool-integration" className="pt-8">
                  <h3 className="text-xl font-semibold mb-4 text-foreground">Tool Integration</h3>
                   <p className="text-muted-foreground mb-4">
                        A core part of building an agent is giving it access to tools. These are functions the agent can call to interact with the outside world, like searching the web, running calculations, or accessing a database.
                    </p>
                  <CodeBlock code={toolCode} />
                </div>

              </div>
            </Section>
            
            <Section id="react-agent" title="The ReAct Framework" icon={<BrainCircuit className="h-8 w-8 text-primary" />}>
               <div className="space-y-12">
                 <p className="text-muted-foreground text-lg" id="react-how">
                    A ReAct (Reasoning and Acting) Agent is an advanced framework that enables LLMs to reason through problems while interacting with external tools. It combines two essential capabilities: generating a reasoning trace and executing task-specific actions in a continuous loop.
                  </p>
                  
                  <div id="react-simulation" className="pt-8">
                     <ReActSimulator />
                  </div>

                  <div id="react-benefits" className="pt-8">
                    <h3 className="text-xl font-semibold mb-4 text-foreground">Key Benefits of ReAct Agents</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-muted/30">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base"><CheckCircle className="text-primary"/> Improved Accuracy</CardTitle>
                            </CardHeader>
                            <CardContent><p className="text-sm text-muted-foreground">Breaking problems into smaller steps reduces errors and improves reliability.</p></CardContent>
                        </Card>
                         <Card className="bg-muted/30">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base"><Sparkles className="text-primary"/> Dynamic Interaction</CardTitle>
                            </CardHeader>
                            <CardContent><p className="text-sm text-muted-foreground">Agents can gather additional data or clarify ambiguities during execution.</p></CardContent>
                        </Card>
                         <Card className="bg-muted/30">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base"><Rocket className="text-primary"/> Enhanced Problem Solving</CardTitle>
                            </CardHeader>
                            <CardContent><p className="text-sm text-muted-foreground">Combines reasoning with action to solve real-world, multi-step problems.</p></CardContent>
                        </Card>
                    </div>
                  </div>
               </div>
            </Section>

            <Section id="multi-agent" title="Multi-Agent Systems" icon={<Users className="h-8 w-8 text-primary" />}>
              <div className="space-y-12">
                  <p className="text-muted-foreground text-lg">
                    Multi-agent LLM systems consist of multiple agents that collaborate to solve complex tasks. While single-agent systems are effective for independent cognitive tasks, multi-agent systems shine in scenarios requiring teamwork, extended context management, and dynamic interaction.
                  </p>

                   <div id="multi-advantages" className="pt-8">
                        <h3 className="text-xl font-semibold mb-4 text-foreground">Single Agent vs. Multi-Agent</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="border-red-500/30 bg-red-500/10">
                                <CardHeader>
                                <CardTitle className="text-red-400 flex items-center gap-2"><Bot /> Single Agent</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <p className="flex items-start gap-2 text-sm"><XCircle className="w-5 h-5 mt-0.5 shrink-0"/> Prone to hallucinations without verification.</p>
                                    <p className="flex items-start gap-2 text-sm"><XCircle className="w-5 h-5 mt-0.5 shrink-0"/> Limited by context window for long tasks.</p>
                                    <p className="flex items-start gap-2 text-sm"><XCircle className="w-5 h-5 mt-0.5 shrink-0"/> Operates sequentially, can be slow.</p>
                                </CardContent>
                            </Card>
                            <Card className="border-green-500/30 bg-green-500/10">
                                <CardHeader>
                                <CardTitle className="text-green-400 flex items-center gap-2"><Users/> Multi-Agent</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <p className="flex items-start gap-2 text-sm"><CheckCircle className="w-5 h-5 mt-0.5 shrink-0"/> Agents can debate and verify each other's work.</p>
                                    <p className="flex items-start gap-2 text-sm"><CheckCircle className="w-5 h-5 mt-0.5 shrink-0"/> Tasks can be divided to handle large contexts.</p>
                                    <p className="flex items-start gap-2 text-sm"><CheckCircle className="w-5 h-5 mt-0.5 shrink-0"/> Enables parallel processing for better efficiency.</p>
                                </CardContent>
                            </Card>
                        </div>
                   </div>

                  <div id="multi-simulation" className="pt-8">
                      <MultiAgentSimulator />
                  </div>
                  
                  <div id="multi-frameworks" className="pt-8">
                     <h3 className="text-xl font-semibold mb-4 text-foreground">Popular Multi-Agent Frameworks</h3>
                     <AgentFrameworks />
                  </div>

                  <div id="multi-challenges" className="pt-8">
                     <h3 className="text-xl font-semibold mb-4 text-foreground">Challenges and Limitations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="bg-muted/30">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base"><FileWarning className="text-destructive"/> Task Allocation &amp; Coordination</CardTitle>
                            </CardHeader>
                            <CardContent><p className="text-sm text-muted-foreground">Efficiently dividing tasks and ensuring agents debate and reach consensus requires sophisticated protocols.</p></CardContent>
                        </Card>
                         <Card className="bg-muted/30">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base"><Clock className="text-destructive"/> Time and Cost</CardTitle>
                            </CardHeader>
                            <CardContent><p className="text-sm text-muted-foreground">Multi-agent setups demand higher computational resources, leading to increased latency and expenses.</p></CardContent>
                        </Card>
                    </div>
                  </div>
              </div>
            </Section>

            <Section id="langgraph-overview" title="LangGraph Overview" icon={<GitBranch className="h-8 w-8 text-primary" />}>
                 <div className="space-y-6">
                    <p className="text-muted-foreground text-lg">
                        LangGraph is a powerful library for building agents that can reliably handle complex tasks. It gives you full control by letting you define an agent's workflow as a graph—a series of connected steps. Before building, it's helpful to understand a few core ideas.
                    </p>
                    <div id="lg-key-concepts">
                        <Card className="bg-muted/40 mb-8">
                          <CardHeader>
                            <CardTitle>Key Concepts Explained</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-6">
                              <div>
                                <h4 className="font-bold text-foreground flex items-center gap-2"><Zap size={18} className="text-primary"/> 1. What is a "Runtime"?</h4>
                                <p className="text-sm text-muted-foreground mt-1">Think of the **Runtime** as the "Head Chef" or engine. It reads your map, figures out which node needs to run next, and manages the flow of information between them.</p>
                              </div>
                              <div>
                                <h4 className="font-bold text-foreground flex items-center gap-2"><Database size={18} className="text-primary"/> 2. What does "Stateful" mean?</h4>
                                <p className="text-sm text-muted-foreground mt-1">A stateful agent has a **Shared Notebook** (memory). Every step can read previous info and write new findings. This allows the agent to learn and react based on history.</p>
                              </div>
                              <div>
                                <h4 className="font-bold text-foreground flex items-center gap-2"><Clock size={18} className="text-primary"/> 3. What is a "Long-Running" Agent?</h4>
                                <p className="text-sm text-muted-foreground mt-1">Because agents are stateful, they can **Pause**. They can wait for human approval for days, then "thaw" and pick up exactly where they left off.</p>
                              </div>
                          </CardContent>
                        </Card>
                        <CoreConceptsSimulator />
                    </div>
                     <div id="lg-core-benefits" className="space-y-4 pt-12">
                        <h3 className="text-xl font-semibold text-foreground">Core Benefits</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <Card className="bg-muted/30"><CardHeader><CardTitle className="text-base">Durable Execution</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Build agents that persist through failures and can run for extended periods, resuming from where they left off.</p></CardContent></Card>
                           <Card className="bg-muted/30"><CardHeader><CardTitle className="text-base">Human-in-the-loop</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Incorporate human oversight by inspecting and modifying agent state at any point.</p></CardContent></Card>
                           <Card className="bg-muted/30"><CardHeader><CardTitle className="text-base">Comprehensive Memory</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Create stateful agents with both short-term working memory and long-term memory across sessions.</p></CardContent></Card>
                           <Card className="bg-muted/30"><CardHeader><CardTitle className="text-base">Debugging with LangSmith</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Gain deep visibility into complex agent behavior with visualization tools that trace execution paths.</p></CardContent></Card>
                        </div>
                    </div>
                    
                    <div id="lg-ecosystem" className="space-y-4 pt-12">
                        <h3 className="text-xl font-semibold text-foreground">LangGraph Ecosystem</h3>
                        <div className="space-y-4">
                            <EcosystemCard title="LangSmith" icon={<LineChart />} href="http://www.langchain.com/langsmith">
                                Trace requests, evaluate outputs, and monitor deployments in one place.
                            </EcosystemCard>
                             <EcosystemCard title="LangSmith Agent Server" icon={<Server />} href="https://docs.langchain.com/langsmith/agent-server">
                                Deploy and scale agents effortlessly with a purpose-built deployment platform for long running, stateful workflows.
                            </EcosystemCard>
                             <EcosystemCard title="LangChain" icon={<LinkIcon />} href="https://docs.langchain.com/oss/python/langchain/overview">
                                Provides integrations and composable components to streamline LLM application development.
                            </EcosystemCard>
                        </div>
                    </div>

                    <div id="lg-installation" className="pt-12 space-y-4">
                        <h3 className="text-xl font-semibold text-foreground">Installation</h3>
                        <p className="text-muted-foreground">
                           To build powerful agents, you first need the right tools. LangGraph is the core library for creating the agent's structure.
                        </p>
                        <Tabs defaultValue="pip" className="w-full">
                            <TabsList>
                            <TabsTrigger value="pip">pip</TabsTrigger>
                            <TabsTrigger value="uv">uv</TabsTrigger>
                            </TabsList>
                            <TabsContent value="pip">
                            <CodeBlock code="pip install -U langgraph" />
                            </TabsContent>
                            <TabsContent value="uv">
                            <CodeBlock code="uv add langgraph" />
                            </TabsContent>
                        </Tabs>

                        <p className="text-muted-foreground">
                           While LangGraph can be used on its own, it works best with the rich ecosystem of model and tool integrations provided by the main LangChain library.
                        </p>
                        
                        <Tabs defaultValue="pip" className="w-full">
                            <TabsList>
                            <TabsTrigger value="pip">pip</TabsTrigger>
                            <TabsTrigger value="uv">uv</TabsTrigger>
                            </TabsList>
                            <TabsContent value="pip">
                            <CodeBlock code="pip install -U langchain" />
                            </TabsContent>
                            <TabsContent value="uv">
                            <CodeBlock code="uv add langchain" />
                            </TabsContent>
                        </Tabs>
                    </div>
                 </div>
            </Section>

            <Section id="thinking-in-langgraph" title="Thinking in LangGraph" icon={<Workflow className="h-8 w-8 text-primary" />}>
                <ThinkingInLangGraph />
            </Section>

            <Section id="langgraph-quickstart" title="LangGraph Quickstart" icon={<Rocket className="h-8 w-8 text-primary" />}>
              <div className="space-y-6">
                <p className="text-muted-foreground text-lg">
                    There are two main ways to build an agent: the **Graph API** (best for visualizing logic) and the **Functional API** (best for simple, linear steps). 
                </p>

                <div id="qs-graph-simulation">
                    <LangGraphQuickstartSimulator />
                </div>
                <div id="qs-functional-api">
                    <Accordion type="single" collapsible className="w-full mt-6">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-lg font-semibold">Switch to: Functional API Code Example</AccordionTrigger>
                            <AccordionContent>
                                <p className="text-sm text-muted-foreground mb-4">If your agent logic is very simple and doesn't need complex loops, you can use the Functional API which looks more like standard Python.</p>
                                <CodeBlock code={`# Functional API Example
from langgraph.functional import task, entrypoint

@task
def call_model(messages):
    return model.invoke(messages)

@entrypoint
def my_agent(messages):
    response = call_model(messages).result()
    return response

# Run it
for chunk in my_agent.stream("Hello!"):
    print(chunk)`}
                                />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

              </div>
            </Section>

            <Section id="langgraph-persistence" title="LangGraph Persistence" icon={<Save className="h-8 w-8 text-primary" />}>
              <div className="space-y-8">
                <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">The Superpower of Stateful Agents</h3>
                    <p className="text-muted-foreground">
                        LangGraph's persistence layer is what elevates a simple workflow to a truly stateful, long-running agent. By automatically saving the agent's memory at every step, it unlocks powerful capabilities that are impossible with stateless services.
                    </p>
                </div>

                <Card className="bg-muted/40">
                  <CardHeader>
                    <CardTitle className="text-lg">Core Concepts: Threads &amp; Checkpoints</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                      <div>
                        <h4 className="font-semibold text-foreground flex items-center gap-2"><ArrowRight className="text-primary"/>What is a Thread?</h4>
                        <p className="text-muted-foreground pl-6">Think of a thread as a single, continuous conversation. Every time you start a new chat, you give it a unique `thread_id`. This keeps conversations separate.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground flex items-center gap-2"><ArrowRight className="text-primary"/>What is a Checkpoint?</h4>
                        <p className="text-muted-foreground pl-6">A checkpoint is a "Save Point". LangGraph automatically saves the memory after every single step. If the agent crashes, it resumes from the last save point.</p>
                      </div>
                  </CardContent>
                </Card>

                <div id="persistence-simulation">
                    <h3 className="text-xl font-semibold text-foreground mb-2 text-center">Live Simulation: Visualizing Checkpoints</h3>
                    <PersistenceSimulator />
                </div>
                
                 <div id="persistence-history">
                    <h3 className="text-xl font-semibold text-foreground mb-4 pt-12">Interacting with Agent History</h3>
                     <Accordion type="single" collapsible className="w-full space-y-2">
                        <AccordionItem value="get-state" className="border-b-0">
                            <AccordionTrigger className="p-4 bg-muted/30 hover:bg-muted/50 rounded-lg text-left">1. Get State: View the latest snapshot</AccordionTrigger>
                            <AccordionContent className="pt-4 px-2">
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-4">You can retrieve the most recent state of any thread using `get_state`. This is useful for checking the final result of a run.</p>
                                        <CodeBlock code={`# Get latest state
config = {"configurable": {"thread_id": "1"}}
latest = graph.get_state(config)`} />
                                    </div>
                                    <Card className="p-4 bg-background">
                                        <div className="p-3 border-2 border-primary bg-primary/10 rounded-lg text-xs">
                                            <p><span className="font-semibold text-foreground">values:</span> {'{\'foo\': \'b\', \'bar\': [\'a\', \'b\']}'}</p>
                                        </div>
                                    </Card>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="get-history" className="border-b-0">
                            <AccordionTrigger className="p-4 bg-muted/30 hover:bg-muted/50 rounded-lg text-left">2. Get State History: See every step</AccordionTrigger>
                            <AccordionContent className="pt-4 px-2">
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-4">To see the entire journey of an agent, use `get_state_history`. This returns a full list of all checkpoints.</p>
                                        <CodeBlock code={`# List all save points
history = list(graph.get_state_history(config))`} />
                                    </div>
                                    <Card className="p-4 bg-background">
                                        <div className="space-y-2">
                                            <div className="p-2 border rounded-lg text-xs bg-muted/50">Checkpoint 3 (latest)</div>
                                            <div className="p-2 border rounded-lg text-xs bg-muted/50">Checkpoint 2</div>
                                            <div className="p-2 border rounded-lg text-xs bg-muted/50">Checkpoint 1</div>
                                        </div>
                                    </Card>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                         <AccordionItem value="replay" className="border-b-0">
                            <AccordionTrigger className="p-4 bg-muted/30 hover:bg-muted/50 rounded-lg text-left">3. Time Travel: Rerun from a past state</AccordionTrigger>
                            <AccordionContent className="pt-4 px-2">
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-4">LangGraph's "time travel" lets you resume execution from any point in the past by invoking the graph with a specific `checkpoint_id`.</p>
                                        <CodeBlock code={`# Re-run from specific point
config = {"configurable": {
    "thread_id": "1",
    "checkpoint_id": "some_old_id"
}}
graph.invoke(None, config=config)`} />
                                    </div>
                                    <Card className="p-4 bg-background">
                                        <div className="flex items-center justify-center">
                                            <div className="p-2 border rounded-lg text-xs bg-muted/50">Start</div>
                                            <div className="w-4 h-px bg-border"/>
                                            <div className="p-2 border rounded-lg text-xs border-primary bg-primary/10">Resume here</div>
                                        </div>
                                    </Card>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                 </div>
                
                <div id="persistence-memory-store">
                    <h3 className="text-xl font-semibold text-foreground my-8 pt-12">The Memory Store: Long-term Memory</h3>
                    <p className="text-muted-foreground mb-4">
                        While Checkpoints save info for a *single chat*, the **Memory Store** allows an agent to remember things *across different chats*. This is how an agent remembers your name or preferences from yesterday.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                         <Card className="p-3">
                            <CardTitle className="text-sm flex items-center gap-2"><Layers/> Thread 1 (Yesterday)</CardTitle>
                            <CardContent className="pt-2">
                                <p className="text-xs p-2 bg-muted rounded border">User: "I like spicy food."<br/>Agent: "Got it! (Saved to Memory Store)"</p>
                             </CardContent>
                         </Card>
                         <Card className="p-3">
                            <CardTitle className="text-sm flex items-center gap-2"><Layers/> Thread 2 (Today)</CardTitle>
                             <CardContent className="pt-2">
                                <p className="text-xs p-2 bg-muted rounded border">User: "Suggest a restaurant."<br/>Agent: "Since you like spicy food, try this place..."</p>
                             </CardContent>
                         </Card>
                    </div>
                    <CodeBlock code={`# Using Memory Store
from langgraph.store.memory import InMemoryStore
store = InMemoryStore()

# Store user preference across chats
store.put(("user_123", "prefs"), "food", {"spicy": True})`} />
                </div>

                <div id="persistence-context-window">
                    <h3 className="text-xl font-semibold text-foreground my-8 pt-12">Managing Long Conversations</h3>
                    <p className="text-muted-foreground mb-4">
                        If a chat gets too long, it might confuse the AI or cost too much. Here are 3 ways to manage it:
                    </p>
                    <Accordion type="single" collapsible className="w-full space-y-2">
                        <AccordionItem value="trim-messages"  className="border-b-0">
                            <AccordionTrigger className="p-4 bg-muted/30 hover:bg-muted/50 rounded-lg text-left">1. Trimming: Keep only the latest messages</AccordionTrigger>
                            <AccordionContent className="pt-4 px-2">
                                <p className="text-sm text-muted-foreground mb-4">Automatically delete old messages so only the most recent (e.g., last 10) are sent to the AI.</p>
                                <CodeBlock code={`from langchain_core.messages import trim_messages
# Keep only the last 10 messages
trimmed = trim_messages(messages, strategy="last", max_tokens=10)`}/>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="summarize-messages"  className="border-b-0">
                            <AccordionTrigger className="p-4 bg-muted/30 hover:bg-muted/50 rounded-lg text-left">2. Summarizing: Compress the history</AccordionTrigger>
                            <AccordionContent className="pt-4 px-2">
                                <p className="text-sm text-muted-foreground mb-4">Instead of deleting, have the AI write a summary of the old messages to save space.</p>
                                 <CodeBlock code={`# Agent node that updates a summary
def summarize_node(state):
    summary = model.invoke("Summarize these messages: " + state["messages"])
    return {"summary": summary, "messages": [RemoveMessage(id=m.id) for m in old_msgs]}`} />
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="delete-messages"  className="border-b-0">
                            <AccordionTrigger className="p-4 bg-muted/30 hover:bg-muted/50 rounded-lg text-left">3. Deleting: Manual cleanup</AccordionTrigger>
                            <AccordionContent className="pt-4 px-2">
                                <p className="text-sm text-muted-foreground mb-4">Manually remove specific messages from the memory using `RemoveMessage`.</p>
                                <CodeBlock code={`from langchain_core.messages import RemoveMessage
return {"messages": [RemoveMessage(id="msg_id_123")]}`} />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

                 <div id="persistence-implementation">
                    <h3 className="text-xl font-semibold text-foreground my-8 pt-12">Production Database Support</h3>
                    <p className="text-muted-foreground mb-4">For real apps, you need a database to save these checkpoints permanently.</p>
                    <Tabs defaultValue="postgres" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="postgres">Postgres</TabsTrigger>
                            <TabsTrigger value="mongodb">MongoDB</TabsTrigger>
                            <TabsTrigger value="redis">Redis</TabsTrigger>
                        </TabsList>
                        <TabsContent value="postgres">
                            <CodeBlock code={`from langgraph.checkpoint.postgres import PostgresSaver
# Save to Postgres
checkpointer = PostgresSaver.from_conn_string("postgresql://...")
graph = builder.compile(checkpointer=checkpointer)`} />
                        </TabsContent>
                        <TabsContent value="mongodb">
                             <CodeBlock code={`from langgraph.checkpoint.mongodb import MongoDBSaver
# Save to MongoDB
checkpointer = MongoDBSaver.from_conn_string("mongodb://...")`} />
                        </TabsContent>
                        <TabsContent value="redis">
                             <CodeBlock code={`from langgraph.checkpoint.redis import RedisSaver
# Save to Redis
checkpointer = RedisSaver.from_conn_string("redis://...")`} />
                        </TabsContent>
                    </Tabs>
                </div>
              </div>
            </Section>

            <Section id="durable-execution" title="Durable Execution" icon={<ShieldCheck className="h-8 w-8 text-primary" />}>
              <div className="space-y-8">
                <div id="durable-what-is">
                    <p className="text-muted-foreground text-lg">
                        **Durable execution** ensures that if your server crashes in the middle of a task, it doesn't lose progress. It can restart exactly where it left off.
                    </p>
                </div>

                <div id="durable-simulation">
                    <h3 className="text-xl font-semibold text-foreground text-center">Interactive Simulation: Consistent Replay</h3>
                    <DurableExecutionSimulator />
                </div>
              </div>
            </Section>

            <Section id="streaming" title="Streaming in LangGraph" icon={<Radio className="h-8 w-8 text-primary" />}>
              <div className="space-y-8">
                <p className="text-muted-foreground text-lg">
                  Streaming allows the user to see the agent's work as it happens, rather than waiting for the whole process to finish.
                </p>
                <div id="streaming-modes">
                  <h3 className="text-xl font-semibold mb-4 text-foreground">Stream Modes Explained</h3>
                   <Card>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Mode</TableHead>
                            <TableHead>Best For...</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {streamModesData.map((item) => (
                            <TableRow key={item.mode}>
                              <TableCell className="font-mono font-semibold">{item.mode}</TableCell>
                              <TableCell>{item.description}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                   </Card>
                </div>
                <div id="streaming-simulation">
                  <h3 className="text-xl font-semibold text-center my-6 text-foreground">Live Streaming Simulation</h3>
                  <StreamingSimulator />
                </div>
              </div>
            </Section>

            <Section id="interrupts" title="Human-in-the-loop: Interrupts" icon={<UserCheck className="h-8 w-8 text-primary" />}>
              <div className="space-y-8">
                  <p className="text-muted-foreground text-lg">
                      Interrupts allow you to **Pause** the agent and wait for a human to say "Yes" or "No" before continuing. This is vital for tasks like making a payment or deleting a file.
                  </p>

                  <div id="interrupts-simulation">
                      <h3 className="text-xl font-semibold text-foreground text-center mb-4">Interactive Simulation: Approve/Reject</h3>
                      <InterruptsSimulator />
                  </div>
              </div>
            </Section>

            <Section id="mcp" title="Model Context Protocol (MCP)" icon={<ToyBrick className="h-8 w-8 text-primary"/>}>
                <div id="mcp-what-is" className='space-y-4'>
                    <p className="text-muted-foreground text-lg">
                        Model Context Protocol (MCP) is like a **Universal Adapter** for AI. It lets you connect your agent to tools (like weather, search, or databases) without hardcoding them into the agent itself.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="bg-muted/30">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base"><Server className="text-primary"/> MCP Server</CardTitle>
                            </CardHeader>
                            <CardContent><p className="text-sm text-muted-foreground">The "Service" that provides the tool (e.g., a Weather Server).</p></CardContent>
                        </Card>
                         <Card className="bg-muted/30">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base"><Zap className="text-primary"/> MCP Client</CardTitle>
                            </CardHeader>
                            <CardContent><p className="text-sm text-muted-foreground">The "Bridge" that connects your agent to the server.</p></CardContent>
                        </Card>
                    </div>
                </div>

                <div id="mcp-simulation" className="pt-8">
                     <MCPSimulator />
                </div>
            </Section>

            <Section id="references" title="References" icon={<BookCopy className="h-8 w-8 text-primary"/>}>
              <p className="text-muted-foreground mb-6">
                Ready to dive deeper? Check out the official LangChain documentation.
              </p>
              <ul className="list-disc list-inside space-y-3">
                <li><a href="https://docs.langchain.com/oss/python/langgraph/overview" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Official LangGraph Overview</a></li>
                <li><a href="https://docs.langchain.com/oss/python/langgraph/quickstart" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Quickstart Guide</a></li>
                <li><a href="https://docs.langchain.com/oss/python/langgraph/persistence" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Persistence & Memory Docs</a></li>
                <li><a href="https://docs.langchain.com/oss/python/langgraph/interrupts" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Human-in-the-loop Guide</a></li>
              </ul>
            </Section>

          </main>
        </div>
      </div>
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevSection}
          disabled={sections.findIndex(s => s.id === activeSection) === 0}
          className={cn('transition-opacity', sections.findIndex(s => s.id === activeSection) === 0 && 'opacity-50')}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNextSection}
          disabled={sections.findIndex(s => s.id === activeSection) === sections.length - 1}
          className={cn('transition-opacity', sections.findIndex(s => s.id === activeSection) === sections.length - 1 && 'opacity-50')}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Index;
