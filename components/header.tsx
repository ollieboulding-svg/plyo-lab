import { Zap } from "lucide-react";

export function Header() {
  return (
    <header className="flex items-center gap-3 py-6">
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
        <Zap className="w-5 h-5 text-primary-foreground" />
      </div>
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Plyo Lab
        </h1>
        <p className="text-xs text-muted-foreground">
          Athletic Performance Testing
        </p>
      </div>
    </header>
  );
}
