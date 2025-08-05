import { GraduationCap } from "lucide-react";

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground py-6 px-6 shadow-sm">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <GraduationCap className="h-8 w-8" />
          <div>
            <h1 className="text-2xl font-bold">Abel's Wordsmith</h1>
            <p className="text-primary-foreground/90 text-sm">
              Learning Objective Refinement Tool for Academics
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}