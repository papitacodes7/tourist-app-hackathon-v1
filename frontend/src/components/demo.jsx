import { GradientBackground } from "@/components/ui/gradient-backgrounds";

export default function DemoOne() {
  return (
    <GradientBackground variant="indigo">
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Beautiful Gradient Background
          </h1>
          <p className="text-lg text-white/80">
            This is a demo of the gradient background component
          </p>
        </div>
      </div>
    </GradientBackground>
  );
}