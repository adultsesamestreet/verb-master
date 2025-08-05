import { GraduationCap } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <GraduationCap className="h-16 w-16 text-primary animate-pulse" />
            <div className="absolute inset-0 h-16 w-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Abel's Wordsmith</h1>
          <p className="text-muted-foreground">Loading your learning objective refinement tool...</p>
        </div>
        
        <div className="flex justify-center">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}