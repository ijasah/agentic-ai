"use client";
import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

export function CodeBlock({ code, className, style }: { code: string; className?: string, style?: React.CSSProperties }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={style} className={cn("relative rounded-lg bg-black/50 p-4 my-2 text-sm group border border-white/5", className)}>
       <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 h-7 w-7 text-white/30 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    onClick={handleCopy}
                >
                    {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>{copied ? "Copied!" : "Copy code"}</p>
            </TooltipContent>
        </Tooltip>
       </TooltipProvider>
      <pre className="overflow-x-auto scrollbar-hide">
        <code className="font-mono text-white/90 whitespace-pre">
          {code}
        </code>
      </pre>
    </div>
  );
}
