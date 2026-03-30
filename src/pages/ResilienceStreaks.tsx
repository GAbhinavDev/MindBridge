import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Flame, Trophy, Music, Star, Heart, Calendar, Award, Sparkles, Zap, Target, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const levelNames = [
  { min: 0, name: "Seedling", emoji: "🌱" },
  { min: 100, name: "Sprout", emoji: "🌿" },
  { min: 300, name: "Bloom", emoji: "🌸" },
  { min: 600, name: "Tree", emoji: "🌳" },
  { min: 1000, name: "Forest", emoji: "🏔️" },
  { min: 2000, name: "Legend", emoji: "👑" },
];

const badgeDefinitions = [
  { key: "first_checkin", name: "First Check-In", icon: "🌱", desc: "Complete your first mood check-in" },
  { key: "3_day_streak", name: "3-Day Streak", icon: "🔥", desc: "Check in 3 days in a row" },
  { key: "story_teller", name: "Story Teller", icon: "📖", desc: "Share your first story" },
  { key: "7_day_streak", name: "7-Day Streak", icon: "⚡", desc: "Check in 7 days in a row" },
  { key: "peer_supporter", name: "Peer Supporter", icon: "🤝", desc: "React to 10 stories" },
  { key: "14_day_streak", name: "14-Day Streak", icon: "🌟", desc: "Check in 14 days in a row" },
  { key: "30_day_legend", name: "30-Day Legend", icon: "👑", desc: "Reach a 30-day streak" },
];

const ResilienceStreaks = () => {
  const { user } = useAuth();
  const [streak, setStreak] = useState({ current_streak: 0, longest_streak: 0, total_checkins: 0, xp_points: 0, last_checkin_date: null as string | null });
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [quests, setQuests] = useState<any[]>([]);
  const [userQuests, setUserQuests] = useState<any[]>([]);
  const [weekCheckins, setWeekCheckins] = useState<boolean[]>([false, false, false, false, false, false, false]);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    const { data: streakData } = await supabase.from("streaks").select("*").eq("user_id", user.id).single();
    if (streakData) setStreak(streakData);

    const { data: badgesData } = await supabase.from("badges_earned").select("badge_key").eq("user_id", user.id);
    if (badgesData) setEarnedBadges(badgesData.map((b) => b.badge_key));

    const { data: questsData } = await supabase.from("quests").select("*");
    if (questsData) setQuests(questsData);

    const { data: uqData } = await supabase.from("user_quests").select("*").eq("user_id", user.id);
    if (uqData) setUserQuests(uqData);

    // Fetch this week's checkins
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0);

    const { data: weekData } = await supabase
      .from("mood_checkins")
      .select("created_at")
      .eq("user_id", user.id)
      .gte("created_at", startOfWeek.toISOString());

    if (weekData) {
      const days = [false, false, false, false, false, false, false];
      weekData.forEach((c) => {
        const day = new Date(c.created_at).getDay();
        const idx = day === 0 ? 6 : day - 1;
        days[idx] = true;
      });
      setWeekCheckins(days);
    }
  };

  const currentLevel = [...levelNames].reverse().find((l) => streak.xp_points >= l.min) || levelNames[0];
  const nextLevel = levelNames.find((l) => l.min > streak.xp_points);
  const xpProgress = nextLevel ? ((streak.xp_points - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100 : 100;

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

  if (!user) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Flame className="w-16 h-16 text-secondary mx-auto mb-4" />
          <h2 className="font-heading text-2xl font-bold mb-4">Sign in to track your journey</h2>
          <p className="text-muted-foreground mb-6">Build streaks, earn XP, unlock badges and rewards.</p>
          <Link to="/auth"><Button size="lg">Sign In</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Level Header */}
          <div className="text-center mb-8">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              {currentLevel.emoji}
            </motion.div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-1">Level {levelNames.indexOf(currentLevel) + 1}: {currentLevel.name}</h1>
            <p className="text-muted-foreground mb-4">
              {streak.xp_points} XP {nextLevel ? `• ${nextLevel.min - streak.xp_points} XP to ${nextLevel.name}` : "• Max Level!"}
            </p>
            <div className="max-w-xs mx-auto">
              <Progress value={xpProgress} className="h-3" />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "Current Streak", value: `${streak.current_streak}d`, icon: Flame, color: "text-secondary" },
              { label: "Longest Streak", value: `${streak.longest_streak}d`, icon: Trophy, color: "text-warm" },
              { label: "Total XP", value: streak.xp_points.toString(), icon: Zap, color: "text-primary" },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                <Card>
                  <CardContent className="p-4 text-center">
                    <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                    <div className="font-heading text-2xl font-bold">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Week View */}
          <Card className="mb-8">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" /> This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((day, i) => (
                  <div key={day} className="text-center">
                    <div className="text-xs text-muted-foreground mb-2">{day}</div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center transition-all ${
                        weekCheckins[i]
                          ? "bg-primary text-primary-foreground"
                          : i === todayIdx
                          ? "border-2 border-dashed border-primary/50 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {weekCheckins[i] ? "✓" : i === todayIdx ? "?" : "·"}
                    </motion.div>
                  </div>
                ))}
              </div>
              {!weekCheckins[todayIdx] && (
                <div className="mt-4 text-center">
                  <Link to="/mood">
                    <Button className="gap-2"><Heart className="w-4 h-4" /> Check In Today (+10 XP)</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quests */}
          <Card className="mb-8">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-warm" /> Active Quests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {quests.slice(0, 5).map((quest) => {
                  const uq = userQuests.find((u) => u.quest_id === quest.id);
                  const completed = uq?.completed_at;
                  const progress = uq?.progress || 0;
                  return (
                    <div key={quest.id} className={`p-3 rounded-xl border ${completed ? "bg-safe/5 border-safe/20" : "border-border"}`}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          {completed ? <CheckCircle2 className="w-4 h-4 text-safe" /> : <Target className="w-4 h-4 text-muted-foreground" />}
                          <span className="font-medium text-sm">{quest.title}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">+{quest.xp_reward} XP</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{quest.description}</p>
                      {!completed && (
                        <Progress value={(progress / quest.target_count) * 100} className="h-1.5" />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Badges */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="w-5 h-5" /> Resilience Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {badgeDefinitions.map((badge) => {
                  const earned = earnedBadges.includes(badge.key);
                  return (
                    <motion.div
                      key={badge.key}
                      whileHover={{ scale: 1.02 }}
                      className={`p-3 rounded-xl border ${earned ? "bg-primary/5 border-primary/20" : "bg-muted/50 border-border opacity-60"}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{badge.icon}</span>
                        <div>
                          <div className="font-medium text-sm">{badge.name}</div>
                          <div className="text-xs text-muted-foreground">{badge.desc}</div>
                        </div>
                      </div>
                      {earned && <Badge className="mt-2 text-xs bg-safe text-white">Earned!</Badge>}
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ResilienceStreaks;
