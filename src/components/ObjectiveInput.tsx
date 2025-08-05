import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText } from "lucide-react";

interface ObjectiveInputProps {
  onSubmit: (objectives: string[]) => void;
}

export function ObjectiveInput({ onSubmit }: ObjectiveInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    const objectives = input
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    if (objectives.length > 0) {
      onSubmit(objectives);
    }
  };

  const sampleObjectives = `Students will be able to evaluate alternative strategies for market entry.
Students will design a simple experiment to test a hypothesis.
Students will analyze business data to identify opportunities.`;

  const loadSample = () => {
    setInput(sampleObjectives);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Enter Learning Objectives
        </CardTitle>
        <CardDescription>
          Paste or type your learning objectives below, one per line. Our tool will automatically 
          identify pedagogical verbs and suggest improvements based on Bloom's Taxonomy and Fink's 
          Significant Learning framework.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Textarea
            placeholder="Example:&#10;Students will be able to evaluate different research methodologies.&#10;Students will design experiments to test hypotheses.&#10;Students will analyze data to draw conclusions."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={8}
            className="text-base leading-relaxed"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={handleSubmit}
            disabled={!input.trim()}
            size="lg"
            className="flex-1"
          >
            <Upload className="h-4 w-4 mr-2" />
            Analyze Objectives
          </Button>
          
          <Button 
            onClick={loadSample}
            variant="outline"
            size="lg"
          >
            Load Sample
          </Button>
        </div>
        
        {input.trim() && (
          <div className="text-sm text-muted-foreground">
            {input.split('\n').filter(line => line.trim()).length} objective(s) ready for analysis
          </div>
        )}
      </CardContent>
    </Card>
  );
}