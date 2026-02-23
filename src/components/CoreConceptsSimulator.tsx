"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Database, Clock, ArrowRight, Save, History, Zap, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export const CoreConceptsSimulator = () => {
    const [activeTab, setActiveTab] = useState('runtime');

    const Node = ({ label, active }: { label: string, active?: boolean }) => (
        <motion.div 
            animate={{ 
                scale: active ? 1.1 : 1,
                borderColor: active ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                backgroundColor: active ? 'hsla(var(--primary), 0.1)' : 'hsl(var(--background))'
            }}
            className="border-2 rounded-lg p-3 text-xs font-bold w-24 text-center shadow-sm"
        >
            {label}
        </motion.div>
    );

    return (
        <Card className="bg-muted/30 border-2 overflow-hidden">
            <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-3 w-full mb-8">
                        <TabsTrigger value="runtime" className="gap-2"><Zap size={16}/> Runtime</TabsTrigger>
                        <TabsTrigger value="state" className="gap-2"><Database size={16}/> Stateful</TabsTrigger>
                        <TabsTrigger value="long-running" className="gap-2"><Clock size={16}/> Long-Running</TabsTrigger>
                    </TabsList>

                    <div className="h-64 relative bg-background/50 rounded-xl border-2 border-dashed border-primary/10 flex flex-col items-center justify-center">
                        <AnimatePresence mode="wait">
                            {activeTab === 'runtime' && (
                                <motion.div 
                                    key="runtime"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex flex-col items-center gap-4"
                                >
                                    <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">The Engine in Action</p>
                                    <div className="flex items-center gap-4">
                                        <Node label="Step 1" active={true} />
                                        <motion.div
                                            animate={{ x: [0, 20, 0] }}
                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                        >
                                            <ArrowRight className="text-primary" />
                                        </motion.div>
                                        <Node label="Step 2" />
                                        <ArrowRight className="text-muted-foreground/30" />
                                        <Node label="Step 3" />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-4 text-center max-w-sm">
                                        The Runtime is like a **GPS** for your agent. It knows exactly which node to trigger next and ensures data flows correctly.
                                    </p>
                                </motion.div>
                            )}

                            {activeTab === 'state' && (
                                <motion.div 
                                    key="state"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex flex-col items-center gap-4"
                                >
                                    <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">The Shared Memory</p>
                                    <div className="flex gap-8 items-start">
                                        <div className="flex flex-col gap-2">
                                            <Node label="Thinking" active />
                                            <Node label="Acting" />
                                        </div>
                                        <div className="w-px h-24 bg-border" />
                                        <Card className="p-4 bg-primary/5 border-primary/20 w-48 shadow-lg">
                                            <h4 className="text-[10px] font-bold text-primary uppercase mb-2">State Object</h4>
                                            <div className="space-y-1 font-mono text-[10px]">
                                                <div className="flex justify-between"><span>history:</span> <span className="text-green-400">[...]</span></div>
                                                <motion.div 
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
                                                    className="flex justify-between text-yellow-400"
                                                >
                                                    <span>new_fact:</span> <span>"Saved!"</span>
                                                </motion.div>
                                            </div>
                                        </Card>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-4 text-center max-w-sm">
                                        "Stateful" means the agent has a **Notebook**. Every node reads from it and writes updates back to it.
                                    </p>
                                </motion.div>
                            )}

                            {activeTab === 'long-running' && (
                                <motion.div 
                                    key="long-running"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex flex-col items-center gap-4"
                                >
                                    <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">Wait & Resume</p>
                                    <div className="flex items-center gap-6">
                                        <div className="flex flex-col items-center gap-1">
                                            <Bot className="text-primary" />
                                            <span className="text-[10px] font-bold">Agent Paused</span>
                                        </div>
                                        <div className="flex flex-col items-center relative">
                                            <Database className="text-muted-foreground/50" size={32} />
                                            <motion.div 
                                                animate={{ y: [-10, 0, -10], opacity: [0, 1, 0] }}
                                                transition={{ repeat: Infinity, duration: 2 }}
                                                className="absolute -top-4"
                                            >
                                                <Save size={16} className="text-green-500" />
                                            </motion.div>
                                            <span className="text-[10px] mt-1 font-bold">Checkpoint</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1 opacity-40">
                                            <History size={24} />
                                            <span className="text-[10px] font-bold">Resume Tomorrow</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-4 text-center max-w-sm">
                                        Long-running agents can **Freeze** their progress. You can turn off the computer, come back in 3 days, and it resumes exactly where it left off.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </Tabs>
            </CardContent>
        </Card>
    );
};
