import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { SynonymPopover } from "./SynonymPopover";
import { LearningObjective, Highlight } from "@/types";
import { findPedagogicalTerms, generateId } from "@/utils/textAnalysis";
import { Undo2, FileText, Copy, CheckCircle, Edit3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ObjectiveDisplayProps {
  objective: LearningObjective;
  onObjectiveUpdate: (objective: LearningObjective) => void;
  index: number;
}

export function ObjectiveDisplay({ objective, onObjectiveUpdate, index }: ObjectiveDisplayProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const highlights = useMemo(() => 
    findPedagogicalTerms(objective.current), 
    [objective.current]
  );

  const handleWordReplace = (highlight: Highlight, newWord: string) => {
    const beforeWord = objective.current.slice(0, highlight.start);
    const afterWord = objective.current.slice(highlight.end);
    const newText = beforeWord + newWord + afterWord;

    const change = {
      id: generateId(),
      position: highlight.start,
      originalWord: highlight.word,
      newWord,
      timestamp: Date.now()
    };

    const updatedObjective: LearningObjective = {
      ...objective,
      current: newText,
      changes: [...objective.changes, change]
    };

    onObjectiveUpdate(updatedObjective);
    
    toast({
      title: "Word replaced",
      description: `"${highlight.word}" → "${newWord}"`,
    });
  };

  const handleTextChange = (newText: string) => {
    const updatedObjective: LearningObjective = {
      ...objective,
      current: newText
    };
    onObjectiveUpdate(updatedObjective);
  };

  const handleUndo = () => {
    if (objective.changes.length === 0) return;

    const lastChange = objective.changes[objective.changes.length - 1];
    const beforeChange = objective.current.slice(0, lastChange.position);
    const afterChange = objective.current.slice(lastChange.position + lastChange.newWord.length);
    const restoredText = beforeChange + lastChange.originalWord + afterChange;

    const updatedObjective: LearningObjective = {
      ...objective,
      current: restoredText,
      changes: objective.changes.slice(0, -1)
    };

    onObjectiveUpdate(updatedObjective);
    
    toast({
      title: "Change undone",
      description: `Restored "${lastChange.originalWord}"`,
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(objective.current);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied to clipboard",
        description: "Learning objective copied successfully",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const renderHighlightedText = () => {
    if (highlights.length === 0) {
      return <span>{objective.current}</span>;
    }

    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    highlights
      .sort((a, b) => a.start - b.start)
      .forEach((highlight, index) => {
        // Add text before highlight
        if (highlight.start > lastIndex) {
          elements.push(
            <span key={`text-${index}`}>
              {objective.current.slice(lastIndex, highlight.start)}
            </span>
          );
        }

        // Add highlighted word
        const highlightClass = highlight.type === 'blooms' 
          ? 'bg-bloom-highlight border-bloom-border hover:bg-bloom-highlight/80' 
          : highlight.type === 'fink'
          ? 'bg-fink-highlight border-fink-border hover:bg-fink-highlight/80'
          : 'bg-changed-highlight border-changed-border hover:bg-changed-highlight/80';

        elements.push(
          <SynonymPopover
            key={`highlight-${index}`}
            highlight={highlight}
            onWordSelect={(newWord) => handleWordReplace(highlight, newWord)}
          >
            <button
              className={`${highlightClass} border-b-2 font-semibold cursor-pointer transition-all duration-200 rounded-sm px-1 py-0.5 inline-block`}
              title={`${highlight.category} - Click for synonyms`}
            >
              {objective.current.slice(highlight.start, highlight.end)}
            </button>
          </SynonymPopover>
        );

        lastIndex = highlight.end;
      });

    // Add remaining text
    if (lastIndex < objective.current.length) {
      elements.push(
        <span key="text-end">
          {objective.current.slice(lastIndex)}
        </span>
      );
    }

    return elements;
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Learning Objective {index + 1}
          </CardTitle>
          <div className="flex gap-2">
            {objective.changes.length > 0 && (
              <Badge variant="secondary" className="bg-changed-highlight text-changed-border">
                {objective.changes.length} change{objective.changes.length !== 1 ? 's' : ''}
              </Badge>
            )}
            <Badge variant="outline">
              {highlights.length} term{highlights.length !== 1 ? 's' : ''} highlighted
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={objective.current}
              onChange={(e) => handleTextChange(e.target.value)}
              className="min-h-[120px] text-base leading-relaxed"
              placeholder="Enter your learning objective..."
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                Done Editing
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-base leading-relaxed p-4 bg-muted/50 rounded-lg border">
            {renderHighlightedText()}
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleUndo}
              disabled={objective.changes.length === 0}
              className="flex items-center gap-2"
            >
              <Undo2 className="h-4 w-4" />
              Undo
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2"
            >
              <Edit3 className="h-4 w-4" />
              {isEditing ? "View" : "Edit"}
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="flex items-center gap-2"
          >
            {copied ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-600" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy
              </>
            )}
          </Button>
        </div>
        
        {objective.changes.length > 0 && (
          <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
            <div className="font-medium mb-1">Original:</div>
            <div className="italic">{objective.original}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}