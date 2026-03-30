import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, TrendingDown, AlertTriangle, Users, MapPin, Clock, Shield, Activity, Download, Sun, Cloud, CloudRain, CloudLightning } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const chartConfig = {
  happy: { label: "Happy", color: "hsl(145, 55%, 45%)" },
  okay: { label: "Okay", color: "hsl(174, 62%, 38%)" },
  low: { label: "Low", color: "hsl(36, 90%, 62%)" },
  struggling: { label: "Struggling", color: "hsl(0, 72%, 55%)" },
  checkIns: { label: "Check-ins", color: "hsl(174, 62%, 38%)" },
  distress: { label: "Distress", color: "hsl(0, 72%, 55%)" },
};

const moodWeatherIcon = (avgMood: number) => {
  if (avgMood >= 4) return <Sun className="w-6 h-6 text-safe" />;
  if (avgMood >= 3) return <Cloud className="w-6 h-6 text-warm" />;
  if (avgMood >= 2) return <CloudRain className="w-6 h-6 text-gentle" />;
  return <CloudLightning className="w-6 h-6 text-alert" />;
};

const Dashboard = () => {
  const { user, isNGOAdmin } = useAuth();
  const [totalCheckins, setTotalCheckins] = useState(0);
  const [avgMood, setAvgMood] = useState(0);
  const [regionData, setRegionData] = useState<any[]>([]);
  const [stressorData, setStressorData] = useState<any[]>([]);
  const [moodTrendData, setMoodTrendData] = useState<any[]>([]);
  const [hourlyData, setHourlyData] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [activeStories, setActiveStories] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);

    // Fetch all checkins
    const { data: checkins } = await supabase.from("mood_checkins").select("*");

    if (checkins && checkins.length > 0) {
      setTotalCheckins(checkins.length);
      const avg = checkins.reduce((sum, c) => sum + c.mood_value, 0) / checkins.length;
      setAvgMood(Math.round(avg * 10) / 10);

      // Region data
      const byRegion: Record<string, { total: number; moodSum: number; struggling: number }> = {};
      checkins.forEach((c) => {
        const loc = c.locality || "Unknown";
        if (!byRegion[loc]) byRegion[loc] = { total: 0, moodSum: 0, struggling: 0 };
        byRegion[loc].total++;
        byRegion[loc].moodSum += c.mood_value;
        if (c.mood_value <= 2) byRegion[loc].struggling++;
      });
      const regions = Object.entries(byRegion).map(([region, data]) => ({
        region,
        checkIns: data.total,
        avgMood: Math.round((data.moodSum / data.total) * 10) / 10,
        distressRate: Math.round((data.struggling / data.total) * 100),
        trend: data.moodSum / data.total >= 3 ? "up" : "down",
      })).sort((a, b) => b.checkIns - a.checkIns);
      setRegionData(regions);

      // Alerts from regions with high distress
      const newAlerts = regions
        .filter((r) => r.distressRate > 20)
        .map((r, i) => ({
          id: i,
          type: r.distressRate > 40 ? "critical" : "warning",
          region: r.region,
          message: `${r.distressRate}% distress rate detected — ${r.checkIns} check-ins analyzed`,
          time: "Live",
        }));
      setAlerts(newAlerts);

      // Stressor data
      const stressorCounts: Record<string, number> = {};
      checkins.forEach((c) => {
        (c.stressors || []).forEach((s: string) => {
          stressorCounts[s] = (stressorCounts[s] || 0) + 1;
        });
      });
      const stressors = Object.entries(stressorCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8);
      setStressorData(stressors);

      // Mood trends by day
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const byDay: Record<string, { happy: number; okay: number; low: number; struggling: number }> = {};
      dayNames.forEach((d) => (byDay[d] = { happy: 0, okay: 0, low: 0, struggling: 0 }));
      checkins.forEach((c) => {
        const day = dayNames[new Date(c.created_at).getDay()];
        if (c.mood_value >= 4) byDay[day].happy++;
        else if (c.mood_value === 3) byDay[day].okay++;
        else if (c.mood_value === 2) byDay[day].low++;
        else byDay[day].struggling++;
      });
      setMoodTrendData(dayNames.slice(1).concat(dayNames.slice(0, 1)).map((d) => ({ day: d, ...byDay[d] })));

      // Hourly data
      const byHour: Record<number, { checkIns: number; distress: number }> = {};
      for (let i = 0; i < 24; i++) byHour[i] = { checkIns: 0, distress: 0 };
      checkins.forEach((c) => {
        const hour = new Date(c.created_at).getHours();
        byHour[hour].checkIns++;
        if (c.mood_value <= 2) byHour[hour].distress++;
      });
      setHourlyData(Array.from({ length: 24 }, (_, i) => ({ hour: `${i}:00`, ...byHour[i] })));
    } else {
      // Demo data when no real data
      setTotalCheckins(0);
      setAvgMood(0);
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
        { name: "📚 Academics", value: 340 },
        { name: "👨‍👩‍👧 Family", value: 210 },
        { name: "📱 Social Media", value: 180 },
        { name: "💤 Sleep", value: 150 },
        { name: "❤️ Relationships", value: 120 },
      ]);
      setRegionData([
        { region: "Delhi NCR", checkIns: 1240, avgMood: 3.2, distressRate: 30, trend: "down" },
        { region: "Mumbai", checkIns: 980, avgMood: 3.5, distressRate: 18, trend: "up" },
        { region: "Bengaluru", checkIns: 820, avgMood: 3.8, distressRate: 12, trend: "up" },
        { region: "Chennai", checkIns: 650, avgMood: 3.1, distressRate: 35, trend: "down" },
        { region: "Kolkata", checkIns: 420, avgMood: 2.9, distressRate: 42, trend: "down" },
      ]);
      setAlerts([
        { id: 1, type: "critical", region: "Kolkata", message: "42% distress rate — immediate attention needed", time: "Demo" },
        { id: 2, type: "warning", region: "Chennai", message: "35% distress rate trending upward", time: "Demo" },
      ]);
      setHourlyData(Array.from({ length: 24 }, (_, i) => ({
        hour: `${i}:00`,
        checkIns: i >= 22 || i <= 5 ? Math.floor(Math.random() * 30 + 20) : Math.floor(Math.random() * 80 + 40),
        distress: i >= 0 && i <= 4 ? Math.floor(Math.random() * 15 + 10) : Math.floor(Math.random() * 8 + 2),
      })));
    }

    const { count: storyCount } = await supabase
      .from("stories")
      .select("*", { count: "exact", head: true })
      .gt("expires_at", new Date().toISOString());
    setActiveStories(storyCount || 0);

    setIsLoading(false);
  };

  const exportCSV = () => {
    const header = "Region,CheckIns,AvgMood,DistressRate\n";
    const rows = regionData.map((r) => `${r.region},${r.checkIns},${r.avgMood},${r.distressRate}%`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mana-wellbeing-report.csv";
    a.click();
  };

  const maxStressor = stressorData.length > 0 ? Math.max(...stressorData.map((s) => s.value)) : 1;

  return (
    <div className="min-h-screen pt-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="font-heading text-3xl font-bold">NGO Intelligence Dashboard</h1>
                <Badge className="bg-safe text-white">Live</Badge>
              </div>
              <p className="text-muted-foreground">Anonymized youth wellbeing data • Real-time aggregation</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportCSV} className="gap-2">
                <Download className="w-4 h-4" /> Export CSV
              </Button>
              <Badge variant="outline" className="gap-1 py-2 px-4">
                <Shield className="w-4 h-4" /> Zero personal data
              </Badge>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Check-ins", value: totalCheckins.toLocaleString(), icon: Activity, color: "text-primary" },
              { label: "Active Regions", value: regionData.length.toString(), icon: MapPin, color: "text-warm" },
              { label: "Avg Mood Score", value: avgMood ? `${avgMood}/5` : "—", icon: TrendingUp, color: avgMood >= 3 ? "text-safe" : "text-alert" },
              { label: "Active Stories", value: activeStories.toString(), icon: Users, color: "text-gentle" },
            ].map((kpi, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                    </div>
                    <div className="font-heading text-2xl font-bold">{kpi.value}</div>
                    <div className="text-xs text-muted-foreground">{kpi.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Alerts */}
          {alerts.length > 0 && (
            <Card className="mb-8 border-alert/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-alert" /> Early Warning Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`flex items-start gap-3 p-3 rounded-lg ${
                      alert.type === "critical" ? "bg-alert/10" : "bg-warm/10"
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full mt-2 ${alert.type === "critical" ? "bg-alert" : "bg-warm"}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{alert.region}</Badge>
                        <span className="text-xs text-muted-foreground">{alert.time}</span>
                      </div>
                      <p className="text-sm mt-1">{alert.message}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Mood Weather Map */}
          <Card className="mb-8">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sun className="w-5 h-5 text-warm" /> Emotional Weather Map
              </CardTitle>
              <CardDescription>Regional mood as weather patterns — for at-a-glance assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {regionData.map((r) => (
                  <div key={r.region} className="text-center p-4 rounded-xl bg-muted/50 border border-border">
                    {moodWeatherIcon(r.avgMood)}
                    <div className="font-medium text-sm mt-2">{r.region}</div>
                    <div className="text-2xl font-heading font-bold">{r.avgMood}</div>
                    <div className="text-xs text-muted-foreground">{r.checkIns} check-ins</div>
                    {r.distressRate > 20 && (
                      <Badge variant="destructive" className="text-xs mt-1">{r.distressRate}% distress</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="mood" className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full max-w-lg">
              <TabsTrigger value="mood">Mood Trends</TabsTrigger>
              <TabsTrigger value="stressors">Stressors</TabsTrigger>
              <TabsTrigger value="regions">Regions</TabsTrigger>
              <TabsTrigger value="timing">Timing</TabsTrigger>
            </TabsList>

            <TabsContent value="mood">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Mood Distribution</CardTitle>
                  <CardDescription>Aggregated anonymous mood data across all regions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-80">
                    <BarChart data={moodTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="happy" stackId="a" fill="var(--color-happy)" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="okay" stackId="a" fill="var(--color-okay)" />
                      <Bar dataKey="low" stackId="a" fill="var(--color-low)" />
                      <Bar dataKey="struggling" stackId="a" fill="var(--color-struggling)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stressors">
              <Card>
                <CardHeader>
                  <CardTitle>Top Stressors Reported</CardTitle>
                  <CardDescription>What's weighing on youth the most</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stressorData.map((s) => (
                      <div key={s.name} className="flex items-center gap-4">
                        <div className="w-32 text-sm font-medium truncate">{s.name}</div>
                        <div className="flex-1">
                          <Progress value={(s.value / maxStressor) * 100} className="h-3" />
                        </div>
                        <div className="w-12 text-right text-sm text-muted-foreground">{s.value}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="regions">
              <Card>
                <CardHeader>
                  <CardTitle>Regional Wellbeing Heatmap</CardTitle>
                  <CardDescription>Mood indicators by locality with distress detection</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {regionData.map((r) => (
                      <div key={r.region} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                        {moodWeatherIcon(r.avgMood)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{r.region}</span>
                            {r.distressRate > 20 && (
                              <Badge variant="destructive" className="text-xs">{r.distressRate}% distress</Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">{r.checkIns.toLocaleString()} check-ins</div>
                        </div>
                        <div className="text-right">
                          <div className="font-heading font-bold">{r.avgMood}</div>
                          <div className="flex items-center gap-1">
                            {r.trend === "up" ? <TrendingUp className="w-3 h-3 text-safe" /> : <TrendingDown className="w-3 h-3 text-alert" />}
                            <span className="text-xs text-muted-foreground">{r.trend}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timing">
              <Card>
                <CardHeader>
                  <CardTitle>24-Hour Check-in & Distress Patterns</CardTitle>
                  <CardDescription>Late-night spikes trigger 3AM crisis protocol</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-80">
                    <AreaChart data={hourlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" interval={3} />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area type="monotone" dataKey="checkIns" fill="var(--color-checkIns)" fillOpacity={0.2} stroke="var(--color-checkIns)" />
                      <Area type="monotone" dataKey="distress" fill="var(--color-distress)" fillOpacity={0.3} stroke="var(--color-distress)" />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
