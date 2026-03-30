import { useState } from "react";
import { motion } from "framer-motion";
import { Flame, Trophy, Music, Star, Heart, Calendar, Award, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const checkedDays = [true, true, true, true, true, false, false]; // M-F checked in

const badges = [
  { name: "First Check-In", icon: "🌱", earned: true, desc: "Complete your first mood check-in" },
  { name: "3-Day Streak", icon: "🔥", earned: true, desc: "Check in 3 days in a row" },
  { name: "Story Teller", icon: "📖", earned: true, desc: "Share your first story" },
  { name: "7-Day Streak", icon: "⚡", earned: false, desc: "Check in 7 days in a row", progress: 71 },
  { name: "Peer Supporter", icon: "🤝", earned: false, desc: "React to 10 stories", progress: 60 },
  { name: "Calm Master", icon: "🧘", earned: false, desc: "Complete 5 breathing exercises", progress: 40 },
  { name: "14-Day Streak", icon: "🌟", earned: false, desc: "Check in 14 days in a row", progress: 36 },
  { name: "Resilience Legend", icon: "👑", earned: false, desc: "Reach a 30-day streak", progress: 17 },
];

const rewards = [
  { name: "Lo-fi Study Playlist", icon: Music, unlocked: true, desc: "Unlocked at 3-day streak" },
  { name: "Custom Avatar Frame", icon: Star, unlocked: true, desc: "Unlocked at first story" },
  { name: "Peer Shoutout", icon: Heart, unlocked: false, desc: "Unlock at 7-day streak" },
  { name: "Guided Meditation Pack", icon: Sparkles, unlocked: false, desc: "Unlock at 14-day streak" },
];

const ResilienceStreaks = () => {
  const currentStreak = 5;
  const longestStreak = 12;
  const totalCheckIns = 23;

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
              <Flame className="w-10 h-10 text-secondary" />
            </div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">Resilience Streaks</h1>
            <p className="text-muted-foreground">Gentle habit loops — not toxic productivity. Just showing up for yourself.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "Current Streak", value: `${currentStreak} days`, icon: Flame, color: "text-secondary" },
              { label: "Longest Streak", value: `${longestStreak} days`, icon: Trophy, color: "text-warm" },
              { label: "Total Check-ins", value: totalCheckIns.toString(), icon: Calendar, color: "text-primary" },
            ].map((stat, i) => (
              <Card key={i}>
                <CardContent className="p-4 text-center">
                  <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                  <div className="font-heading text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Week View */}
          <Card className="mb-8">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((day, i) => (
                  <div key={day} className="text-center">
                    <div className="text-xs text-muted-foreground mb-2">{day}</div>
                    <div
                      className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${
                        checkedDays[i]
                          ? "bg-primary text-primary-foreground"
                          : i === 5
                          ? "border-2 border-dashed border-primary/30 text-muted-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {checkedDays[i] ? "✓" : i === 5 ? "?" : "·"}
                    </div>
                  </div>
                ))}
              </div>
              {!checkedDays[5] && (
                <div className="mt-4 text-center">
                  <Button className="gap-2">
                    <Heart className="w-4 h-4" /> Check In Today
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Badges */}
          <Card className="mb-8">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="w-5 h-5" /> Resilience Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {badges.map((badge) => (
                  <div
                    key={badge.name}
                    className={`p-3 rounded-xl border ${
                      badge.earned ? "bg-primary/5 border-primary/20" : "bg-muted/50 border-border"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{badge.icon}</span>
                      <div>
                        <div className="font-medium text-sm">{badge.name}</div>
                        <div className="text-xs text-muted-foreground">{badge.desc}</div>
                      </div>
                    </div>
                    {!badge.earned && badge.progress !== undefined && (
                      <Progress value={badge.progress} className="h-1.5 mt-2" />
                    )}
                    {badge.earned && (
                      <Badge className="mt-2 text-xs bg-safe text-white">Earned!</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Rewards */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5" /> Rewards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {rewards.map((reward) => (
                  <div
                    key={reward.name}
                    className={`flex items-center gap-4 p-3 rounded-xl ${
                      reward.unlocked ? "bg-primary/5" : "bg-muted/50 opacity-60"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      reward.unlocked ? "bg-primary/20" : "bg-muted"
                    }`}>
                      <reward.icon className={`w-5 h-5 ${reward.unlocked ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{reward.name}</div>
                      <div className="text-xs text-muted-foreground">{reward.desc}</div>
                    </div>
                    {reward.unlocked ? (
                      <Badge className="bg-safe text-white text-xs">Unlocked</Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">Locked</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ResilienceStreaks;
