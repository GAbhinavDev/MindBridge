import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Users, BarChart3, Shield, Flame, BookOpen, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Heart,
    title: "Mood Pulse",
    description: "30-second anonymous check-in. No login, no judgment. Just tap how you feel — your data stays invisible.",
    color: "text-calm",
    bg: "bg-calm/10",
    link: "/mood",
  },
  {
    icon: BookOpen,
    title: "Story Circles",
    description: "Share your story anonymously. Voice notes that vanish in 7 days. Peers respond when they're ready.",
    color: "text-gentle",
    bg: "bg-gentle/10",
    link: "/stories",
  },
  {
    icon: Shield,
    title: "3AM Support",
    description: "Late-night distress detection. Breathing exercises, gentle check-ins, one-tap counselor connection.",
    color: "text-alert",
    bg: "bg-alert/10",
    link: "/crisis",
  },
  {
    icon: BarChart3,
    title: "NGO Dashboard",
    description: "Anonymized heatmaps, early warning clusters, resource deployment tracking. Data without exposure.",
    color: "text-warm",
    bg: "bg-warm/10",
    link: "/dashboard",
  },
  {
    icon: Flame,
    title: "Resilience Streaks",
    description: "Daily emotional check-ins build gentle habit loops. Unlock calming playlists and peer shoutouts.",
    color: "text-secondary",
    bg: "bg-secondary/10",
    link: "/streaks",
  },
  {
    icon: Users,
    title: "Peer Leaders",
    description: "Trained teen moderators earn Resilience Badges. Human support that scales without scarce counselors.",
    color: "text-safe",
    bg: "bg-safe/10",
    link: "/resources",
  },
];

const stats = [
  { value: "1 in 7", label: "adolescents face mental health conditions globally" },
  { value: "70%", label: "of struggling teens never seek help due to stigma" },
  { value: "<1%", label: "of health budgets in India go to mental health" },
  { value: "30 sec", label: "is all Mana needs for a wellbeing check-in" },
];

const Index = () => {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-calm opacity-50" />
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-primary/5 blur-3xl animate-breathe" />
        <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-gentle/5 blur-3xl animate-pulse-gentle" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Youth Mental Health Support System
            </div>
            <h1 className="font-heading text-5xl md:text-7xl font-bold leading-tight mb-6">
              You're not alone.
              <br />
              <span className="text-gradient-calm">Mana is here.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
              A safe, anonymous space where teens check in, share stories, and find support — 
              while NGOs get the intelligence they need to help. No login. No judgment. Just care.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/mood">
                <Button size="lg" className="gap-2 text-base px-8 py-6 rounded-xl">
                  <Heart className="w-5 h-5" />
                  Check In Now — 30 seconds
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="gap-2 text-base px-8 py-6 rounded-xl">
                  <BarChart3 className="w-5 h-5" />
                  NGO Dashboard
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="font-heading text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">
              Built for the teen experience
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Every feature addresses a real gap in adolescent mental health support in India.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
              >
                <Link to={feature.link}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group border-border/50">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                        <feature.icon className={`w-6 h-6 ${feature.color}`} />
                      </div>
                      <h3 className="font-heading text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">{feature.description}</p>
                      <div className="flex items-center gap-1 text-primary text-sm font-medium group-hover:gap-2 transition-all">
                        Explore <ArrowRight className="w-4 h-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-calm">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6">
              "We don't replace therapists.
              <br />
              We make sure teens never need to reach rock bottom before they find one."
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Mana bridges the gap between struggling in silence and finding real help.
            </p>
            <Link to="/mood">
              <Button size="lg" className="gap-2 text-base px-8 py-6 rounded-xl">
                Start Your Check-In <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Heart className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-heading font-bold text-lg">Mana</span>
              <span className="text-muted-foreground text-sm ml-2">Youth Mental Health Support</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/crisis" className="hover:text-foreground transition-colors">Crisis Help</Link>
              <Link to="/resources" className="hover:text-foreground transition-colors">Resources</Link>
              <Link to="/dashboard" className="hover:text-foreground transition-colors">For NGOs</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
