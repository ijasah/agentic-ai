"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, RefreshCw, ArrowRight, BrainCircuit, Info, Database, Wand2, CheckCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

const agentCode = `from langgraph.graph import StateGraph, START, END
from typing import Annotated
from typing_extensions import TypedDict
import operator

# 1. Define the agent's memory (State)
class AgentState(TypedDict):
    messages: Annotated[list, operator.add]
    llm_calls: int

# 2. Define the skills (Nodes)
def llm_call(state: AgentState):
    """The AI thinks and decides what to do"""
    return {"messages": [response], "llm_calls": 1}

def tool_node(state: AgentState):
    """The agent uses a tool (like a calculator)"""
    return {"messages": [tool_result]}

# 3. Build the map (The Graph)
workflow = StateGraph(AgentState)

workflow.add_node("agent", llm_call)
workflow.add_node("tools", tool_node)

workflow.add_edge(START, "agent")
workflow.add_conditional_edges(
    "agent",
    should_continue, # Logic to decide: tools or end?
    {"tools": "tools", "end": END}
)
workflow.add_edge("tools", "agent")

app = workflow.compile()
`;

const steps = [
    { name: 'Ready', highlight: { start: -1, end: -1 }, explanation: 'Click "Start" to see how we build and run an AI agent graph.', graph: { start: true }, execution: {}, state: { messages: [], llm_calls: 0 }, trace: [] },
    { name: 'Define State', highlight: { start: 6, end: 9 }, explanation: 'Every agent needs a memory. We call this "State". It holds the conversation history.', graph: { start: true }, execution: {}, state: { messages: [], llm_calls: 0 }, trace: [] },
    { name: 'Add Nodes', highlight: { start: 23, end: 24 }, explanation: 'Nodes are the "steps" in your process. We add an "agent" node for thinking and a "tools" node for doing work.', graph: { start: true, agent: true, tools: true }, execution: {}, state: { messages: [], llm_calls: 0 }, trace: [] },
    { name: 'Connect Start', highlight: { start: 26, end: 26 }, explanation: 'We tell LangGraph where to begin. Here, we start by going directly to the AI "agent" node.', graph: { start: true, agent: true, tools: true, start_edge: true }, execution: {}, state: { messages: [], llm_calls: 0 }, trace: [] },
    { name: 'Decision Logic', highlight: { start: 27, end: 31 }, explanation: 'The AI decides: "Do I need a tool?" If yes, it goes to tools. If no, it goes to the END.', graph: { start: true, agent: true, tools: true, start_edge: true, decision_edge: true }, execution: {}, state: { messages: [], llm_calls: 0 }, trace: [] },
    { name: 'Loop Edge', highlight: { start: 32, end: 32 }, explanation: 'After using a tool, the agent MUST go back to the "agent" node to see the result and finish.', graph: { start: true, agent: true, tools: true, start_edge: true, decision_edge: true, loop_edge: true }, execution: {}, state: { messages: [], llm_calls: 0 }, trace: [] },
    { name: 'Invoke', highlight: { start: 34, end: 34 }, explanation: 'We run the agent with a message: "What is 3 + 4?". The engine starts at START.', graph: { start: true, agent: true, tools: true, start_edge: true, decision_edge: true, loop_edge: true }, execution: { start: true }, state: { messages: [{ role: 'user', content: 'What is 3 + 4?' }], llm_calls: 0 }, trace: [{ content: 'User: "What is 3 + 4?"' }] },
    { name: 'AI Thinking', highlight: { start: 12, end: 14 }, explanation: 'The "agent" node runs. The AI decides it needs the "add" tool.', graph: { start: true, agent: true, tools: true, start_edge: true, decision_edge: true, loop_edge: true }, execution: { agent: true, start_edge: true }, state: { messages: [{ role: 'user', content: 'What is 3 + 4?' }], llm_calls: 1 }, trace: [{ content: 'AI: I need to use the "add" tool.' }] },
    { name: 'Tool Run', highlight: { start: 16, end: 18 }, explanation: 'The "tools" node runs. It calculates 3 + 4 = 7.', graph: { start: true, agent: true, tools: true, start_edge: true, decision_edge: true, loop_edge: true }, execution: { tools: true, decision_edge: true }, state: { messages: [{ role: 'user', content: 'What is 3 + 4?' }, { role: 'ai', content: 'Calling add(3, 4)' }, { role: 'tool', content: '7' }], llm_calls: 1 }, trace: [{ content: 'Tool: Result is 7.' }] },
    { name: 'Final Answer', highlight: { start: 27, end: 31 }, explanation: 'The AI sees the tool result and provides the final answer. The graph reaches the END.', graph: { start: true, agent: true, tools: true, start_edge: true, decision_edge: true, loop_edge: true }, execution: { end: true, agent: true, loop_edge: true }, state: { messages: [{ role: 'user', content: 'What is 3 + 4?' }, { role: 'ai', content: 'Calling add(3, 4)' }, { role: 'tool', content: '7' }, { role: 'ai', content: 'The sum is 7.' }], llm_calls: 2 }, trace: [{ content: 'AI: The sum is 7.' }] },
];

const CANVAS_W = 500;
const CANVAS_H = 300;

// Nodes placed for a clean flow: START -> AGENT -> END (straight), AGENT -> TOOLS (loop)
const NODES = {
    START: { x: 80, y: 150 },
    AGENT: { x: 250, y: 80 },
    TOOLS: { x: 250, y: 220 },
    END: { x: 420, y: 150 },
};

const NodeCard = ({ x, y, label, visible, active }: { x: number, y: number, label: string, visible?: boolean, active?: boolean }) => (
    <motion.g animate={{ opacity: visible ? 1 : 0.1 }}>
        <motion.rect
            x={x - 45} y={y - 25} width="90" height="50" rx="12"
            animate={{ 
                stroke: active ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                fill: active ? 'hsla(var(--primary), 0.15)' : 'hsl(var(--card))',
                scale: active ? 1.05 : 1,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="stroke-2 shadow-sm"
        />
        <text x={x} y={y + 5} textAnchor="middle" className={cn("text-[11px] font-bold tracking-tight uppercase fill-foreground transition-colors", active ? "fill-primary" : "fill-muted-foreground")}>
            {label}
        </text>
        {active && (
            <motion.circle
                cx={x} cy={y} r="30"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="fill-primary/20 pointer-events-none"
            />
        )}
    </motion.g>
);

export const LangGraphQuickstartSimulator = () => {
    const [step, setStep] = useState(0);
    const currentStepData = steps[step];
    const codeLines = agentCode.split('\n');

    const handleNext = () => setStep(s => Math.min(s + 1, steps.length - 1));
    const handleReset = () => setStep(0);

    return (
        <Card className="bg-muted/30 border-2 border-primary/10 overflow-hidden shadow-inner">
            <CardHeader className="text-center bg-primary/5 pb-6 border-b">
                 <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                    <Sparkles className="text-primary"/> Graph API Simulation
                 </CardTitle>
                 <CardDescription className="text-lg max-w-2xl mx-auto mt-2 h-16 flex items-center justify-center text-foreground">
                   {currentStepData.explanation}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
                 <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Code Panel */}
                    <div className="bg-black/60 rounded-xl border border-primary/20 p-2 text-xs font-mono h-[550px] shadow-2xl overflow-hidden">
                        <ScrollArea className="h-full">
                            <pre className="p-4">
                                {codeLines.map((line, i) => {
                                    const isHighlighted = currentStepData.highlight.start <= i + 1 && currentStepData.highlight.end >= i + 1;
                                    return (
                                        <div key={i} className={cn("px-2 py-0.5 transition-all duration-500 flex gap-4 border-l-4", isHighlighted ? 'bg-primary/20 border-primary scale-[1.02]' : 'opacity-30 border-transparent')}>
                                            <span className="text-right text-muted-foreground/40 w-6 shrink-0">{i + 1}</span>
                                            <span className={cn(isHighlighted ? "text-white font-medium" : "text-gray-400")}>{line || ' '}</span>
                                        </div>
                                    );
                                })}
                            </pre>
                        </ScrollArea>
                    </div>

                    {/* Visualization Panel */}
                    <div className="flex flex-col gap-6 h-[550px]">
                        <div className="relative flex-grow bg-background/80 rounded-xl border-2 border-dashed border-primary/20 shadow-inner overflow-hidden">
                            <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}>
                                <defs>
                                    <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="5" refY="2" orientation="auto">
                                        <polygon points="0 0, 6 2, 0 4" fill="currentColor" />
                                    </marker>
                                </defs>
                                
                                {/* Background Grid */}
                                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(var(--muted))" strokeWidth="0.5" opacity="0.2" />
                                </pattern>
                                <rect width="100%" height="100%" fill="url(#grid)" />

                                {/* Edges (Thin, Consistent, Labeled) */}
                                <g className="text-muted-foreground/40">
                                    {/* START -> AGENT */}
                                    <motion.path 
                                        d={`M 125 150 Q 160 115 205 85`} 
                                        fill="none" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrowhead)" 
                                        animate={{ opacity: currentStepData.graph.start_edge ? 1 : 0.2, stroke: currentStepData.execution.start_edge ? 'hsl(var(--primary))' : 'currentColor' }} 
                                    />
                                    
                                    {/* AGENT -> TOOLS (Decision) */}
                                    <motion.path 
                                        d={`M 240 105 Q 230 150 240 195`} 
                                        fill="none" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrowhead)" 
                                        animate={{ opacity: currentStepData.graph.decision_edge ? 1 : 0.2, stroke: currentStepData.execution.tools ? 'hsl(var(--primary))' : 'currentColor' }} 
                                    />
                                    
                                    {/* TOOLS -> AGENT (Loop Back) */}
                                    <motion.path 
                                        d={`M 260 195 Q 270 150 260 105`} 
                                        fill="none" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrowhead)" 
                                        animate={{ opacity: currentStepData.graph.loop_edge ? 1 : 0.2, stroke: currentStepData.execution.loop_edge ? 'hsl(var(--primary))' : 'currentColor' }} 
                                    />
                                    
                                    {/* AGENT -> END (Decision) */}
                                    <motion.path 
                                        d={`M 295 85 Q 340 115 375 150`} 
                                        fill="none" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrowhead)" 
                                        animate={{ opacity: currentStepData.graph.decision_edge ? 1 : 0.2, stroke: currentStepData.execution.end ? 'hsl(var(--primary))' : 'currentColor' }} 
                                    />
                                </g>

                                {/* Nodes */}
                                <g>
                                    <NodeCard x={NODES.START.x} y={NODES.START.y} label="START" visible={currentStepData.graph.start} active={currentStepData.execution.start} />
                                    <NodeCard x={NODES.AGENT.x} y={NODES.AGENT.y} label="AGENT" visible={currentStepData.graph.agent} active={currentStepData.execution.agent} />
                                    <NodeCard x={NODES.TOOLS.x} y={NODES.TOOLS.y} label="TOOLS" visible={currentStepData.graph.tools} active={currentStepData.execution.tools} />
                                    <NodeCard x={NODES.END.x} y={NODES.END.y} label="END" visible={currentStepData.graph.decision_edge} active={currentStepData.execution.end} />
                                </g>
                            </svg>
                        </div>

                        {/* Trace and State Output */}
                        <div className="h-48 grid grid-cols-2 gap-4">
                            <div className="bg-background/60 p-4 rounded-lg border flex flex-col shadow-inner">
                                <h4 className="text-[10px] font-bold uppercase mb-3 flex items-center gap-2 text-primary tracking-widest">
                                    <Info size={12}/> Console Log
                                </h4>
                                <ScrollArea className="flex-grow">
                                    <AnimatePresence>
                                        {currentStepData.trace.map((t, i) => (
                                            <motion.div 
                                                key={i} 
                                                initial={{ opacity: 0, x: -10 }} 
                                                animate={{ opacity: 1, x: 0 }}
                                                className="text-[11px] mb-2 p-2 bg-primary/5 rounded border-l-2 border-primary font-mono"
                                            >
                                                {t.content}
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </ScrollArea>
                            </div>
                            <div className="bg-background/60 p-4 rounded-lg border flex flex-col shadow-inner">
                                <h4 className="text-[10px] font-bold uppercase mb-3 flex items-center gap-2 text-primary tracking-widest">
                                    <Database size={12}/> Live State
                                </h4>
                                <div className="text-[11px] space-y-3 font-mono">
                                    <div className="flex justify-between items-center border-b border-muted pb-1">
                                        <span className="text-muted-foreground">llm_calls:</span> 
                                        <span className="text-primary font-bold">{currentStepData.state.llm_calls}</span>
                                    </div>
                                    <div className="pt-1">
                                        <span className="text-muted-foreground block mb-1">messages:</span>
                                        <div className="pl-2 border-l-2 border-muted text-xs text-muted-foreground/80 overflow-hidden text-ellipsis whitespace-nowrap">
                                            [{currentStepData.state.messages.length > 0 ? "..." : ""}]
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center gap-4 mt-8 pt-6 border-t border-primary/10">
                    <Button onClick={handleReset} variant="outline" disabled={step === 0} className="w-32">
                        <RefreshCw className="mr-2 h-4 w-4"/>Reset
                    </Button>
                    <Button onClick={handleNext} disabled={step === steps.length - 1} className="w-48 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20">
                        {step === 0 ? "Start Tutorial" : "Next Step"} <ArrowRight className="ml-2 h-4 w-4"/>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
