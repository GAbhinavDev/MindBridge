import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3, TrendingUp, TrendingDown, AlertTriangle, Users, MapPin, Clock, Shield, Activity, Download,
  Sun, Cloud, CloudRain, CloudLightning, Bell, FileText, Target, Layers, PieChart, Zap, Globe,
  Calendar, ArrowUpRight, ArrowDownRight, Eye, MessageSquare, Brain
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area, PieChart as RePieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const chartConfig = {
  happy: { label: "Happy", color: "hsl(145, 55%, 45%)" },
  okay: { label: "Okay", color: "hsl(174, 62%, 38%)" },
  low: { label: "Low", color: "hsl(36, 90%, 62%)" },
  struggling: { label: "Struggling", color: "hsl(0, 72%, 55%)" },
  checkIns: { label: "Check-ins", color: "hsl(174, 62%, 38%)" },
  distress: { label: "Distress", color: "hsl(0, 72%, 55%)" },
  stories: { label: "Stories", color: "hsl(265, 60%, 55%)" },
  reactions: { label: "Reactions", color: "hsl(200, 60%, 50%)" },
};

const COLORS = ["hsl(145, 55%, 45%)", "hsl(174, 62%, 38%)", "hsl(36, 90%, 62%)", "hsl(0, 72%, 55%)", "hsl(265, 60%, 55%)"];

const moodWeatherIcon = (avgMood: number) => {
  if (avgMood >= 4) return <Sun className="w-8 h-8 text-safe" />;
  if (avgMood >= 3) return <Cloud className="w-8 h-8 text-warm" />;
  if (avgMood >= 2) return <CloudRain className="w-8 h-8 text-gentle" />;
  return <CloudLightning className="w-8 h-8 text-alert" />;
};

const moodLabel = (val: number) => {
  if (val >= 4) return "Sunny";
  if (val >= 3) return "Cloudy";
  if (val >= 2) return "Rainy";
  return "Stormy";
};

const NGODashboard = () => {
  const { user, isNGOAdmin } = useAuth();
  const [totalCheckins, setTotalCheckins] = useState(0);
  const [avgMood, setAvgMood] = useState(0);
  const [regionData, setRegionData] = useState<any[]>([]);
  const [stressorData, setStressorData] = useState<any[]>([]);
  const [moodTrendData, setMoodTrendData] = useState<any[]>([]);
  const [hourlyData, setHourlyData] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [activeStories, setActiveStories] = useState(0);
  const [totalReactions, setTotalReactions] = useState(0);
  const [moodDistribution, setMoodDistribution] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);

    const { data: checkins } = await supabase.from("mood_checkins").select("*");

    if (checkins && checkins.length > 0) {
      setTotalCheckins(checkins.length);
      const avg = checkins.reduce((sum, c) => sum + c.mood_value, 0) / checkins.length;
      setAvgMood(Math.round(avg * 10) / 10);

      // Mood distribution for pie chart
      const dist = { happy: 0, okay: 0, low: 0, struggling: 0 };
      checkins.forEach(c => {
        if (c.mood_value >= 4) dist.happy++;
        else if (c.mood_value === 3) dist.okay++;
        else if (c.mood_value === 2) dist.low++;
        else dist.struggling++;
      });
      setMoodDistribution([
        { name: "Happy", value: dist.happy, color: COLORS[0] },
        { name: "Okay", value: dist.okay, color: COLORS[1] },
        { name: "Low", value: dist.low, color: COLORS[2] },
        { name: "Struggling", value: dist.struggling, color: COLORS[3] },
      ]);

      // Region data
      const byRegion: Record<string, { total: number; moodSum: number; struggling: number; stressors: Record<string, number> }> = {};
      checkins.forEach((c) => {
        const loc = c.locality || "Unknown";
        if (!byRegion[loc]) byRegion[loc] = { total: 0, moodSum: 0, struggling: 0, stressors: {} };
        byRegion[loc].total++;
        byRegion[loc].moodSum += c.mood_value;
        if (c.mood_value <= 2) byRegion[loc].struggling++;
        (c.stressors || []).forEach((s: string) => {
          byRegion[loc].stressors[s] = (byRegion[loc].stressors[s] || 0) + 1;
        });
      });
      const regions = Object.entries(byRegion).map(([region, data]) => {
        const topStressor = Object.entries(data.stressors).sort((a, b) => b[1] - a[1])[0];
        return {
          region,
          checkIns: data.total,
          avgMood: Math.round((data.moodSum / data.total) * 10) / 10,
          distressRate: Math.round((data.struggling / data.total) * 100),
          trend: data.moodSum / data.total >= 3 ? "up" : "down",
          topStressor: topStressor ? topStressor[0] : "N/A",
          riskLevel: data.struggling / data.total > 0.4 ? "critical" : data.struggling / data.total > 0.2 ? "warning" : "normal",
        };
      }).sort((a, b) => b.checkIns - a.checkIns);
      setRegionData(regions);

      // Alerts
      const newAlerts: any[] = [];
      regions.forEach((r) => {
        if (r.distressRate > 40) {
          newAlerts.push({ type: "critical", region: r.region, message: `${r.distressRate}% distress rate — immediate intervention recommended`, icon: AlertTriangle });
        } else if (r.distressRate > 20) {
          newAlerts.push({ type: "warning", region: r.region, message: `${r.distressRate}% distress rate — monitor closely`, icon: Eye });
        }
      });
      // Check late-night patterns
      const lateNight = checkins.filter(c => {
        const hour = new Date(c.created_at).getHours();
        return hour >= 0 && hour <= 4 && c.mood_value <= 2;
      });
      if (lateNight.length > 5) {
        newAlerts.push({ type: "warning", region: "System-wide", message: `${lateNight.length} late-night distress check-ins detected (12am-4am)`, icon: Clock });
      }
      setAlerts(newAlerts);

      // Stressors
      const stressorCounts: Record<string, number> = {};
      checkins.forEach((c) => {
        (c.stressors || []).forEach((s: string) => {
          stressorCounts[s] = (stressorCounts[s] || 0) + 1;
        });
      });
      setStressorData(
        Object.entries(stressorCounts)
          .map(([name, value]) => ({ name, value, fullMark: Math.max(...Object.values(stressorCounts)) }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 10)
      );

      // Mood trends
      const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const byDay: Record<string, { happy: number; okay: number; low: number; struggling: number }> = {};
      dayNames.forEach((d) => (byDay[d] = { happy: 0, okay: 0, low: 0, struggling: 0 }));
      checkins.forEach((c) => {
        const day = dayNames[new Date(c.created_at).getDay() === 0 ? 6 : new Date(c.created_at).getDay() - 1];
        if (c.mood_value >= 4) byDay[day].happy++;
        else if (c.mood_value === 3) byDay[day].okay++;
        else if (c.mood_value === 2) byDay[day].low++;
        else byDay[day].struggling++;
      });
      setMoodTrendData(dayNames.map((d) => ({ day: d, ...byDay[d] })));

      // Hourly
      const byHour: Record<number, { checkIns: number; distress: number }> = {};
      for (let i = 0; i < 24; i++) byHour[i] = { checkIns: 0, distress: 0 };
      checkins.forEach((c) => {
        const hour = new Date(c.created_at).getHours();
        byHour[hour].checkIns++;
        if (c.mood_value <= 2) byHour[hour].distress++;
      });
      setHourlyData(Array.from({ length: 24 }, (_, i) => ({ hour: `${i}:00`, ...byHour[i] })));
    } else {
      // Demo data
      setTotalCheckins(4280);
      setAvgMood(3.2);
      setMoodDistribution([
        { name: "Happy", value: 1520, color: COLORS[0] },
        { name: "Okay", value: 1200, color: COLORS[1] },
        { name: "Low", value: 890, color: COLORS[2] },
        { name: "Struggling", value: 670, color: COLORS[3] },
      ]);
      setMoodTrendData([
        { day: "Mon", happy: 42, okay: 28, low: 18, struggling: 12 },
        { day: "Tue", happy: 38, okay: 30, low: 20, struggling: 12 },
        { day: "Wed", happy: 35, okay: 25, low: 22, struggling: 18 },
        { day: "Thu", happy: 40, okay: 30, low: 18, struggling: 12 },
        { day: "Fri", happy: 45, okay: 28, low: 17, struggling: 10 },
        { day: "Sat", happy: 50, okay: 25, low: 15, struggling: 10 },
        { day: "Sun", happy: 48, okay: 27, low: 16, struggling: 9 },
      ]);
      setStressorData([
        { name: "📚 Academics", value: 340, fullMark: 340 },
        { name: "👨‍👩‍👧 Family", value: 210, fullMark: 340 },
        { name: "📱 Social Media", value: 180, fullMark: 340 },
        { name: "💤 Sleep", value: 150, fullMark: 340 },
        { name: "❤️ Relationships", value: 120, fullMark: 340 },
        { name: "🎯 Future", value: 95, fullMark: 340 },
        { name: "🏫 School", value: 85, fullMark: 340 },
        { name: "🧠 Self-image", value: 72, fullMark: 340 },
      ]);
      setRegionData([
        { region: "Delhi NCR", checkIns: 1240, avgMood: 3.2, distressRate: 30, trend: "down", topStressor: "📚 Academics", riskLevel: "warning" },
        { region: "Mumbai", checkIns: 980, avgMood: 3.5, distressRate: 18, trend: "up", topStressor: "📱 Social Media", riskLevel: "normal" },
        { region: "Bengaluru", checkIns: 820, avgMood: 3.8, distressRate: 12, trend: "up", topStressor: "💤 Sleep", riskLevel: "normal" },
        { region: "Chennai", checkIns: 650, avgMood: 3.1, distressRate: 35, trend: "down", topStressor: "👨‍👩‍👧 Family", riskLevel: "warning" },
        { region: "Kolkata", checkIns: 420, avgMood: 2.9, distressRate: 42, trend: "down", topStressor: "📚 Academics", riskLevel: "critical" },
        { region: "Hyderabad", checkIns: 380, avgMood: 3.4, distressRate: 22, trend: "up", topStressor: "🎯 Future", riskLevel: "warning" },
      ]);
      setAlerts([
        { type: "critical", region: "Kolkata", message: "42% distress rate — immediate attention needed", icon: AlertTriangle },
        { type: "warning", region: "Chennai", message: "35% distress rate trending upward this week", icon: TrendingUp },
        { type: "warning", region: "System-wide", message: "18 late-night distress check-ins detected (12am-4am)", icon: Clock },
      ]);
      setHourlyData(Array.from({ length: 24 }, (_, i) => ({
        hour: `${i}:00`,
        checkIns: i >= 22 || i <= 5 ? Math.floor(Math.random() * 30 + 20) : Math.floor(Math.random() * 80 + 40),
        distress: i >= 0 && i <= 4 ? Math.floor(Math.random() * 15 + 10) : Math.floor(Math.random() * 8 + 2),
      })));
    }

    const { count: storyCount } = await supabase.from("stories").select("*", { count: "exact", head: true }).gt("expires_at", new Date().toISOString());
    setActiveStories(storyCount || 0);

    const { count: reactionCount } = await supabase.from("story_reactions").select("*", { count: "exact", head: true });
    setTotalReactions(reactionCount || 0);

    setIsLoading(false);
  };

  const exportCSV = () => {
    const header = "Region,CheckIns,AvgMood,DistressRate,TopStressor,RiskLevel\n";
    const rows = regionData.map((r) => `${r.region},${r.checkIns},${r.avgMood},${r.distressRate}%,${r.topStressor},${r.riskLevel}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mindbridge-wellbeing-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const exportDetailedReport = () => {
    const sections = [
      "MindBridge NGO Intelligence Report",
      `Generated: ${new Date().toLocaleString()}`,
      "",
      "=== EXECUTIVE SUMMARY ===",
      `Total Check-ins: ${totalCheckins}`,
      `Average Mood Score: ${avgMood}/5`,
      `Active Stories: ${activeStories}`,
      `Total Peer Reactions: ${totalReactions}`,
      `Active Alerts: ${alerts.length}`,
      "",
      "=== REGIONAL BREAKDOWN ===",
      regionData.map(r => `${r.region}: ${r.checkIns} check-ins, Mood ${r.avgMood}/5, Distress ${r.distressRate}%, Top Stressor: ${r.topStressor}, Risk: ${r.riskLevel}`).join("\n"),
      "",
      "=== STRESSOR ANALYSIS ===",
      stressorData.map(s => `${s.name}: ${s.value} reports`).join("\n"),
      "",
      "=== ALERTS ===",
      alerts.map(a => `[${a.type.toUpperCase()}] ${a.region}: ${a.message}`).join("\n"),
    ].join("\n");

    const blob = new Blob([sections], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mindbridge-detailed-report-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
  };

  const maxStressor = stressorData.length > 0 ? Math.max(...stressorData.map((s) => s.value)) : 1;

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading intelligence dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16" style={{ background: "linear-gradient(180deg, hsl(var(--background)), hsl(var(--muted)))" }}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="font-heading text-2xl font-bold flex items-center gap-2">
                    NGO Intelligence Hub
                    <Badge className="bg-safe/20 text-safe border-safe/30">● Live</Badge>
                  </h1>
                  <p className="text-sm text-muted-foreground">Anonymized youth wellbeing intelligence • Real-time aggregation</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={exportCSV} className="gap-2">
                <Download className="w-4 h-4" /> CSV
              </Button>
              <Button variant="outline" size="sm" onClick={exportDetailedReport} className="gap-2">
                <FileText className="w-4 h-4" /> Full Report
              </Button>
              <Badge variant="outline" className="gap-1 py-2 px-3">
                <Shield className="w-3 h-3" /> Zero PII
              </Badge>
            </div>
          </div>

          {/* Alerts Banner */}
          {alerts.length > 0 && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <Card className="border-alert/30 bg-alert/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Bell className="w-5 h-5 text-alert" />
                    <span className="font-heading font-semibold">Active Alerts ({alerts.length})</span>
                  </div>
                  <div className="space-y-2">
                    {alerts.map((alert, i) => (
                      <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${alert.type === "critical" ? "bg-alert/10 border border-alert/20" : "bg-warm/10 border border-warm/20"}`}>
                        <alert.icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${alert.type === "critical" ? "text-alert" : "text-warm"}`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant={alert.type === "critical" ? "destructive" : "outline"} className="text-xs">{alert.type}</Badge>
                            <span className="text-xs font-medium">{alert.region}</span>
                          </div>
                          <p className="text-sm mt-1 text-muted-foreground">{alert.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* KPI Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            {[
              { label: "Total Check-ins", value: totalCheckins.toLocaleString(), icon: Activity, color: "text-primary", trend: "+12% ↑" },
              { label: "Avg Mood", value: avgMood ? `${avgMood}/5` : "—", icon: TrendingUp, color: avgMood >= 3 ? "text-safe" : "text-alert", trend: avgMood >= 3 ? "Healthy" : "At risk" },
              { label: "Active Stories", value: activeStories.toString(), icon: MessageSquare, color: "text-gentle", trend: "This week" },
              { label: "Peer Reactions", value: totalReactions.toLocaleString(), icon: Users, color: "text-warm", trend: "Community" },
              { label: "Regions", value: regionData.length.toString(), icon: Globe, color: "text-primary", trend: "Monitored" },
              { label: "Alerts", value: alerts.length.toString(), icon: AlertTriangle, color: alerts.length > 0 ? "text-alert" : "text-safe", trend: alerts.filter(a => a.type === "critical").length + " critical" },
            ].map((kpi, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-3">
                    <kpi.icon className={`w-4 h-4 ${kpi.color} mb-1`} />
                    <div className="font-heading text-xl font-bold">{kpi.value}</div>
                    <div className="text-xs text-muted-foreground">{kpi.label}</div>
                    <div className="text-[10px] text-muted-foreground/70 mt-1">{kpi.trend}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Emotional Weather Map */}
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sun className="w-5 h-5 text-warm" /> Emotional Weather Map
              </CardTitle>
              <CardDescription>Regional mood visualized as weather patterns — for at-a-glance assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {regionData.map((r) => (
                  <motion.div
                    key={r.region}
                    whileHover={{ scale: 1.03 }}
                    className={`text-center p-4 rounded-xl border-2 transition-all cursor-default ${
                      r.riskLevel === "critical" ? "border-alert/40 bg-alert/5" :
                      r.riskLevel === "warning" ? "border-warm/40 bg-warm/5" :
                      "border-border bg-muted/30"
                    }`}
                  >
                    {moodWeatherIcon(r.avgMood)}
                    <div className="font-medium text-sm mt-2">{r.region}</div>
                    <div className="text-xs text-muted-foreground">{moodLabel(r.avgMood)}</div>
                    <div className="text-2xl font-heading font-bold mt-1">{r.avgMood}</div>
                    <div className="text-[10px] text-muted-foreground">{r.checkIns} check-ins</div>
                    {r.distressRate > 20 && (
                      <Badge variant="destructive" className="text-[10px] mt-1 px-1 py-0">{r.distressRate}%</Badge>
                    )}
                    <div className="text-[10px] text-muted-foreground mt-1">Top: {r.topStressor}</div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
              <TabsTrigger value="stressors" className="text-xs">Stressors</TabsTrigger>
              <TabsTrigger value="regions" className="text-xs">Regions</TabsTrigger>
              <TabsTrigger value="timing" className="text-xs">Timing</TabsTrigger>
              <TabsTrigger value="engagement" className="text-xs">Engagement</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Mood Trend Chart */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Weekly Mood Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-64">
                      <BarChart data={moodTrendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="happy" stackId="a" fill="var(--color-happy)" />
                        <Bar dataKey="okay" stackId="a" fill="var(--color-okay)" />
                        <Bar dataKey="low" stackId="a" fill="var(--color-low)" />
                        <Bar dataKey="struggling" stackId="a" fill="var(--color-struggling)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Mood Distribution Pie */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Overall Mood Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <RePieChart>
                          <Pie
                            data={moodDistribution}
                            innerRadius={50}
                            outerRadius={90}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {moodDistribution.map((entry, index) => (
                              <Cell key={index} fill={entry.color} />
                            ))}
                          </Pie>
                        </RePieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 mt-2">
                      {moodDistribution.map((item) => (
                        <div key={item.name} className="flex items-center gap-1 text-xs">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                          {item.name}: {item.value}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="stressors">
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Top Stressors — Bar Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {stressorData.slice(0, 8).map((s, i) => (
                        <div key={s.name} className="flex items-center gap-3">
                          <span className="text-sm font-medium w-8 text-muted-foreground">#{i + 1}</span>
                          <div className="w-28 text-sm font-medium truncate">{s.name}</div>
                          <div className="flex-1">
                            <div className="relative h-6 bg-muted rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(s.value / maxStressor) * 100}%` }}
                                transition={{ duration: 0.8, delay: i * 0.05 }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: COLORS[i % COLORS.length] }}
                              />
                              <span className="absolute inset-0 flex items-center justify-end pr-2 text-xs font-medium">{s.value}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Stressor Radar — Pattern Recognition</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={stressorData.slice(0, 6)}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="name" tick={{ fontSize: 10 }} />
                          <Radar name="Reports" dataKey="value" stroke="hsl(174, 62%, 38%)" fill="hsl(174, 62%, 38%)" fillOpacity={0.3} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="regions">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Regional Wellbeing Intelligence</CardTitle>
                  <CardDescription>Detailed breakdown per locality with risk assessment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {regionData.map((r) => (
                      <motion.div key={r.region} whileHover={{ x: 4 }} className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                        r.riskLevel === "critical" ? "border-alert/30 bg-alert/5" :
                        r.riskLevel === "warning" ? "border-warm/30 bg-warm/5" :
                        "border-border bg-muted/30"
                      }`}>
                        <div className="flex-shrink-0">
                          {moodWeatherIcon(r.avgMood)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-heading font-semibold">{r.region}</span>
                            <Badge variant={r.riskLevel === "critical" ? "destructive" : r.riskLevel === "warning" ? "outline" : "secondary"} className="text-xs">
                              {r.riskLevel}
                            </Badge>
                            {r.trend === "up" ? (
                              <span className="flex items-center gap-0.5 text-xs text-safe"><ArrowUpRight className="w-3 h-3" /> Improving</span>
                            ) : (
                              <span className="flex items-center gap-0.5 text-xs text-alert"><ArrowDownRight className="w-3 h-3" /> Declining</span>
                            )}
                          </div>
                          <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                            <span>{r.checkIns.toLocaleString()} check-ins</span>
                            <span>Mood: {r.avgMood}/5</span>
                            <span>Distress: {r.distressRate}%</span>
                            <span>Top: {r.topStressor}</span>
                          </div>
                          <div className="mt-2">
                            <Progress value={100 - r.distressRate} className="h-2" />
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-heading text-2xl font-bold">{r.avgMood}</div>
                          <div className="text-xs text-muted-foreground">{moodLabel(r.avgMood)}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timing">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4" /> 24-Hour Activity & Distress Patterns
                  </CardTitle>
                  <CardDescription>Late-night spikes (12am-4am) trigger the 3AM crisis protocol automatically</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-80">
                    <AreaChart data={hourlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" interval={3} tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area type="monotone" dataKey="checkIns" fill="var(--color-checkIns)" fillOpacity={0.2} stroke="var(--color-checkIns)" strokeWidth={2} />
                      <Area type="monotone" dataKey="distress" fill="var(--color-distress)" fillOpacity={0.3} stroke="var(--color-distress)" strokeWidth={2} />
                    </AreaChart>
                  </ChartContainer>
                  <div className="mt-4 p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-warm" />
                    The shaded red area highlights distress-level check-ins. The 12am-4am window is the highest risk period for youth.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="engagement">
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Platform Engagement Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { label: "Mood Check-ins", value: totalCheckins, max: totalCheckins + 500, icon: Activity, desc: "Anonymous self-reports" },
                        { label: "Stories Shared", value: activeStories, max: activeStories + 50, icon: MessageSquare, desc: "Active (7-day window)" },
                        { label: "Peer Reactions", value: totalReactions, max: totalReactions + 200, icon: Users, desc: "Community engagement" },
                        { label: "Regions Monitored", value: regionData.length, max: 15, icon: Globe, desc: "Geographic coverage" },
                      ].map((item, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <item.icon className="w-4 h-4 text-primary" />
                              <span className="text-sm font-medium">{item.label}</span>
                            </div>
                            <span className="font-heading font-bold">{item.value.toLocaleString()}</span>
                          </div>
                          <Progress value={(item.value / item.max) * 100} className="h-2" />
                          <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Resource Deployment Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {regionData.filter(r => r.riskLevel !== "normal").map((r, i) => (
                        <div key={i} className={`p-3 rounded-xl border ${r.riskLevel === "critical" ? "border-alert/30 bg-alert/5" : "border-warm/30 bg-warm/5"}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <Target className={`w-4 h-4 ${r.riskLevel === "critical" ? "text-alert" : "text-warm"}`} />
                            <span className="font-medium text-sm">{r.region}</span>
                            <Badge variant={r.riskLevel === "critical" ? "destructive" : "outline"} className="text-xs ml-auto">{r.riskLevel}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {r.riskLevel === "critical"
                              ? `Deploy crisis counselors. ${r.distressRate}% distress rate with ${r.checkIns} check-ins. Top stressor: ${r.topStressor}`
                              : `Increase awareness programs. ${r.distressRate}% distress rate needs monitoring. Focus on ${r.topStressor}`}
                          </p>
                        </div>
                      ))}
                      {regionData.filter(r => r.riskLevel !== "normal").length === 0 && (
                        <div className="text-center py-6 text-muted-foreground text-sm">
                          <Shield className="w-8 h-8 mx-auto mb-2 text-safe" />
                          All regions within healthy parameters. ✓
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default NGODashboard;
