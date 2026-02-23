
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Database, Clock, ArrowRight, Save, History, Zap, Server } from 'lucide-react';
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
            className="border-2 rounded-lg p-3 text-xs font-bold w-24 text-center shadow-sm z-10"
        >
            {label}
        </motion.div>
    );

    return (
        <Card className="bg-muted/30 border-2 overflow-hidden shadow-inner mt-4">
            <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-3 w-full mb-8">
                        <TabsTrigger value="runtime" className="gap-2"><Zap size={16}/> The Engine</TabsTrigger>
                        <TabsTrigger value="state" className="gap-2"><Database size={16}/> The Memory</TabsTrigger>
                        <TabsTrigger value="long-running" className="gap-2"><Clock size={16}/> The Pause</TabsTrigger>
                    </TabsList>

                    <div className="h-72 relative bg-background/50 rounded-xl border-2 border-dashed border-primary/10 flex flex-col items-center justify-center overflow-hidden">
                        <AnimatePresence mode="wait">
                            {activeTab === 'runtime' && (
                                <motion.div 
                                    key="runtime"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex flex-col items-center gap-4 w-full h-full justify-center"
                                >
                                    <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">Driving the Workflow</p>
                                    <div className="flex items-center gap-6 relative">
                                        <Node label="Think" active={true} />
                                        <div className="relative w-16 h-0.5 bg-muted">
                                            <motion.div 
                                                animate={{ x: [0, 64, 0], opacity: [0, 1, 0] }}
                                                transition={{ repeat: Infinity, duration: 2 }}
                                                className="absolute -top-1 w-2 h-2 rounded-full bg-primary"
                                            />
                                        </div>
                                        <Node label="Act" />
                                        <div className="relative w-16 h-0.5 bg-muted">
                                            <ArrowRight className="absolute -top-2 left-1/2 -translate-x-1/2 text-muted-foreground/30" />
                                        </div>
                                        <Node label="Result" />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-6 text-center max-w-sm px-4">
                                        The Runtime acts as the manager, moving data from step to step automatically based on your graph's logic.
                                    </p>
                                </motion.div>
                            )}

                            {activeTab === 'state' && (
                                <motion.div 
                                    key="state"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex flex-col items-center gap-4 w-full h-full justify-center"
                                >
                                    <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">The Shared Notebook</p>
                                    <div className="flex gap-12 items-center">
                                        <div className="flex flex-col gap-4">
                                            <Node label="Step 1" active />
                                            <Node label="Step 2" />
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <motion.div 
                                                animate={{ scale: [1, 1.05, 1] }}
                                                transition={{ repeat: Infinity, duration: 3 }}
                                                className="p-6 bg-primary/10 border-2 border-primary rounded-2xl shadow-xl w-56 relative"
                                            >
                                                <div className="absolute -top-3 left-4 px-2 bg-primary text-primary-foreground text-[9px] font-bold rounded">LIVE STATE</div>
                                                <div className="space-y-2 font-mono text-[10px]">
                                                    <div className="flex justify-between items-center text-muted-foreground">
                                                        <span>user_id:</span> <span className="text-foreground">"42"</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-muted-foreground">
                                                        <span>status:</span> <span className="text-green-400 font-bold">"processing"</span>
                                                    </div>
                                                    <motion.div 
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
                                                        className="flex justify-between items-center text-yellow-400 font-bold"
                                                    >
                                                        <span>memory:</span> <span>[saved!]</span>
                                                    </motion.div>
                                                </div>
                                            </motion.div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-6 text-center max-w-sm px-4">
                                        The State is a central object that every node can read from and write to, allowing the agent to "remember" its work.
                                    </p>
                                </motion.div>
                            )}

                            {activeTab === 'long-running' && (
                                <motion.div 
                                    key="long-running"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex flex-col items-center gap-4 w-full h-full justify-center"
                                >
                                    <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">Hibernate & Resume</p>
                                    <div className="flex items-center gap-8 px-8">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="p-3 bg-muted rounded-lg"><Bot className="text-primary" /></div>
                                            <span className="text-[10px] font-bold">Session Started</span>
                                        </div>
                                        <div className="flex flex-col items-center relative gap-2">
                                            <div className="p-4 bg-primary/10 border-2 border-primary border-dashed rounded-full">
                                                <Database className="text-primary" size={24} />
                                            </div>
                                            <motion.div 
                                                animate={{ y: [-15, 0, -15], opacity: [0, 1, 0] }}
                                                transition={{ repeat: Infinity, duration: 2.5 }}
                                                className="absolute top-0"
                                            >
                                                <Save size={16} className="text-green-500" />
                                            </motion.div>
                                            <span className="text-[10px] font-bold">Checkpointing...</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="p-3 bg-muted rounded-lg opacity-50"><Server size={24} /></div>
                                            <span className="text-[10px] font-bold opacity-50">Resume Later</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-6 text-center max-w-sm px-4">
                                        Because the state is saved to a database, you can close the browser and come back days later to resume exactly where you left off.
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
