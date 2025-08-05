import { useState } from "react";
import { Header } from "./Header";
import { ObjectiveInput } from "./ObjectiveInput";
import { ObjectiveDisplay } from "./ObjectiveDisplay";
import { ExportPanel } from "./ExportPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LearningObjective } from "@/types";
import { generateId } from "@/utils/textAnalysis";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { RotateCcw, BookOpen, Target, Zap } from "lucide-react";

export function WordsmithApp() {
  const [objectives, setObjectives] = useLocalStorage<LearningObjective[]>('wordsmith-objectives', []);
  const [isInputMode, setIsInputMode] = useState(objectives.length === 0);

  const handleObjectivesSubmit = (objectiveTexts: string[]) => {
    const newObjectives: LearningObjective[] = objectiveTexts.map(text => ({
      id: generateId(),
      original: text,
      current: text,
      changes: [],
      highlights: []
    }));
    
    setObjectives(newObjectives);
    setIsInputMode(false);
  };

  const handleObjectiveUpdate = (updatedObjective: LearningObjective) => {
    setObjectives(prev => 
      prev.map(obj => obj.id === updatedObjective.id ? updatedObjective : obj)
    );
  };

  const handleStartOver = () => {
    setObjectives([]);
    setIsInputMode(true);
  };

  const features = [
    {
      icon: <Target className="h-6 w-6" />,
      title: "Automatic Detection",
      description: "Identifies pedagogical verbs from Bloom's Taxonomy and Fink's Significant Learning framework"
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Smart Synonyms",
      description: "Suggests pedagogically-aligned synonyms with definitions and cognitive levels"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Instant Refinement",
      description: "Click any highlighted word to see improvements and replace with better alternatives"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-6xl mx-auto px-6 py-8">
        {isInputMode ? (
          <div className="space-y-8">
            {/* Introduction */}
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-foreground">
                Refine Your Learning Objectives
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Transform your course objectives with pedagogically-sound language. Our tool helps you identify 
                and improve verbs using evidence-based frameworks for better learning outcomes.
              </p>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-2">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>

            <ObjectiveInput onSubmit={handleObjectivesSubmit} />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Your Learning Objectives
                </h2>
                <p className="text-muted-foreground">
                  Click highlighted words to see synonyms and make improvements
                </p>
              </div>
              <Button onClick={handleStartOver} variant="outline" className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                Start Over
              </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-4">
                {objectives.map((objective, index) => (
                  <ObjectiveDisplay
                    key={objective.id}
                    objective={objective}
                    onObjectiveUpdate={handleObjectiveUpdate}
                    index={index}
                  />
                ))}
              </div>
              
              <div className="lg:col-span-1">
                <ExportPanel objectives={objectives} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}