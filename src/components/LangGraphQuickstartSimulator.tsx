
"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, RefreshCw, ArrowRight, BrainCircuit, Eye, Info, User, Wand2, CheckCircle, Sparkles, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
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
    { name: 'Ready', highlight: { start: -1, end: -1 }, explanation: 'Click "Start" to see how we build and run an AI agent graph.', graph: {}, execution: {}, state: { messages: [], llm_calls: 0 }, trace: [] },
    { name: 'Define State', highlight: { start: 6, end: 9 }, explanation: 'Every agent needs a memory. We call this "State". It holds the conversation history.', graph: {}, execution: {}, state: { messages: [], llm_calls: 0 }, trace: [] },
    { name: 'Add Nodes', highlight: { start: 23, end: 24 }, explanation: 'Nodes are the "steps" in your process. We add an "agent" node for thinking and a "tools" node for doing work.', graph: { start: true, agent: true, tools: true }, execution: {}, state: { messages: [], llm_calls: 0 }, trace: [] },
    { name: 'Connect Start', highlight: { start: 26, end: 26 }, explanation: 'We tell LangGraph where to begin. Here, we start by going directly to the AI "agent" node.', graph: { start: true, agent: true, tools: true, start_edge: true }, execution: {}, state: { messages: [], llm_calls: 0 }, trace: [] },
    { name: 'Decision Logic', highlight: { start: 27, end: 31 }, explanation: 'The AI decides: "Do I need a tool?" If yes, it goes to tools. If no, it goes to the END.', graph: { start: true, agent: true, tools: true, start_edge: true, decision_edge: true }, execution: {}, state: { messages: [], llm_calls: 0 }, trace: [] },
    { name: 'Loop Edge', highlight: { start: 32, end: 32 }, explanation: 'After using a tool, the agent MUST go back to the "agent" node to see the result and finish.', graph: { start: true, agent: true, tools: true, start_edge: true, decision_edge: true, loop_edge: true }, execution: {}, state: { messages: [], llm_calls: 0 }, trace: [] },
    { name: 'Invoke', highlight: { start: 34, end: 34 }, explanation: 'We run the agent with a message: "What is 3 + 4?". The engine starts at START.', graph: { start: true, agent: true, tools: true, start_edge: true, decision_edge: true, loop_edge: true }, execution: { start: true }, state: { messages: [{ role: 'user', content: 'What is 3 + 4?' }], llm_calls: 0 }, trace: [{ type: 'Info', content: 'User: "What is 3 + 4?"' }] },
    { name: 'AI Thinking', highlight: { start: 12, end: 14 }, explanation: 'The "agent" node runs. The AI decides it needs the "add" tool.', graph: { start: true, agent: true, tools: true, start_edge: true, decision_edge: true, loop_edge: true }, execution: { agent: true, start_edge: true }, state: { messages: [{ role: 'user', content: 'What is 3 + 4?' }], llm_calls: 1 }, trace: [{ type: 'Info', content: 'User: "What is 3 + 4?"' }, { type: 'Thought', content: 'I need to use the "add" tool.' }] },
    { name: 'Tool Run', highlight: { start: 16, end: 18 }, explanation: 'The "tools" node runs. It calculates 3 + 4 = 7.', graph: { start: true, agent: true, tools: true, start_edge: true, decision_edge: true, loop_edge: true }, execution: { tools: true, decision_edge: true }, state: { messages: [{ role: 'user', content: 'What is 3 + 4?' }, { role: 'ai', content: 'Calling add(3, 4)' }, { role: 'tool', content: '7' }], llm_calls: 1 }, trace: [{ type: 'Info', content: 'User: "What is 3 + 4?"' }, { type: 'Thought', content: 'I need to use the "add" tool.' }, { type: 'Action', content: 'Result: 7' }] },
    { name: 'Final Answer', highlight: { start: 27, end: 31 }, explanation: 'The AI sees the tool result and provides the final answer. The graph reaches the END.', graph: { start: true, agent: true, tools: true, start_edge: true, decision_edge: true, loop_edge: true }, execution: { end: true, agent: true, loop_edge: true }, state: { messages: [{ role: 'user', content: 'What is 3 + 4?' }, { role: 'ai', content: 'Calling add(3, 4)' }, { role: 'tool', content: '7' }, { role: 'ai', content: 'The sum is 7.' }], llm_calls: 2 }, trace: [{ type: 'Info', content: 'User: "What is 3 + 4?"' }, { type: 'Thought', content: 'I need to use the "add" tool.' }, { type: 'Action', content: 'Result: 7' }, { type: 'Final Answer', content: 'The sum is 7.' }] },
];

const NODE_START = { x: 80, y: 150 };
const NODE_AGENT = { x: 250, y: 80 };
const NODE_TOOLS = { x: 250, y: 220 };
const NODE_END = { x: 420, y: 150 };

export const LangGraphQuickstartSimulator = () => {
    const [step, setStep] = useState(0);
    const currentStepData = steps[step];
    const codeLines = agentCode.split('\n');

    const handleNext = () => setStep(s => Math.min(s + 1, steps.length - 1));
    const handleReset = () => setStep(0);

    return (
        <Card className="bg-muted/30 border-2 border-primary/10 overflow-hidden">
            <CardHeader className="text-center bg-primary/5 pb-6">
                 <CardTitle className="text-2xl font-bold">How to Build & Run a Graph</CardTitle>
                 <CardDescription className="text-lg max-w-2xl mx-auto mt-2 h-16 flex items-center justify-center">
                   {currentStepData.explanation}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
                 <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Code Panel */}
                    <div className="bg-black/40 rounded-xl border border-primary/20 p-2 text-xs font-mono h-[550px] shadow-2xl">
                        <ScrollArea className="h-full">
                            <pre className="p-4">
                                {codeLines.map((line, i) => {
                                    const isHighlighted = currentStepData.highlight.start <= i + 1 && currentStepData.highlight.end >= i + 1;
                                    return (
                                        <div key={i} className={cn("px-2 py-0.5 transition-all duration-500 flex gap-4", isHighlighted ? 'bg-primary/25 border-l-2 border-primary scale-[1.02]' : 'opacity-40')}>
                                            <span className="text-right text-muted-foreground/40 w-6 shrink-0">{i + 1}</span>
                                            <span className={cn(isHighlighted ? "text-white" : "text-gray-400")}>{line || ' '}</span>
                                        </div>
                                    );
                                })}
                            </pre>
                        </ScrollArea>
                    </div>

                    {/* Visualization Panel */}
                    <div className="flex flex-col gap-6 h-[550px]">
                        <div className="relative flex-grow bg-background/50 rounded-xl border-2 border-dashed border-primary/20 p-4">
                            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 300">
                                <defs>
                                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orientation="auto">
                                        <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
                                    </marker>
                                </defs>
                                
                                {/* Paths with alignment fixes */}
                                <g className="text-muted-foreground/20">
                                    {/* START -> AGENT */}
                                    <motion.path d={`M ${NODE_START.x + 40} ${NODE_START.y - 10} L ${NODE_AGENT.x - 40} ${NODE_AGENT.y + 10}`} fill="none" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrowhead)" animate={{ opacity: currentStepData.graph.start_edge ? 1 : 0.2, stroke: currentStepData.execution.start_edge ? 'hsl(var(--primary))' : 'currentColor' }} />
                                    
                                    {/* AGENT -> TOOLS */}
                                    <motion.path d={`M ${NODE_AGENT.x - 10} ${NODE_AGENT.y + 25} L ${NODE_AGENT.x - 10} ${NODE_TOOLS.y - 25}`} fill="none" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrowhead)" animate={{ opacity: currentStepData.graph.decision_edge ? 1 : 0.2, stroke: currentStepData.execution.decision_edge ? 'hsl(var(--primary))' : 'currentColor' }} />
                                    
                                    {/* TOOLS -> AGENT */}
                                    <motion.path d={`M ${NODE_AGENT.x + 10} ${NODE_TOOLS.y - 25} L ${NODE_AGENT.x + 10} ${NODE_AGENT.y + 25}`} fill="none" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrowhead)" animate={{ opacity: currentStepData.graph.loop_edge ? 1 : 0.2, stroke: currentStepData.execution.loop_edge ? 'hsl(var(--primary))' : 'currentColor' }} />
                                    
                                    {/* AGENT -> END */}
                                    <motion.path d={`M ${NODE_AGENT.x + 40} ${NODE_AGENT.y + 10} L ${NODE_END.x - 40} ${NODE_END.y - 10}`} fill="none" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrowhead)" animate={{ opacity: currentStepData.graph.decision_edge ? 1 : 0.2, stroke: currentStepData.execution.end ? 'hsl(var(--green-500))' : 'currentColor' }} />
                                </g>

                                {/* Node Rectangles */}
                                <g>
                                    <NodeRect x={NODE_START.x} y={NODE_START.y} label="START" visible={currentStepData.graph.start} active={currentStepData.execution.start} />
                                    <NodeRect x={NODE_AGENT.x} y={NODE_AGENT.y} label="agent" visible={currentStepData.graph.agent} active={currentStepData.execution.agent} />
                                    <NodeRect x={NODE_TOOLS.y && NODE_TOOLS.x} y={NODE_TOOLS.y} label="tools" visible={currentStepData.graph.tools} active={currentStepData.execution.tools} />
                                    <NodeRect x={NODE_END.x} y={NODE_END.y} label="END" visible={currentStepData.graph.decision_edge} active={currentStepData.execution.end} />
                                </g>
                            </svg>
                        </div>

                        {/* Trace and State */}
                        <div className="h-48 grid grid-cols-2 gap-4">
                            <div className="bg-background/40 p-3 rounded-lg border flex flex-col">
                                <h4 className="text-[10px] font-bold uppercase mb-2 flex items-center gap-1 text-primary"><Info size={12}/> Trace</h4>
                                <ScrollArea className="flex-grow">
                                    {currentStepData.trace.map((t, i) => (
                                        <div key={i} className="text-[10px] mb-1 p-1 bg-primary/5 rounded border-l-2 border-primary">{t.content}</div>
                                    ))}
                                </ScrollArea>
                            </div>
                            <div className="bg-background/40 p-3 rounded-lg border flex flex-col">
                                <h4 className="text-[10px] font-bold uppercase mb-2 flex items-center gap-1 text-primary"><Database size={12}/> State</h4>
                                <div className="text-[10px] space-y-1">
                                    <div className="flex justify-between"><span>LLM Calls:</span> <span className="text-primary">{currentStepData.state.llm_calls}</span></div>
                                    <div className="border-t pt-1 mt-1 font-mono opacity-70">messages: [...]</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center gap-4 mt-6 pt-6 border-t border-primary/10">
                    <Button onClick={handleReset} variant="outline" disabled={step === 0}><RefreshCw className="mr-2"/>Reset</Button>
                    <Button onClick={handleNext} disabled={step === steps.length - 1} className="w-40">Next Step <ArrowRight className="ml-2"/></Button>
                </div>
            </CardContent>
        </Card>
    );
};

const NodeRect = ({ x, y, label, visible, active }: { x: number, y: number, label: string, visible?: boolean, active?: boolean }) => (
    <motion.g animate={{ opacity: visible ? 1 : 0.1 }}>
        <rect x={x - 40} y={y - 20} width="80" height="40" rx="8" className={cn("fill-card stroke-2 transition-colors", active ? "stroke-primary fill-primary/10" : "stroke-border")} />
        <text x={x} y={y + 5} textAnchor="middle" className={cn("text-[10px] font-bold transition-colors", active ? "fill-primary" : "fill-muted-foreground")}>{label}</text>
    </motion.g>
);
