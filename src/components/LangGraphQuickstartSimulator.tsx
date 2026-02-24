"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, RefreshCw, ArrowRight, Info, Database, Sparkles } from 'lucide-react';
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

# 2. Define the nodes (Steps)
def llm_call(state: AgentState):
    """Thinking node"""
    return {"messages": [("ai", "Add 3+4")], "llm_calls": 1}

def tool_node(state: AgentState):
    """Action node"""
    return {"messages": [("tool", "7")]}

# 3. Build the graph
workflow = StateGraph(AgentState)
workflow.add_node("agent", llm_call)
workflow.add_node("tools", tool_node)

workflow.add_edge(START, "agent")
workflow.add_conditional_edges(
    "agent",
    should_continue, 
    {"tools": "tools", "end": END}
)
workflow.add_edge("tools", "agent")

app = workflow.compile()

# 4. Run the agent
result = app.invoke({"messages": [("user", "3+4?")]})`;

const steps = [
    { name: 'Ready', highlight: { start: -1, end: -1 }, explanation: 'Start to see how we build and run an AI agent graph.', graph: { start: true }, execution: {}, state: { messages: [], llm_calls: 0 }, trace: [] },
    { name: 'Imports & State', highlight: { start: 1, end: 9 }, explanation: 'First, import the tools and define "State"—the shared memory.', graph: { start: true }, execution: {}, state: { messages: [], llm_calls: 0 }, trace: [] },
    { name: 'Define Nodes', highlight: { start: 12, end: 18 }, explanation: 'Define functions for "Thinking" (agent) and "Actions" (tools).', graph: { start: true, agent: true, tools: true }, execution: {}, state: { messages: [], llm_calls: 0 }, trace: [] },
    { name: 'Add Nodes', highlight: { start: 21, end: 23 }, explanation: 'Add these skills to the graph as nodes.', graph: { start: true, agent: true, tools: true }, execution: {}, state: { messages: [], llm_calls: 0 }, trace: [] },
    { name: 'Wiring START', highlight: { start: 25, end: 25 }, explanation: 'Connect START to our agent thinking node.', graph: { start: true, agent: true, tools: true, start_edge: true }, execution: {}, state: { messages: [], llm_calls: 0 }, trace: [] },
    { name: 'Logic Edges', highlight: { start: 26, end: 30 }, explanation: 'Define logic: "Should I use tools or finish?"', graph: { start: true, agent: true, tools: true, start_edge: true, decision_edge: true }, execution: {}, state: { messages: [], llm_calls: 0 }, trace: [] },
    { name: 'The Loop', highlight: { start: 31, end: 31 }, explanation: 'After tools are done, loop back to the agent to rethink.', graph: { start: true, agent: true, tools: true, start_edge: true, decision_edge: true, loop_edge: true }, execution: {}, state: { messages: [], llm_calls: 0 }, trace: [] },
    { name: 'The Invoke', highlight: { start: 36, end: 37 }, explanation: 'Finally, run the agent using .invoke().', graph: { start: true, agent: true, tools: true, start_edge: true, decision_edge: true, loop_edge: true }, execution: { start: true }, state: { messages: [{ role: 'user', content: '3+4?' }], llm_calls: 0 }, trace: [{ content: 'Engine started.' }] },
    { name: 'AI Thinking', highlight: { start: 12, end: 14 }, explanation: 'AI realizes it needs a calculator tool.', graph: { start: true, agent: true, tools: true, start_edge: true, decision_edge: true, loop_edge: true }, execution: { agent: true, start_edge: true }, state: { messages: [{ role: 'user', content: '3+4?' }], llm_calls: 1 }, trace: [{ content: 'AI: Decided to call calculator.' }] },
    { name: 'Tool Run', highlight: { start: 16, end: 18 }, explanation: 'Calculator tool runs and updates the shared memory.', graph: { start: true, agent: true, tools: true, start_edge: true, decision_edge: true, loop_edge: true }, execution: { tools: true, decision_edge: true }, state: { messages: [{ role: 'user', content: '3+4?' }, { role: 'tool', content: '7' }], llm_calls: 1 }, trace: [{ content: 'Tool: Result is 7.' }] },
    { name: 'Finish', highlight: { start: 36, end: 37 }, explanation: 'AI rethink finds no more tools needed. Move to END.', graph: { start: true, agent: true, tools: true, start_edge: true, decision_edge: true, loop_edge: true }, execution: { end: true, agent: true, loop_edge: true }, state: { messages: [{ role: 'user', content: '3+4?' }, { role: 'ai', content: 'The result is 7.' }], llm_calls: 2 }, trace: [{ content: 'AI: The result is 7.' }] },
];

const NODES = {
    START: { x: 80, y: 100 },
    AGENT: { x: 250, y: 100 },
    TOOLS: { x: 250, y: 220 },
    END: { x: 420, y: 100 },
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
                 <CardDescription className="text-lg max-w-2xl mx-auto mt-2 h-16 flex items-center justify-center text-foreground font-medium">
                   {currentStepData.explanation}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
                 <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
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

                    <div className="flex flex-col gap-6 h-[550px]">
                        <div className="relative flex-grow bg-background/80 rounded-xl border-2 border-dashed border-primary/20 shadow-inner overflow-hidden">
                            <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 500 300`}>
                                <defs>
                                    <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orientation="auto">
                                        <polygon points="0 0, 8 3, 0 6" fill="currentColor" />
                                    </marker>
                                </defs>
                                
                                <g className="text-muted-foreground/40">
                                    {/* START to AGENT */}
                                    <motion.line 
                                        x1={NODES.START.x + 45} y1={NODES.START.y} x2={NODES.AGENT.x - 45} y2={NODES.AGENT.y} 
                                        stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrowhead)" 
                                        animate={{ opacity: currentStepData.graph.start_edge ? 1 : 0.2, stroke: currentStepData.execution.start_edge ? 'hsl(var(--primary))' : 'currentColor' }} 
                                    />
                                    
                                    {/* AGENT to TOOLS (Down) */}
                                    <motion.line 
                                        x1={NODES.AGENT.x} y1={NODES.AGENT.y + 25} x2={NODES.AGENT.x} y2={NODES.TOOLS.y - 25} 
                                        stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrowhead)" 
                                        animate={{ opacity: currentStepData.graph.decision_edge ? 1 : 0.2, stroke: currentStepData.execution.tools ? 'hsl(var(--primary))' : 'currentColor' }} 
                                    />
                                    
                                    {/* TOOLS back to AGENT (Curve) */}
                                    <motion.path 
                                        d={`M ${NODES.TOOLS.x + 45},${NODES.TOOLS.y} C ${NODES.TOOLS.x + 85},${NODES.TOOLS.y} ${NODES.TOOLS.x + 85},${NODES.AGENT.y} ${NODES.AGENT.x + 45},${NODES.AGENT.y}`}
                                        fill="none" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrowhead)" 
                                        animate={{ opacity: currentStepData.graph.loop_edge ? 1 : 0.2, stroke: currentStepData.execution.loop_edge ? 'hsl(var(--primary))' : 'currentColor' }} 
                                    />
                                    
                                    {/* AGENT to END */}
                                    <motion.line 
                                        x1={NODES.AGENT.x + 45} y1={NODES.AGENT.y} x2={NODES.END.x - 45} y2={NODES.END.y} 
                                        stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrowhead)" 
                                        animate={{ opacity: currentStepData.graph.decision_edge ? 1 : 0.2, stroke: currentStepData.execution.end ? 'hsl(var(--primary))' : 'currentColor' }} 
                                    />
                                </g>

                                <g>
                                    <NodeCard x={NODES.START.x} y={NODES.START.y} label="START" visible={currentStepData.graph.start} active={currentStepData.execution.start} />
                                    <NodeCard x={NODES.AGENT.x} y={NODES.AGENT.y} label="AGENT" visible={currentStepData.graph.agent} active={currentStepData.execution.agent} />
                                    <NodeCard x={NODES.TOOLS.x} y={NODES.TOOLS.y} label="TOOLS" visible={currentStepData.graph.tools} active={currentStepData.execution.tools} />
                                    <NodeCard x={NODES.END.x} y={NODES.END.y} label="END" visible={currentStepData.graph.decision_edge} active={currentStepData.execution.end} />
                                </g>
                            </svg>
                        </div>

                        <div className="h-48 grid grid-cols-2 gap-4">
                            <div className="bg-background/60 p-4 rounded-lg border flex flex-col shadow-inner">
                                <h4 className="text-[10px] font-bold uppercase mb-3 flex items-center gap-2 text-primary tracking-widest">
                                    <Info size={12}/> Console Trace
                                </h4>
                                <ScrollArea className="flex-grow">
                                    <AnimatePresence>
                                        {currentStepData.trace.map((t, i) => (
                                            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] mb-2 p-2 bg-primary/5 rounded border-l-2 border-primary font-mono">{t.content}</motion.div>
                                        ))}
                                    </AnimatePresence>
                                </ScrollArea>
                            </div>
                            <div className="bg-background/60 p-4 rounded-lg border flex flex-col shadow-inner">
                                <h4 className="text-[10px] font-bold uppercase mb-3 flex items-center gap-2 text-primary tracking-widest">
                                    <Database size={12}/> Memory (State)
                                </h4>
                                <div className="text-[11px] space-y-3 font-mono">
                                    <div className="flex justify-between items-center border-b border-muted pb-1">
                                        <span className="text-muted-foreground">llm_calls:</span> 
                                        <span className="text-primary font-bold">{currentStepData.state.llm_calls}</span>
                                    </div>
                                    <div className="text-muted-foreground">msgs count: {currentStepData.state.messages.length}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center gap-4 mt-8 pt-6 border-t border-primary/10">
                    <Button onClick={handleReset} variant="outline" disabled={step === 0} className="w-32">Reset</Button>
                    <Button onClick={handleNext} disabled={step === steps.length - 1} className="w-48">Next Step <ArrowRight className="ml-2 h-4 w-4"/></Button>
                </div>
            </CardContent>
        </Card>
    );
};
