import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Tags, Lightbulb } from "lucide-react";
import { Highlight, WordSuggestion } from "@/types";

interface SynonymPopoverProps {
  children: React.ReactNode;
  highlight: Highlight;
  onWordSelect: (newWord: string) => void;
}

export function SynonymPopover({ children, highlight, onWordSelect }: SynonymPopoverProps) {
  const [open, setOpen] = useState(false);

  const handleWordSelect = (word: string) => {
    onWordSelect(word);
    setOpen(false);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'blooms':
        return 'bg-bloom-highlight text-bloom-border';
      case 'fink':
        return 'bg-fink-highlight text-fink-border';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" side="top" align="start">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                "{highlight.word}"
              </CardTitle>
              <Badge className={getTypeColor(highlight.type)}>
                {highlight.category}
                {highlight.level && ` (Level ${highlight.level})`}
              </Badge>
            </div>
            {highlight.definition && (
              <CardDescription className="text-sm leading-relaxed">
                {highlight.definition}
              </CardDescription>
            )}
          </CardHeader>
          
          <CardContent className="space-y-4">
            {highlight.synonyms && highlight.synonyms.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Tags className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm">Pedagogical Synonyms</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {highlight.synonyms.map((synonym, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="justify-start h-auto py-2 text-left hover:bg-accent"
                      onClick={() => handleWordSelect(synonym)}
                    >
                      {synonym}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="pt-2 border-t">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Click any synonym to replace the word in your objective
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}