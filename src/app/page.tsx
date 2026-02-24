'use client';

import { useState, useEffect, useRef } from 'react';
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
import { StreamingSimulator } from '@/components/StreamingSimulator';
import { InterruptsSimulator } from '@/components/InterruptsSimulator';
import { MCPSimulator } from '@/components/MCPSimulator';
import { CoreConceptsSimulator } from '@/components/CoreConceptsSimulator';

import {
  Bot,
  BrainCircuit,
  ChevronUp,
  ChevronDown,
  Users,
  CheckCircle,
  Sparkles,
  Rocket,
  ArrowRight,
  GitBranch,
  Server,
  Link as LinkIcon,
  LineChart,
  Save,
  Database,
  Zap,
  Radio,
  UserCheck,
  ToyBrick,
  BookCopy,
  Workflow,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CodeBlock } from '@/components/ui/code-block';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const sections = [
  { 
    id: 'introduction', 
    title: 'What are AI Agents?', 
    icon: <Bot className="h-8 w-8 text-primary" />,
    subsections: [
        { id: 'core-components', title: 'Core Components' },
        { id: 'tool-integration', title: 'Using Tools' },
    ]
  },
  { 
    id: 'react-agent', 
    title: 'The ReAct Method', 
    icon: <BrainCircuit className="h-8 w-8 text-primary" />,
    subsections: [
        { id: 'react-simulation', title: 'ReAct Simulation' },
        { id: 'react-benefits', title: 'Why use it?' },
    ]
  },
  { 
    id: 'multi-agent', 
    title: 'Teamwork: Multi-Agent Systems', 
    icon: <Users className="h-8 w-8 text-primary" />,
    subsections: [
        { id: 'multi-simulation', title: 'Collaboration Sim' },
        { id: 'multi-frameworks', title: 'Popular Frameworks' },
    ]
  },
  {
    id: 'langgraph-overview',
    title: 'Introduction to LangGraph',
    icon: <GitBranch className="h-8 w-8 text-primary" />,
    subsections: [
        { id: 'lg-key-concepts', title: 'The 3 Big Ideas' },
        { id: 'lg-core-benefits', title: 'Core Benefits' },
        { id: 'lg-ecosystem', title: 'Ecosystem' },
    ]
  },
  {
    id: 'thinking-in-langgraph',
    title: 'How to Build an Agent',
    icon: <Workflow className="h-8 w-8 text-primary" />,
  },
  { 
    id: 'langgraph-quickstart', 
    title: 'LangGraph Quickstart', 
    icon: <Rocket className="h-8 w-8 text-primary" />,
    subsections: [
        { id: 'qs-graph-simulation', title: 'Building the Graph' },
    ]
  },
    { 
    id: 'langgraph-persistence', 
    title: 'Memory & Persistence', 
    icon: <Save className="h-8 w-8 text-primary" />,
    subsections: [
        { id: 'persistence-simulation', title: 'Save Points (Checkpoints)' },
        { id: 'persistence-memory-store', title: 'Long-term Memory' },
        { id: 'persistence-context-window', title: 'Managing History'},
        { id: 'persistence-implementation', title: 'Production Databases' },
    ]
  },
  { 
    id: 'streaming', 
    title: 'Live Updates: Streaming', 
    icon: <Radio className="h-8 w-8 text-primary" />,
    subsections: [
        { id: 'streaming-modes', title: 'Streaming Modes' },
        { id: 'streaming-simulation', title: 'Live Simulation' },
    ]
  },
  {
    id: 'interrupts',
    title: 'Human-in-the-loop',
    icon: <UserCheck className="h-8 w-8 text-primary" />,
    subsections: [
        { id: 'interrupts-simulation', title: 'Approval Simulation' },
    ]
  },
  {
    id: 'mcp',
    title: 'The Universal Adapter (MCP)',
    icon: <ToyBrick className="h-8 w-8 text-primary" />,
    subsections: [
        { id: 'mcp-what-is', title: 'What is MCP?' },
        { id: 'mcp-simulation', title: 'Tool Discovery Simulation' },
    ]
  },
  {
    id: 'references',
    title: 'References',
    icon: <BookCopy className="h-8 w-8 text-primary" />,
  },
];

const allSectionIds = sections.flatMap(s => [s.id, ...(s.subsections ? s.subsections.map(sub => sub.id) : [])]);

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
  { mode: '`values`', description: 'Streams the ENTIRE memory after each step.' },
  { mode: '`updates`', description: 'Streams only the NEW changes at each step.' },
  { mode: '`messages`', description: 'Streams words token-by-token from the AI.' },
  { mode: '`custom`', description: 'Streams any special data you want to send.' },
];

const hitlCode = `from langchain.agents import create_agent
from langchain.agents.middleware import HumanInTheLoopMiddleware 
from langgraph.checkpoint.memory import InMemorySaver 

# Configure an agent that pauses for approval on sensitive tools
agent = create_agent(
    model="gpt-4.1",
    tools=[write_file_tool, execute_sql_tool, read_data_tool],
    middleware=[
        HumanInTheLoopMiddleware( 
            interrupt_on={
                "write_file": True,  # All decisions (approve, edit, reject) allowed
                "execute_sql": {"allowed_decisions": ["approve", "reject"]},  # No editing allowed
                "read_data": False, # Safe operation, no approval needed
            },
            description_prefix="Tool execution pending approval",
        ),
    ],
    # Checkpointer stores the state so the agent can resume after approval
    checkpointer=InMemorySaver(),  
)`;


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
      }, 1000);
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
    <div className="min-h-screen bg-background text-foreground font-body">
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
            
             <Section id="introduction" title="AI Agents: An Overview" icon={<Bot className="h-8 w-8 text-primary" />}>
              <div className="space-y-12">
                <p className="text-muted-foreground text-lg">
                  AI Agents are more than just chatbots. While a simple chatbot just replies to you, an **Agent** can think, plan, and use tools to solve complex tasks for you.
                </p>
                
                <div id="core-components">
                    <h3 className="text-xl font-semibold mb-4 text-foreground">What makes an Agent?</h3>
                    <AgentCoreComponents />
                </div>
                
                <div id="tool-integration" className="pt-8">
                  <h3 className="text-xl font-semibold mb-4 text-foreground">Giving an Agent "Tools"</h3>
                   <p className="text-muted-foreground mb-4">
                        Tools are like the agent's hands. They allow the agent to reach out and do things like search Google, use a calculator, or send an email.
                    </p>
                  <CodeBlock code={`# Give your agent tools to use
tools = [search_web, calculator]

# The agent uses these to interact with the world
agent = create_react_agent(model, tools)

# Query that requires a tool
result = agent.invoke("What is 15 * 4?")`} />
                </div>

              </div>
            </Section>
            
            <Section id="react-agent" title="The ReAct Framework" icon={<BrainCircuit className="h-8 w-8 text-primary" />}>
               <div className="space-y-12">
                 <p className="text-muted-foreground text-lg" id="react-how">
                    ReAct stands for **Reasoning and Acting**. It is a simple loop that agents follow: they write down what they are thinking, then they take an action, then they look at the result.
                  </p>
                  
                  <div id="react-simulation" className="pt-8">
                     <ReActSimulator />
                  </div>

                  <div id="react-benefits" className="pt-8">
                    <h3 className="text-xl font-semibold mb-4 text-foreground">Why use ReAct?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-muted/30">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base"><CheckCircle className="text-primary"/> Fewer Errors</CardTitle>
                            </CardHeader>
                            <CardContent><p className="text-sm text-muted-foreground">Writing down thoughts helps the AI avoid making silly mistakes.</p></CardContent>
                        </Card>
                         <Card className="bg-muted/30">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base"><Sparkles className="text-primary"/> Real-world Data</CardTitle>
                            </CardHeader>
                            <CardContent><p className="text-sm text-muted-foreground">The agent can look up real-time info instead of guessing.</p></CardContent>
                        </Card>
                         <Card className="bg-muted/30">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base"><Rocket className="text-primary"/> Solves Big Tasks</CardTitle>
                            </CardHeader>
                            <CardContent><p className="text-sm text-muted-foreground">It breaks one big problem into many small, easy steps.</p></CardContent>
                        </Card>
                    </div>
                  </div>
               </div>
            </Section>

            <Section id="multi-agent" title="Teamwork: Multi-Agent Systems" icon={<Users className="h-8 w-8 text-primary" />}>
              <div className="space-y-12">
                  <p className="text-muted-foreground text-lg">
                    Sometimes, one agent isn't enough. In a **Multi-Agent System**, several agents work together like a team in an office. One agent might be a "Researcher," while another is a "Writer."
                  </p>

                  <div id="multi-simulation" className="pt-8">
                      <MultiAgentSimulator />
                  </div>
                  
                  <div id="multi-frameworks" className="pt-8">
                     <h3 className="text-xl font-semibold mb-4 text-foreground">Popular Agent Frameworks</h3>
                     <AgentFrameworks />
                  </div>
              </div>
            </Section>

            <Section id="langgraph-overview" title="What is LangGraph?" icon={<GitBranch className="h-8 w-8 text-primary" />}>
                 <div className="space-y-6">
                    <p className="text-muted-foreground text-lg">
                        LangGraph is a library that helps you build reliable agents. It lets you draw a "map" (a graph) of how your agent should work.
                    </p>
                    <div id="lg-key-concepts">
                        <Card className="bg-muted/40 mb-8 border-2">
                          <CardHeader>
                            <CardTitle>The 3 Big Ideas</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-6">
                              <div className="p-4 bg-background/50 rounded-lg border">
                                <h4 className="font-bold text-foreground flex items-center gap-2 mb-2"><Zap size={18} className="text-primary"/> 1. The Runtime (The Engine)</h4>
                                <p className="text-sm text-muted-foreground">Think of the **Runtime** as the engine of a car. It's the system that follows your map and moves the agent from step 1 to step 2 in the correct order.</p>
                              </div>
                              <div className="p-4 bg-background/50 rounded-lg border">
                                <h4 className="font-bold text-foreground flex items-center gap-2 mb-2"><Database size={18} className="text-primary"/> 2. Stateful (The Memory)</h4>
                                <p className="text-sm text-muted-foreground">A stateful agent has a **Shared Notebook**. Every step can read what happened before and write down new discoveries, ensuring nothing is forgotten.</p>
                              </div>
                              <div className="p-4 bg-background/50 rounded-lg border">
                                <h4 className="font-bold text-foreground flex items-center gap-2 mb-2"><Clock size={18} className="text-primary"/> 3. Long-Running (The Pause Button)</h4>
                                <p className="text-sm text-muted-foreground">LangGraph agents can **Pause**. They can wait for a human to approve something, then "wake up" days later and continue exactly where they were.</p>
                              </div>
                          </CardContent>
                        </Card>
                        <CoreConceptsSimulator />
                    </div>
                     <div id="lg-core-benefits" className="space-y-4 pt-12">
                        <h3 className="text-xl font-semibold text-foreground">Why use LangGraph?</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <Card className="bg-muted/30"><CardHeader><CardTitle className="text-base">Persistence</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">If your server crashes, the agent doesn't lose its work. It resumes from the last save point.</p></CardContent></Card>
                           <Card className="bg-muted/30"><CardHeader><CardTitle className="text-base">Human Oversight</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">You can stop the agent at any point to check its work or change its mind.</p></CardContent></Card>
                           <Card className="bg-muted/30"><CardHeader><CardTitle className="text-base">Infinite Memory</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Agents can remember your name and preferences across many different chats.</p></CardContent></Card>
                           <Card className="bg-muted/30"><CardHeader><CardTitle className="text-base">Easy Debugging</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Using tools like LangSmith, you can see a perfect trace of every step the AI took.</p></CardContent></Card>
                        </div>
                    </div>
                    
                    <div id="lg-ecosystem" className="space-y-4 pt-12">
                        <h3 className="text-xl font-semibold text-foreground">The LangChain Ecosystem</h3>
                        <div className="space-y-4">
                            <EcosystemCard title="LangSmith" icon={<LineChart />} href="http://www.langchain.com/langsmith">
                                See exactly what your AI is doing step-by-step.
                            </EcosystemCard>
                             <EcosystemCard title="LangChain" icon={<LinkIcon />} href="https://docs.langchain.com/oss/python/langchain/overview">
                                The main library for connecting LLMs to data and tools.
                            </EcosystemCard>
                        </div>
                    </div>
                 </div>
            </Section>

            <Section id="thinking-in-langgraph" title="How to Build an Agent" icon={<Workflow className="h-8 w-8 text-primary" />}>
                <ThinkingInLangGraph />
            </Section>

            <Section id="langgraph-quickstart" title="LangGraph Quickstart" icon={<Rocket className="h-8 w-8 text-primary" />}>
              <div className="space-y-6">
                <p className="text-muted-foreground text-lg">
                    The best way to build a reliable agent is by drawing a **Graph**. This gives you full control over how data flows and how the AI interacts with tools.
                </p>

                <div id="qs-graph-simulation">
                    <LangGraphQuickstartSimulator />
                </div>
              </div>
            </Section>

            <Section id="langgraph-persistence" title="Memory & Persistence" icon={<Save className="h-8 w-8 text-primary" />}>
              <div className="space-y-8">
                <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">The Superpower of Memory</h3>
                    <p className="text-muted-foreground">
                        LangGraph's persistence layer is what allows an agent to "save" its work. This means it can handle long conversations or complex tasks without "forgetting" what happened.
                    </p>
                </div>

                <Card className="bg-muted/40">
                  <CardHeader>
                    <CardTitle className="text-lg">Threads & Save Points</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                      <div>
                        <h4 className="font-semibold text-foreground flex items-center gap-2"><ArrowRight className="text-primary"/>What is a Thread?</h4>
                        <p className="text-muted-foreground pl-6">A thread is a single conversation. Every time you start a new chat, LangGraph creates a new `thread_id` to keep your memories organized.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground flex items-center gap-2"><ArrowRight className="text-primary"/>What is a Checkpoint?</h4>
                        <p className="text-muted-foreground pl-6">A checkpoint is a **Save Point**. LangGraph saves the memory after every single step. If the AI crashes, it just restarts from the last save point.</p>
                      </div>
                  </CardContent>
                </Card>

                <div id="persistence-simulation">
                    <h3 className="text-xl font-semibold text-foreground mb-2 text-center">Live Simulation: Creating Save Points</h3>
                    <PersistenceSimulator />
                </div>
                
                <div id="persistence-memory-store">
                    <h3 className="text-xl font-semibold text-foreground my-8 pt-12">Long-term Memory (The Store)</h3>
                    <p className="text-muted-foreground mb-4">
                        Checkpoints save info for a *single chat*. The **Memory Store** allows an agent to remember things *across different chats*. This is how an agent remembers your favorite color from a conversation you had yesterday.
                    </p>
                    <CodeBlock code={`# Save user preference across all chats
from langgraph.store.memory import InMemoryStore
store = InMemoryStore()

# The agent saves your preference
store.put(("user_123", "prefs"), "favorite_color", {"color": "blue"})`} />
                </div>

                <div id="persistence-context-window">
                    <h3 className="text-xl font-semibold text-foreground my-8 pt-12">Handling Long Conversations</h3>
                    <p className="text-muted-foreground mb-4">
                        If a chat gets too long, the AI might get confused. Here are 3 ways to keep things clean:
                    </p>
                    <Accordion type="single" collapsible className="w-full space-y-2">
                        <AccordionItem value="trim-messages"  className="border-b-0">
                            <AccordionTrigger className="p-4 bg-muted/30 hover:bg-muted/50 rounded-lg text-left">1. Trimming: Deleting Old Messages</AccordionTrigger>
                            <AccordionContent className="pt-4 px-2">
                                <p className="text-sm text-muted-foreground mb-4">Only keep the most recent messages (e.g., the last 10) so the AI stays focused.</p>
                                <CodeBlock code={`from langchain_core.messages import trim_messages
# Keep only the last 10 messages
trimmed = trim_messages(messages, strategy="last", max_tokens=10)`}/>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="summarize-messages"  className="border-b-0">
                            <AccordionTrigger className="p-4 bg-muted/30 hover:bg-muted/50 rounded-lg text-left">2. Summarizing: Compressing History</AccordionTrigger>
                            <AccordionContent className="pt-4 px-2">
                                <p className="text-sm text-muted-foreground mb-4">Instead of deleting, have the AI write a short summary of the old conversation to save space.</p>
                                 <CodeBlock code={`# The agent node creates a summary of old messages
def summarize_node(state):
    summary = model.invoke("Summarize these: " + state["messages"])
    return {"summary": summary, "messages": [RemoveMessage(id=m.id) for m in old_msgs]}`} />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

                 <div id="persistence-implementation">
                    <h3 className="text-xl font-semibold text-foreground my-8 pt-12">Production Databases</h3>
                    <p className="text-muted-foreground mb-4">For real apps, you need a database to save these memories forever.</p>
                    <Tabs defaultValue="postgres" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="postgres">Postgres</TabsTrigger>
                            <TabsTrigger value="mongodb">MongoDB</TabsTrigger>
                            <TabsTrigger value="redis">Redis</TabsTrigger>
                        </TabsList>
                        <TabsContent value="postgres">
                            <CodeBlock code={`from langgraph.checkpoint.postgres import PostgresSaver
# Save to a Postgres database
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

            <Section id="streaming" title="Live Updates: Streaming" icon={<Radio className="h-8 w-8 text-primary" />}>
              <div className="space-y-8">
                <p className="text-muted-foreground text-lg">
                  Streaming allows the user to see the agent's work as it happens, rather than waiting for the whole process to finish.
                </p>
                <div id="streaming-modes">
                  <h3 className="text-xl font-semibold mb-4 text-foreground">Streaming Modes</h3>
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

            <Section id="interrupts" title="Human-in-the-loop" icon={<UserCheck className="h-8 w-8 text-primary" />}>
              <div className="space-y-8">
                  <p className="text-muted-foreground text-lg">
                      Interrupts allow you to **Pause** the agent and wait for a human to say "Approve" or "Reject" before continuing. This is vital for tasks like making a payment.
                  </p>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">How it works in code</h3>
                        <p className="text-sm text-muted-foreground">
                            You can set up "Middleware" that monitors tool calls and pauses the agent if a sensitive tool (like writing a file or executing SQL) is about to run.
                        </p>
                        <CodeBlock code={hitlCode} />
                    </div>
                    <div id="interrupts-simulation" className="space-y-4">
                        <h3 className="text-xl font-semibold text-foreground text-center">Live Approval Simulator</h3>
                        <InterruptsSimulator />
                    </div>
                  </div>
              </div>
            </Section>

            <Section id="mcp" title="The Universal Adapter (MCP)" icon={<ToyBrick className="h-8 w-8 text-primary"/>}>
                <div id="mcp-what-is" className='space-y-4'>
                    <p className="text-muted-foreground text-lg">
                        **Model Context Protocol (MCP)** is like a universal adapter for AI. It lets you connect your agent to any data source (like weather, search, or databases) without hardcoding them.
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
                Ready to dive deeper? Check out the official documentation.
              </p>
              <ul className="list-disc list-inside space-y-3">
                <li><a href="https://docs.langchain.com/oss/python/langgraph/overview" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Official LangGraph Overview</a></li>
                <li><a href="https://docs.langchain.com/oss/python/langchain/overview" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Official LangChain Overview</a></li>
                <li><a href="https://docs.langgraph.com/quickstart" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Quickstart Guide</a></li>
                <li><a href="https://docs.langgraph.com/concepts/persistence" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Persistence & Memory Docs</a></li>
                <li><a href="https://docs.langgraph.com/how-tos/human-in-the-loop" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Human-in-the-loop Guide</a></li>
                <li><a href="https://docs.langgraph.com/how-tos/streaming" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Streaming Guide</a></li>
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
