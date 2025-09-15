import { GradientBlurBg } from "@/components/ui/gradient-blur-bg";

export default function DemoOne() {
  return (
    <GradientBlurBg>
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Beautiful Grid Pattern Background
          </h1>
          <p className="text-lg text-gray-600">
            This is a demo of the gradient blur background component with grid pattern
          </p>
        </div>
      </div>
    </GradientBlurBg>
  );
}