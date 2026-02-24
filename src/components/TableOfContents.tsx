'use client';

import { cn } from '@/lib/utils';
import { Bot, BrainCircuit, Users, GitBranch, ChevronRight, Rocket, Workflow, Save, Radio, UserCheck, ToyBrick, BookCopy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const sections = [
  { 
    id: 'introduction', 
    title: 'AI Agents Overview', 
    icon: <Bot className="w-4 h-4" />,
    subsections: [
        { id: 'core-components', title: 'Core Components' },
        { id: 'tool-integration', title: 'Tool Integration' },
    ]
  },
  { 
    id: 'react-agent', 
    title: 'The ReAct Framework', 
    icon: <BrainCircuit className="w-4 h-4" />,
    subsections: [
        { id: 'react-simulation', title: 'ReAct Simulation' },
        { id: 'react-benefits', title: 'Key Benefits' },
    ]
  },
  { 
    id: 'multi-agent', 
    title: 'Multi-Agent Systems', 
    icon: <Users className="w-4 h-4" />,
    subsections: [
        { id: 'multi-simulation', title: 'Collaboration Sim' },
        { id: 'multi-frameworks', title: 'Popular Frameworks' },
    ]
  },
  {
    id: 'langgraph-overview',
    title: 'LangGraph Introduction',
    icon: <GitBranch className="w-4 h-4" />,
    subsections: [
        { id: 'lg-key-concepts', title: 'The 3 Big Ideas' },
        { id: 'lg-core-benefits', title: 'Core Benefits' },
        { id: 'lg-ecosystem', title: 'Ecosystem' },
    ]
  },
  {
    id: 'thinking-in-langgraph',
    title: 'Building an Agent',
    icon: <Workflow className="w-4 h-4" />,
  },
  {
    id: 'langgraph-quickstart',
    title: 'LangGraph Quickstart',
    icon: <Rocket className="w-4 h-4" />,
    subsections: [
        { id: 'qs-graph-simulation', title: 'Graph Simulation' },
    ]
  },
  { 
    id: 'langgraph-persistence', 
    title: 'Memory & Persistence', 
    icon: <Save className="w-4 h-4" />,
    subsections: [
        { id: 'persistence-simulation', title: 'Live Simulation' },
        { id: 'persistence-memory-store', title: 'Memory Store' },
        { id: 'persistence-context-window', title: 'Managing History'},
        { id: 'persistence-implementation', title: 'Implementation' },
    ]
  },
  { 
    id: 'streaming', 
    title: 'Streaming & Updates', 
    icon: <Radio className="w-4 h-4" />,
    subsections: [
        { id: 'streaming-modes', title: 'Streaming Modes' },
        { id: 'streaming-simulation', title: 'Live Simulation' },
    ]
  },
  {
    id: 'interrupts',
    title: 'Human-in-the-loop',
    icon: <UserCheck className="w-4 h-4" />,
    subsections: [
        { id: 'interrupts-simulation', title: 'Approval Simulation' },
    ]
  },
  {
    id: 'mcp',
    title: 'Model Context Protocol',
    icon: <ToyBrick className="w-4 h-4" />,
    subsections: [
        { id: 'mcp-what-is', title: 'What is MCP?' },
        { id: 'mcp-simulation', title: 'Tool Discovery Sim' },
    ]
  },
  {
    id: 'references',
    title: 'References',
    icon: <BookCopy className="w-4 h-4" />,
  },
];

interface TableOfContentsProps {
    activeSectionId: string;
    activeSubSectionId: string;
    onLinkClick: (id: string) => void;
}

export const TableOfContents = ({ activeSectionId, activeSubSectionId, onLinkClick }: TableOfContentsProps) => {
  return (
    <div className="sticky top-24">
      <h3 className="text-lg font-bold mb-4 text-primary uppercase tracking-wider text-[10px]">Tutorial Path</h3>
      <nav>
        <ul className="space-y-1">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                onClick={(e) => {
                    e.preventDefault();
                    onLinkClick(section.id);
                }}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-transparent',
                  activeSectionId === section.id
                    ? 'bg-primary/10 text-primary border-primary/20 shadow-sm'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                )}
              >
                {section.icon}
                {section.title}
              </a>
               <AnimatePresence>
                {activeSectionId === section.id && section.subsections && (
                    <motion.ul 
                        className="ml-4 mt-1 pl-4 border-l-2 border-primary/10 space-y-1"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        {section.subsections.map(subsection => (
                            <li key={subsection.id}>
                                <a
                                    href={`#${subsection.id}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onLinkClick(subsection.id);
                                    }}
                                    className={cn(
                                        "flex items-center gap-2 py-1.5 px-2 rounded-md text-[11px] font-medium transition-colors hover:text-primary hover:bg-primary/5",
                                        activeSubSectionId === subsection.id ? "text-primary bg-primary/5" : "text-muted-foreground"
                                    )}
                                >
                                    <ChevronRight className="w-3 h-3" />
                                    {subsection.title}
                                </a>
                            </li>
                        ))}
                    </motion.ul>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
