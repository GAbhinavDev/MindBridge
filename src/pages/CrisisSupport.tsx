import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Shield, Moon, Wind, Heart, AlertTriangle, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const helplines = [
  { name: "iCall", number: "9152987821", desc: "TISS Mumbai — Professional counseling" },
  { name: "Vandrevala Foundation", number: "1860-2662-345", desc: "24/7 free mental health support" },
  { name: "NIMHANS", number: "080-46110007", desc: "National mental health helpline" },
  { name: "Sneha India", number: "044-24640050", desc: "Suicide prevention — 24/7" },
];

const BreathingExercise = () => {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [count, setCount] = useState(4);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!active) return;
    const durations = { inhale: 4, hold: 7, exhale: 8 };
    const nextPhase = { inhale: "hold" as const, hold: "exhale" as const, exhale: "inhale" as const };
    setCount(durations[phase]);
    const interval = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          setPhase(nextPhase[phase]);
          return durations[nextPhase[phase]];
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, active]);

  const scale = phase === "inhale" ? 1.3 : phase === "hold" ? 1.3 : 1;

  return (
    <div className="text-center py-8">
      <h3 className="font-heading text-xl font-semibold mb-6">4-7-8 Breathing</h3>
      <div className="relative w-48 h-48 mx-auto mb-6">
        <motion.div
          animate={{ scale }}
          transition={{ duration: phase === "inhale" ? 4 : phase === "exhale" ? 8 : 0.3 }}
          className="w-48 h-48 rounded-full bg-primary/20 flex items-center justify-center"
        >
          <motion.div
            animate={{ scale: scale * 0.7 }}
            transition={{ duration: phase === "inhale" ? 4 : phase === "exhale" ? 8 : 0.3 }}
            className="w-32 h-32 rounded-full bg-primary/30 flex items-center justify-center"
          >
            <div className="text-center">
              <div className="font-heading text-3xl font-bold text-primary">{active ? count : "—"}</div>
              <div className="text-sm text-primary capitalize">{active ? phase : "Ready"}</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <Button onClick={() => setActive(!active)} variant={active ? "outline" : "default"} size="lg">
        {active ? "Stop" : "Start Breathing"} <Wind className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
};

const CrisisSupport = () => {
  const [activeTab, setActiveTab] = useState<"breathe" | "talk" | "ground">("breathe");
  const [isLateNight, setIsLateNight] = useState(false);
  const [groundingChecked, setGroundingChecked] = useState<boolean[]>([false, false, false, false, false]);

  useEffect(() => {
    const hour = new Date().getHours();
    setIsLateNight(hour >= 0 && hour < 5);
  }, []);

  const toggleGrounding = (idx: number) => {
    setGroundingChecked((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  };

  return (
    <div className={`min-h-screen pt-16 ${isLateNight ? "bg-background" : "bg-gradient-calm"}`}>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Late night banner */}
          {isLateNight && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-2xl bg-gentle/10 border border-gentle/20 flex items-start gap-3"
            >
              <Moon className="w-5 h-5 text-gentle mt-0.5" />
              <div>
                <p className="font-medium text-sm">It's late — we see you 💜</p>
                <p className="text-xs text-muted-foreground mt-1">
                  It's okay to be up right now. Take a breath, try the exercises below, or talk to someone.
                </p>
              </div>
            </motion.div>
          )}

          <div className="text-center mb-8">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4"
            >
              <Moon className="w-8 h-8 text-primary" />
            </motion.div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">You're safe here</h1>
            <p className="text-muted-foreground">Take a breath. We're here for you, no matter what time it is.</p>
          </div>

          {/* SOS Button */}
          <div className="text-center mb-8">
            <a href="tel:9152987821">
              <Button size="lg" className="bg-alert hover:bg-alert/90 text-white gap-2 px-8 py-6 text-base rounded-2xl shadow-lg">
                <AlertTriangle className="w-5 h-5" /> SOS — Talk to Someone Now
              </Button>
            </a>
            <p className="text-xs text-muted-foreground mt-2">One tap connects to iCall helpline</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { id: "breathe" as const, icon: Wind, label: "Breathe" },
              { id: "talk" as const, icon: Phone, label: "Helplines" },
              { id: "ground" as const, icon: Heart, label: "Grounding" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                  activeTab === tab.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/30"
                }`}
              >
                <tab.icon className="w-6 h-6" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "breathe" && (
              <motion.div key="breathe" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Card><CardContent className="p-6"><BreathingExercise /></CardContent></Card>
              </motion.div>
            )}

            {activeTab === "talk" && (
              <motion.div key="talk" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
                      <Phone className="w-5 h-5" /> One-Tap Helplines
                    </h3>
                    <div className="space-y-3">
                      {helplines.map((h) => (
                        <a key={h.number} href={`tel:${h.number}`} className="flex items-center gap-4 p-4 rounded-xl bg-muted hover:bg-primary/10 transition-colors">
                          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                            <Phone className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{h.name}</div>
                            <div className="text-sm text-muted-foreground">{h.desc}</div>
                          </div>
                          <div className="font-heading font-bold text-primary text-sm">{h.number}</div>
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "ground" && (
              <motion.div key="ground" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-heading text-xl font-semibold mb-4">5-4-3-2-1 Grounding</h3>
                    <p className="text-muted-foreground mb-6">Use your senses. Tap each one as you complete it.</p>
                    <div className="space-y-4">
                      {[
                        { count: 5, sense: "things you can SEE", emoji: "👀" },
                        { count: 4, sense: "things you can TOUCH", emoji: "✋" },
                        { count: 3, sense: "things you can HEAR", emoji: "👂" },
                        { count: 2, sense: "things you can SMELL", emoji: "👃" },
                        { count: 1, sense: "thing you can TASTE", emoji: "👅" },
                      ].map((item, idx) => (
                        <motion.button
                          key={item.count}
                          onClick={() => toggleGrounding(idx)}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                            groundingChecked[idx] ? "bg-safe/10 border border-safe/20" : "bg-muted/50"
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-heading text-xl font-bold ${
                            groundingChecked[idx] ? "bg-safe/20 text-safe" : "bg-primary/10 text-primary"
                          }`}>
                            {groundingChecked[idx] ? "✓" : item.count}
                          </div>
                          <div className="text-left">
                            <span className="text-2xl mr-2">{item.emoji}</span>
                            <span className={`font-medium ${groundingChecked[idx] ? "line-through text-muted-foreground" : ""}`}>
                              Name {item.count} {item.sense}
                            </span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                    {groundingChecked.every(Boolean) && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 text-center p-4 rounded-xl bg-safe/10"
                      >
                        <p className="font-medium text-safe">You did it! 💚 You're grounded and present.</p>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" /> This page is completely anonymous. No data is collected here.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CrisisSupport;
