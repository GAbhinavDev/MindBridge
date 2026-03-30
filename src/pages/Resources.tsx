import { motion } from "framer-motion";
import { BookOpen, ExternalLink, Users, Video, FileText, Headphones, Shield, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const resources = [
  {
    category: "Self-Help Guides",
    icon: FileText,
    items: [
      { title: "Understanding Anxiety — A Teen's Guide", type: "Article", time: "5 min read" },
      { title: "How to Talk to Your Parents About Mental Health", type: "Guide", time: "8 min read" },
      { title: "Exam Stress Survival Kit", type: "Toolkit", time: "10 min read" },
      { title: "Social Media & Self-Worth", type: "Article", time: "6 min read" },
    ],
  },
  {
    category: "Videos & Audio",
    icon: Video,
    items: [
      { title: "Body Scan Meditation for Teens", type: "Audio", time: "12 min" },
      { title: "What Is Depression? Explained Simply", type: "Video", time: "8 min" },
      { title: "Sleep Hygiene Tips for Students", type: "Video", time: "6 min" },
      { title: "Progressive Muscle Relaxation", type: "Audio", time: "15 min" },
    ],
  },
  {
    category: "Peer Support",
    icon: Users,
    items: [
      { title: "How to Be a Good Listener", type: "Guide", time: "7 min read" },
      { title: "Peer Leader Training Module 1", type: "Course", time: "30 min" },
      { title: "Setting Boundaries with Friends", type: "Article", time: "5 min read" },
      { title: "When a Friend is in Crisis — What To Do", type: "Guide", time: "4 min read" },
    ],
  },
];

const peerLeaders = [
  { name: "Priya S.", badge: "🥇 Gold Leader", stories: 45, helped: 120, streak: 28 },
  { name: "Arjun K.", badge: "🥈 Silver Leader", stories: 32, helped: 85, streak: 21 },
  { name: "Meera R.", badge: "🥉 Bronze Leader", stories: 28, helped: 67, streak: 14 },
  { name: "Rahul D.", badge: "⭐ Rising Star", stories: 15, helped: 34, streak: 9 },
];

const Resources = () => {
  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">Resources & Peer Leaders</h1>
          <p className="text-muted-foreground mb-8">
            Curated mental health resources for teens, by teens. Plus our peer leader community.
          </p>

          {/* Resource Sections */}
          <div className="space-y-8 mb-12">
            {resources.map((section, si) => (
              <motion.div
                key={section.category}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: si * 0.1 }}
              >
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <section.icon className="w-5 h-5 text-primary" />
                      {section.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {section.items.map((item) => (
                        <button
                          key={item.title}
                          className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-primary/5 transition-colors text-left"
                        >
                          <div className="flex-1">
                            <div className="font-medium text-sm">{item.title}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">{item.type}</Badge>
                              <span className="text-xs text-muted-foreground">{item.time}</span>
                            </div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Peer Leaders */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-warm" />
                  Peer Leader Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Trained teen moderators who earn Resilience Badges by supporting their peers.
                </p>
                <div className="space-y-3">
                  {peerLeaders.map((leader, i) => (
                    <div key={leader.name} className="flex items-center gap-4 p-3 rounded-xl bg-muted/50">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-heading font-bold text-primary">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{leader.name}</span>
                          <Badge variant="outline" className="text-xs">{leader.badge}</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {leader.stories} stories • {leader.helped} peers helped • {leader.streak}-day streak
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Button variant="outline" className="gap-2">
                    <Users className="w-4 h-4" /> Become a Peer Leader
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Resources;
