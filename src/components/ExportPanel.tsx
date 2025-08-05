import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Copy, CheckCircle } from "lucide-react";
import { LearningObjective } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface ExportPanelProps {
  objectives: LearningObjective[];
}

export function ExportPanel({ objectives }: ExportPanelProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopyAll = async () => {
    const text = objectives
      .map((obj, index) => `${index + 1}. ${obj.current}`)
      .join('\n');
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "All objectives copied",
        description: "All learning objectives copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleDownloadCSV = () => {
    const csvContent = [
      'Index,Original,Revised,Changes',
      ...objectives.map((obj, index) => {
        const original = `"${obj.original.replace(/"/g, '""')}"`;
        const revised = `"${obj.current.replace(/"/g, '""')}"`;
        const changes = obj.changes.length;
        return `${index + 1},${original},${revised},${changes}`;
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'learning-objectives.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "CSV downloaded",
      description: "Learning objectives exported as CSV file",
    });
  };

  const hasChanges = objectives.some(obj => obj.changes.length > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export Options
        </CardTitle>
        <CardDescription>
          Download your refined learning objectives or copy them to use in your curriculum documents.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            onClick={handleCopyAll}
            variant="outline"
            className="flex items-center gap-2 h-auto py-3"
          >
            {copied ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-600" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy All
              </>
            )}
          </Button>
          
          <Button
            onClick={handleDownloadCSV}
            variant="outline"
            className="flex items-center gap-2 h-auto py-3"
          >
            <FileText className="h-4 w-4" />
            Download CSV
          </Button>
        </div>
        
        {hasChanges && (
          <div className="mt-4 p-3 bg-accent/50 rounded-lg">
            <div className="text-sm font-medium text-accent-foreground">
              Summary of Changes
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {objectives.filter(obj => obj.changes.length > 0).length} of {objectives.length} objectives have been modified
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}