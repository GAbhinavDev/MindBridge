import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, MapPin, School } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const moods = [
  { emoji: "😊", label: "Great", color: "bg-safe/20 border-safe", value: 5 },
  { emoji: "🙂", label: "Good", color: "bg-calm/20 border-calm", value: 4 },
  { emoji: "😐", label: "Okay", color: "bg-warm/20 border-warm", value: 3 },
  { emoji: "😔", label: "Low", color: "bg-gentle/20 border-gentle", value: 2 },
  { emoji: "😢", label: "Struggling", color: "bg-alert/20 border-alert", value: 1 },
];

const stressors = [
  "📚 Academics", "👨‍👩‍👧 Family", "👥 Friends", "📱 Social Media",
  "💤 Sleep", "🏫 School", "💰 Money", "❤️ Relationships",
  "🎯 Future", "🏠 Home", "🧠 Self-image", "Other",
];

const localities = [
  "Delhi NCR", "Mumbai", "Bengaluru", "Chennai", "Hyderabad",
  "Kolkata", "Pune", "Jaipur", "Lucknow", "Other",
];

const MoodCheckIn = () => {
  const [step, setStep] = useState(0);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedStressors, setSelectedStressors] = useState<string[]>([]);
  const [journal, setJournal] = useState("");
  const [locality, setLocality] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const totalSteps = 4;
  const progress = ((step + 1) / totalSteps) * 100;

  const toggleStressor = (s: string) => {
    setSelectedStressors((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-safe/20 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-safe" />
          </div>
          <h2 className="font-heading text-3xl font-bold mb-4">Thank you 💚</h2>
          <p className="text-muted-foreground mb-2">Your feelings matter. This check-in is completely anonymous.</p>
          <p className="text-muted-foreground text-sm mb-8">
            Your mood data helps NGOs understand youth wellbeing in your area — without ever revealing who you are.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => { setSubmitted(false); setStep(0); setSelectedMood(null); setSelectedStressors([]); setJournal(""); setLocality(""); }}>
              Check In Again
            </Button>
            <Button variant="outline" onClick={() => window.location.href = "/stories"}>
              Share a Story
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Progress value={progress} className="h-2 mb-4" />
          <p className="text-sm text-muted-foreground">Step {step + 1} of {totalSteps} • Anonymous check-in</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="mood" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="font-heading text-3xl font-bold mb-2">How are you feeling right now?</h2>
              <p className="text-muted-foreground mb-8">No right answers. Just check in honestly.</p>
              <div className="grid grid-cols-5 gap-3">
                {moods.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => setSelectedMood(mood.value)}
                    className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${
                      selectedMood === mood.value ? mood.color + " scale-105" : "border-border hover:border-primary/30"
                    }`}
                  >
                    <span className="text-4xl mb-2">{mood.emoji}</span>
                    <span className="text-xs font-medium">{mood.label}</span>
                  </button>
                ))}
              </div>
              <div className="mt-8 flex justify-end">
                <Button onClick={() => setStep(1)} disabled={selectedMood === null} className="gap-2">
                  Next <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="stressors" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="font-heading text-3xl font-bold mb-2">What's weighing on you?</h2>
              <p className="text-muted-foreground mb-8">Pick as many as you want, or skip this.</p>
              <div className="flex flex-wrap gap-2">
                {stressors.map((s) => (
                  <Badge
                    key={s}
                    variant={selectedStressors.includes(s) ? "default" : "outline"}
                    className="px-4 py-2 text-sm cursor-pointer hover:bg-primary/10 transition-colors"
                    onClick={() => toggleStressor(s)}
                  >
                    {s}
                  </Badge>
                ))}
              </div>
              <div className="mt-8 flex justify-between">
                <Button variant="ghost" onClick={() => setStep(0)} className="gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                <Button onClick={() => setStep(2)} className="gap-2">
                  Next <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="journal" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="font-heading text-3xl font-bold mb-2">Want to say more?</h2>
              <p className="text-muted-foreground mb-8">Totally optional. Sometimes writing it out helps.</p>
              <Textarea
                placeholder="Whatever's on your mind... this is completely anonymous."
                value={journal}
                onChange={(e) => setJournal(e.target.value)}
                rows={6}
                className="text-base resize-none"
              />
              <div className="mt-8 flex justify-between">
                <Button variant="ghost" onClick={() => setStep(1)} className="gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(3)}>Skip</Button>
                  <Button onClick={() => setStep(3)} className="gap-2">
                    Next <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="locality" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="font-heading text-3xl font-bold mb-2">Where are you based?</h2>
              <p className="text-muted-foreground mb-8">
                <MapPin className="w-4 h-4 inline mr-1" />
                This helps NGOs understand regional wellbeing — no personal data is linked.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {localities.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setLocality(loc)}
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-sm ${
                      locality === loc ? "border-primary bg-primary/10" : "border-border hover:border-primary/30"
                    }`}
                  >
                    <School className="w-4 h-4 text-muted-foreground" />
                    {loc}
                  </button>
                ))}
              </div>
              <div className="mt-8 flex justify-between">
                <Button variant="ghost" onClick={() => setStep(2)} className="gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                <Button onClick={handleSubmit} className="gap-2 px-8">
                  <Check className="w-4 h-4" /> Submit Anonymously
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MoodCheckIn;
