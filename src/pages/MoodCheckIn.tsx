import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, MapPin, School, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import MoodOrb from "@/components/MoodOrbs";

const moods = [
  { emoji: "😊", label: "Great", value: 5, color: "safe" },
  { emoji: "🙂", label: "Good", value: 4, color: "calm" },
  { emoji: "😐", label: "Okay", value: 3, color: "warm" },
  { emoji: "😔", label: "Low", value: 2, color: "gentle" },
  { emoji: "😢", label: "Struggling", value: 1, color: "alert" },
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
  const [timer, setTimer] = useState(30);
  const [timerActive, setTimerActive] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const totalSteps = 4;
  const progress = ((step + 1) / totalSteps) * 100;

  useEffect(() => {
    if (!timerActive || timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timerActive, timer]);

  const toggleStressor = (s: string) => {
    setSelectedStressors((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const handleSubmit = async () => {
    try {
      const { error } = await supabase.from("mood_checkins").insert({
        user_id: user?.id || null,
        mood_value: selectedMood!,
        stressors: selectedStressors,
        journal_text: journal || null,
        locality: locality || null,
      });

      if (error) throw error;

      // Update streak if logged in
      if (user) {
        const today = new Date().toISOString().split("T")[0];
        const { data: streak } = await supabase
          .from("streaks")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (streak) {
          const lastDate = streak.last_checkin_date;
          const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
          const newStreak = lastDate === yesterday ? streak.current_streak + 1 : lastDate === today ? streak.current_streak : 1;
          const newLongest = Math.max(newStreak, streak.longest_streak);

          await supabase.from("streaks").update({
            current_streak: newStreak,
            longest_streak: newLongest,
            total_checkins: streak.total_checkins + 1,
            last_checkin_date: today,
            xp_points: streak.xp_points + 10,
          }).eq("user_id", user.id);
        }
      }

      setSubmitted(true);
      setTimerActive(false);
    } catch (e) {
      toast({ title: "Error", description: "Failed to submit. Please try again.", variant: "destructive" });
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 rounded-full bg-safe/20 flex items-center justify-center mx-auto mb-6"
          >
            <Check className="w-10 h-10 text-safe" />
          </motion.div>
          <h2 className="font-heading text-3xl font-bold mb-4">Thank you 💚</h2>
          <p className="text-muted-foreground mb-2">Your feelings matter. This check-in is completely anonymous.</p>
          {user && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mb-4">
              <Badge className="bg-primary text-primary-foreground">+10 XP earned!</Badge>
            </motion.div>
          )}
          <p className="text-muted-foreground text-sm mb-8">
            Your mood data helps NGOs understand youth wellbeing — without ever revealing who you are.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => { setSubmitted(false); setStep(0); setSelectedMood(null); setSelectedStressors([]); setJournal(""); setLocality(""); setTimer(30); setTimerActive(true); }}>
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
          <div className="flex items-center justify-between mb-4">
            <Progress value={progress} className="h-2 flex-1 mr-4" />
            <div className="flex items-center gap-2 text-sm">
              <Timer className={`w-4 h-4 ${timer <= 10 ? "text-alert" : "text-muted-foreground"}`} />
              <span className={`font-mono font-bold ${timer <= 10 ? "text-alert" : "text-muted-foreground"}`}>
                {timer}s
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Step {step + 1} of {totalSteps} • Anonymous check-in</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="mood" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="font-heading text-3xl font-bold mb-2">How are you feeling right now?</h2>
              <p className="text-muted-foreground mb-8">No right answers. Just check in honestly.</p>
              <div className="flex justify-center gap-4 md:gap-6 flex-wrap">
                {moods.map((mood) => (
                  <MoodOrb
                    key={mood.value}
                    emoji={mood.emoji}
                    label={mood.label}
                    value={mood.value}
                    color={mood.color}
                    isSelected={selectedMood === mood.value}
                    onClick={() => setSelectedMood(mood.value)}
                  />
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
