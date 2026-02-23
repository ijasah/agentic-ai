"use client";

import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, RefreshCw, ArrowRight, BrainCircuit, Eye, Info, User, Wand2, CheckCircle, Sparkles, ArrowDown, CornerUpLeft, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const agentCode = `from typing import Annotated
from typing_extensions import TypedDict
from langchain_core.messages import AnyMessage
import operator
# 1. Import the graph building blocks
from langgraph.graph import StateGraph, START, END

# 2. Define the state (the agent's memory)
class AgentState(TypedDict):
    messages: Annotated[list[AnyMessage], operator.add]
    llm_calls: int

# 3. Define the nodes (the agent's "skills")
def llm_call(state: AgentState):
    """LLM decides whether to call a tool or not"""
    # ... implementation calls model ...
    return {"messages": [response], "llm_calls": state.get('llm_calls', 0) + 1}

def tool_node(state: AgentState):
    """This node runs the tools the LLM decided to call."""
    # ... implementation runs tools ...
    return {"messages": tool_outputs}

# 4. Define the decision logic
def should_continue(state: AgentState):
    """Decides if we should loop to tools or stop"""
    if state["messages"][-1].tool_calls:
        return "tools"
    return "end"

# 5. Build and compile the graph
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

# 6. Run the agent
result = app.invoke({"messages": [("user", "What is 3 + 4?")]})
`;

const steps = [
    { name: 'Ready', highlight: { start: -1, end: -1 }, explanation: 'Click "Start" to see how we build and run an agent graph.', graph: {}, execution: {}, state: { messages: [], llm_calls: 0 }, trace: [] },
    { name: 'Define State', highlight: { start: 7, end: 10 }, explanation: 'Every agent needs memory. The "State" is a dictionary that holds everything the agent remembers, like the list of messages.', graph: {}, execution: {}, state: { messages: [], llm_calls: 0 }, trace: [] },
    { name: 'Add Nodes', highlight: { start: 33, end: 34 }, explanation: 'Nodes are the "steps" in your process. We add an "agent" node for thinking and a "tools" node for doing work.', graph: { init: true, agent: true, tools: true }, execution: {}, state: { messages: [], llm_calls: 0 }, trace: [] },
    { name: 'Connect Start', highlight: { start: 36, end: 36 }, explanation: 'We tell LangGraph where to begin. Here, we start by going directly to the "agent" node.', graph: { init: true, agent: true, tools: true, start: true }, execution: {}, state: { messages: [], llm_calls: 0 }, trace: [] },
    { name: 'Decision Edge', highlight: { start: 37, end: 41 }, explanation: 'The "Conditional Edge" is the agent\'s brain. It checks: "Does the model want to use a tool?" If yes, go to tools. If no, we are finished (END).', graph: { init: true, agent: true, tools: true, start: true, conditional: true }, execution: {}, state: { messages: [], llm_calls: 0 }, trace: [] },
    { name: 'Loop Edge', highlight: { start: 42, end: 42 }, explanation: 'After the tools run, we MUST go back to the agent. This allows the agent to see the tool\'s result and decide what to do next.', graph: { init: true, agent: true, tools: true, start: true, conditional: true, loop: true }, execution: {}, state: { messages: [], llm_calls: 0 }, trace: [] },
    { name: 'Compile', highlight: { start: 44, end: 44 }, explanation: 'We "compile" the graph. This turns our map into a real, runnable application.', graph: { init: true, agent: true, tools: true, start: true, conditional: true, loop: true }, execution: {}, state: { messages: [], llm_calls: 0 }, trace: [{ type: 'Info', content: 'Graph compiled. Ready to run!' }] },
    { name: 'Invoke', highlight: { start: 47, end: 47 }, explanation: 'We send our first message: "What is 3 + 4?". The runtime starts at the START node.', graph: { init: true, agent: true, tools: true, start: true, conditional: true, loop: true }, execution: { start: true }, state: { messages: [{ role: 'user', content: 'What is 3 + 4?' }], llm_calls: 0 }, trace: [{ type: 'Info', content: 'Input received: "What is 3 + 4?"' }] },
    { name: 'Agent Thinking', highlight: { start: 13, end: 16 }, explanation: 'The agent node runs. The LLM decides it needs the "add" tool to answer the user.', graph: { init: true, agent: true, tools: true, start: true, conditional: true, loop: true }, execution: { agent: true, start: true }, state: { messages: [{ role: 'user', content: 'What is 3 + 4?' }], llm_calls: 1 }, trace: [{ type: 'Info', content: 'Input received: "What is 3 + 4?"' }, { type: 'Thought', content: 'I need to add 3 and 4. I will call the "add" tool.' }] },
    { name: 'Route to Tools', highlight: { start: 25, end: 29 }, explanation: 'The conditional edge sees the tool call and routes the flow down to the "tools" node.', graph: { init: true, agent: true, tools: true, start: true, conditional: true, loop: true }, execution: { agentToTools: true, agent: true, start: true }, state: { messages: [{ role: 'user', content: 'What is 3 + 4?' }, { role: 'ai', tool_calls: [{ name: 'add', args: { a: 3, b: 4 } }] }], llm_calls: 1 }, trace: [{ type: 'Info', content: 'Input received: "What is 3 + 4?"' }, { type: 'Thought', content: 'I need to add 3 and 4. I will call the "add" tool.' }] },
    { name: 'Tool Execution', highlight: { start: 18, end: 21 }, explanation: 'The tools node runs. It calculates 3 + 4 = 7 and adds this "observation" to the state.', graph: { init: true, agent: true, tools: true, start: true, conditional: true, loop: true }, execution: { tools: true, agentToTools: true, agent: true, start: true }, state: { messages: [{ role: 'user', content: 'What is 3 + 4?' }, { role: 'ai', tool_calls: [{ name: 'add', args: { a: 3, b: 4 } }] }, { role: 'tool', content: '7', tool_call_id: 'tc_1' }], llm_calls: 1 }, trace: [{ type: 'Info', content: 'Input received: "What is 3 + 4?"' }, { type: 'Thought', content: 'I need to add 3 and 4. I will call the "add" tool.' }, { type: 'Action', content: 'Running tool "add" with (3, 4)' }, { type: 'Observation', content: 'Tool Result: 7' }] },
    { name: 'Loop Back', highlight: { start: 42, end: 42 }, explanation: 'We loop back to the agent. Now the agent knows the answer is 7.', graph: { init: true, agent: true, tools: true, start: true, conditional: true, loop: true }, execution: { agent: true, loop: true, tools: true, agentToTools: true, start: true }, state: { messages: [{ role: 'user', content: 'What is 3 + 4?' }, { role: 'ai', tool_calls: [{ name: 'add', args: { a: 3, b: 4 } }] }, { role: 'tool', content: '7', tool_call_id: 'tc_1' }], llm_calls: 2 }, trace: [{ type: 'Info', content: 'Input received: "What is 3 + 4?"' }, { type: 'Thought', content: 'I need to add 3 and 4. I will call the "add" tool.' }, { type: 'Action', content: 'Running tool "add" with (3, 4)' }, { type: 'Observation', content: 'Tool Result: 7' }, { type: 'Thought', content: 'The sum is 7. I am ready to answer.' }] },
    { name: 'Finish', highlight: { start: 25, end: 29 }, explanation: 'The agent provides the final answer. The decision edge sees no more tool calls and routes to END.', graph: { init: true, agent: true, tools: true, start: true, conditional: true, loop: true }, execution: { agentToEnd: true, agent:true, loop: true, tools: true, agentToTools: true, start: true }, state: { messages: [{ role: 'user', content: 'What is 3 + 4?' }, { role: 'ai', tool_calls: [{ name: 'add', args: { a: 3, b: 4 } }] }, { role: 'tool', content: '7', tool_call_id: 'tc_1' }, { role: 'ai', content: 'The sum is 7.' }], llm_calls: 2 }, trace: [{ type: 'Info', content: 'Input received: "What is 3 + 4?"' }, { type: 'Thought', content: 'I need to add 3 and 4. I will call the "add" tool.' }, { type: 'Action', content: 'Running tool "add" with (3, 4)' }, { type: 'Observation', content: 'Tool Result: 7' }, { type: 'Thought', content: 'The sum is 7. I am ready to answer.' }, { type: 'Final Answer', content: 'The total sum is 7.' }] },
];

const GraphNode = ({ label, visible, executing, isEnd, className, style }: { label: string, visible?: boolean, executing?: boolean, isEnd?: boolean, className?: string, style?: React.CSSProperties }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
            opacity: visible ? 1 : 0, 
            scale: visible ? 1 : 0.8,
            borderColor: executing ? 'hsl(var(--primary))' : 'hsl(var(--border))',
            backgroundColor: executing ? 'hsla(var(--primary), 0.15)' : 'hsl(var(--card))',
            boxShadow: executing ? '0 0 15px hsla(var(--primary), 0.3)' : 'none'
        }}
        style={style}
        className={cn(
            "absolute border-2 rounded-lg px-4 py-2 text-sm font-bold transition-all duration-300 w-28 text-center -translate-x-1/2 -translate-y-1/2",
            isEnd && executing && "border-green-500 bg-green-500/10 shadow-[0_0_15px_rgba(34,197,94,0.3)]",
            className
        )}
    >
        {label}
    </motion.div>
);

const StateMessage = ({ msg }: { msg: any }) => {
    const isUser = msg.role === 'user';
    const isAI = msg.role === 'ai';
    const isTool = msg.role === 'tool';

    return (
        <div className={cn(
            "p-3 rounded-lg border text-xs mb-2",
            isUser && "bg-blue-500/10 border-blue-500/30",
            isAI && "bg-purple-500/10 border-purple-500/30",
            isTool && "bg-amber-500/10 border-amber-500/30",
        )}>
            <div className="flex items-center gap-2 font-bold uppercase mb-1">
                {isUser && <User size={14} className="text-blue-400" />}
                {isAI && <Sparkles size={14} className="text-purple-400" />}
                {isTool && <Wand2 size={14} className="text-amber-400" />}
                <span className={cn(
                    isUser && "text-blue-400",
                    isAI && "text-purple-400",
                    isTool && "text-amber-400",
                )}>{msg.role}</span>
            </div>
            {msg.content && <p>{msg.content}</p>}
            {msg.tool_calls && (
                <div className="mt-2 p-2 bg-black/20 rounded border border-dashed border-purple-500/30">
                    <p className="font-semibold text-purple-300">Tool Call: {msg.tool_calls[0].name}</p>
                    <p className="text-[10px] text-muted-foreground">Args: {JSON.stringify(msg.tool_calls[0].args)}</p>
                </div>
            )}
        </div>
    );
};

export const LangGraphQuickstartSimulator = () => {
    const [step, setStep] = useState(0);
    const codeScrollRef = useRef<HTMLDivElement>(null);
    const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

    const handleNext = () => setStep(s => Math.min(s + 1, steps.length - 1));
    const handleReset = () => setStep(0);

    const currentStepData = steps[step];
    const codeLines = agentCode.split('\n');

    useEffect(() => {
        const highlightedLine = steps[step]?.highlight.start;
        if (highlightedLine > 0 && lineRefs.current[highlightedLine]) {
            const scrollAreaViewport = codeScrollRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
            const lineElement = lineRefs.current[highlightedLine];
            if(scrollAreaViewport && lineElement) {
                const viewportHeight = scrollAreaViewport.clientHeight;
                const lineTop = lineElement.offsetTop;
                const lineHeight = lineElement.offsetHeight;
                scrollAreaViewport.scrollTop = lineTop - (viewportHeight / 2) + (lineHeight / 2);
            }
        }
    }, [step]);

    return (
        <Card className="bg-muted/30 shadow-inner w-full overflow-hidden border-2 border-primary/10">
            <CardHeader className="text-center bg-primary/5 pb-6">
                 <CardTitle className="text-2xl font-bold">Graph API: Build & Execution</CardTitle>
                 <CardDescription className="text-lg max-w-2xl mx-auto text-foreground/80 mt-2 h-16 flex items-center justify-center">
                   {currentStepData.explanation}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                 <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Code Panel */}
                    <div className="bg-black/40 rounded-xl border border-primary/20 p-2 text-xs font-mono h-[550px] shadow-2xl">
                        <ScrollArea className="h-full" ref={codeScrollRef}>
                            <div key={step}>
                                <pre className="p-4">
                                    {codeLines.map((line, i) => {
                                        const isHighlighted = currentStepData.highlight.start <= i + 1 && currentStepData.highlight.end >= i + 1;
                                        return (
                                            <div
                                                key={i}
                                                ref={el => lineRefs.current[i + 1] = el}
                                                className={cn(
                                                    "px-2 py-0.5 transition-all duration-500 rounded flex gap-4",
                                                    isHighlighted ? 'bg-primary/25 border-l-2 border-primary scale-[1.02] translate-x-1' : 'opacity-60 grayscale-[0.5]'
                                                )}
                                            >
                                                <span className="text-right text-muted-foreground/40 w-6 shrink-0">{i + 1}</span>
                                                <span className={cn(isHighlighted ? "text-white" : "text-gray-400")}>{line || ' '}</span>
                                            </div>
                                        );
                                    })}
                                </pre>
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Visualization Panel */}
                    <div className="flex flex-col gap-6">
                        {/* Graph Visualization */}
                        <div className="relative h-80 bg-background/50 rounded-xl border-2 border-dashed border-primary/20 flex items-center justify-center p-4 overflow-hidden">
                            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="0 0 400 300">
                                <defs>
                                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orientation="auto">
                                        <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
                                    </marker>
                                </defs>
                                <g className="text-muted-foreground/30 transition-all duration-500">
                                    {/* START (50, 150) -> AGENT (150, 100) */}
                                    <motion.path 
                                        d="M 100 150 L 150 100" 
                                        fill="none" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrowhead)"
                                        animate={{ stroke: currentStepData.execution.start ? 'hsl(var(--primary))' : 'currentColor', opacity: currentStepData.graph.start ? 1 : 0 }}
                                    />
                                    {/* AGENT (250, 100) -> END (350, 150) */}
                                    <motion.path 
                                        d="M 250 100 L 300 150" 
                                        fill="none" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrowhead)"
                                        animate={{ stroke: currentStepData.execution.agentToEnd ? 'hsl(var(--green-500))' : 'currentColor', opacity: currentStepData.graph.conditional ? 1 : 0 }}
                                    />
                                    {/* AGENT (200, 125) -> TOOLS (200, 225) (Down) */}
                                    <motion.path 
                                        d="M 190 125 L 190 225" 
                                        fill="none" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrowhead)"
                                        animate={{ stroke: currentStepData.execution.agentToTools ? 'hsl(var(--primary))' : 'currentColor', opacity: currentStepData.graph.tools ? 1 : 0 }}
                                    />
                                    {/* TOOLS (200, 225) -> AGENT (200, 125) (Loop Up) */}
                                    <motion.path 
                                        d="M 210 225 L 210 125" 
                                        fill="none" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrowhead)"
                                        animate={{ stroke: currentStepData.execution.loop ? 'hsl(var(--primary))' : 'currentColor', opacity: currentStepData.graph.loop ? 1 : 0 }}
                                    />
                                </g>
                                
                                {/* Transition Labels */}
                                <AnimatePresence>
                                    {currentStepData.graph.conditional && (
                                        <motion.text initial={{opacity:0}} animate={{opacity:1}} x="280" y="130" textAnchor="middle" className="fill-muted-foreground text-[10px] font-bold uppercase">Finish</motion.text>
                                    )}
                                    {currentStepData.graph.tools && (
                                        <motion.text initial={{opacity:0}} animate={{opacity:1}} x="155" y="180" textAnchor="middle" className="fill-muted-foreground text-[10px] font-bold uppercase">Use Tool</motion.text>
                                    )}
                                </AnimatePresence>
                            </svg>

                            {/* Node Placements */}
                            <GraphNode label="START" style={{ left: '15%', top: '50%' }} visible={currentStepData.graph.start} executing={currentStepData.execution.start}/>
                            <GraphNode label="agent" style={{ left: '50%', top: '33%' }} visible={currentStepData.graph.agent} executing={currentStepData.execution.agent} />
                            <GraphNode label="tools" style={{ left: '50%', top: '75%' }} visible={currentStepData.graph.tools} executing={currentStepData.execution.tools} />
                            <GraphNode label="END" style={{ left: '85%', top: '50%' }} visible={currentStepData.graph.conditional} executing={currentStepData.execution.agentToEnd} isEnd/>
                        </div>

                        {/* Logs and State */}
                         <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="h-[280px] flex flex-col bg-background/40 rounded-xl border p-4">
                                <h3 className="font-bold text-sm mb-3 flex items-center gap-2 text-primary uppercase tracking-wider">
                                    <Info size={16}/> Execution Trace
                                </h3>
                                <ScrollArea className="flex-grow pr-2">
                                    <AnimatePresence mode="popLayout">
                                        {currentStepData.trace.map((item, i) => (
                                            <motion.div
                                                key={item.content + i} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                                className={cn(
                                                    "p-3 border-l-4 rounded-r-md mb-3 text-xs shadow-sm",
                                                    item.type === 'Info' && 'border-gray-400 bg-gray-500/10',
                                                    item.type === 'Thought' && 'border-purple-400 bg-purple-500/10',
                                                    item.type === 'Action' && 'border-blue-400 bg-blue-500/10',
                                                    item.type === 'Observation' && 'border-amber-400 bg-amber-500/10',
                                                    item.type === 'Final Answer' && 'border-green-400 bg-green-500/10',
                                                )}
                                            >
                                                <p className="font-bold mb-1 flex items-center gap-2">
                                                    {item.type === 'Thought' && <BrainCircuit size={14} className="text-purple-400" />}
                                                    {item.type === 'Action' && <Wand2 size={14} className="text-blue-400" />}
                                                    {item.type === 'Observation' && <Eye size={14} className="text-amber-400" />}
                                                    {item.type === 'Final Answer' && <CheckCircle size={14} className="text-green-400" />}
                                                    {item.type}
                                                </p>
                                                <p className="opacity-90">{item.content}</p>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </ScrollArea>
                            </div>
                            <div className="h-[280px] flex flex-col bg-background/40 rounded-xl border p-4">
                                <h3 className="font-bold text-sm mb-3 flex items-center gap-2 text-primary uppercase tracking-wider">
                                    <Database size={16}/> Graph State
                                </h3>
                                <ScrollArea className="flex-grow pr-2">
                                    <div className="flex justify-between items-center bg-primary/10 border-2 border-primary/20 rounded-lg p-3 mb-4">
                                        <span className="font-bold text-xs uppercase text-primary">llm_calls</span>
                                        <Badge variant="secondary" className="text-sm font-mono px-3 py-1 bg-background">{currentStepData.state.llm_calls}</Badge>
                                    </div>
                                    <h4 className="font-bold text-[10px] text-muted-foreground uppercase mb-2 tracking-widest">Message History</h4>
                                    <AnimatePresence mode="popLayout">
                                        {currentStepData.state.messages.map((msg, i) => (
                                            <motion.div key={i} layout initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
                                                <StateMessage msg={msg} />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </ScrollArea>
                            </div>
                         </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex justify-center items-center gap-6 mt-6 pt-6 border-t-2 border-primary/10">
                     <Button onClick={handleReset} variant="outline" size="lg" className="w-32 border-2" disabled={step === 0}>
                        <RefreshCw className="mr-2 h-5 w-5"/> Reset
                    </Button>
                    <Button onClick={handleNext} size="lg" className="w-48 text-lg font-bold shadow-xl" disabled={step >= steps.length - 1}>
                        {step === 0 ? 'Start Building' : 'Next Step'} <ArrowRight className="ml-2 h-6 w-6"/>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
