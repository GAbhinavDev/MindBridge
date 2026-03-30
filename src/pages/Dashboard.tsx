import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, TrendingDown, AlertTriangle, Users, MapPin, Clock, Shield, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, ResponsiveContainer } from "recharts";

const moodTrendData = [
  { day: "Mon", happy: 42, okay: 28, low: 18, struggling: 12 },
  { day: "Tue", happy: 38, okay: 30, low: 20, struggling: 12 },
  { day: "Wed", happy: 35, okay: 25, low: 22, struggling: 18 },
  { day: "Thu", happy: 40, okay: 30, low: 18, struggling: 12 },
  { day: "Fri", happy: 45, okay: 28, low: 17, struggling: 10 },
  { day: "Sat", happy: 50, okay: 25, low: 15, struggling: 10 },
  { day: "Sun", happy: 48, okay: 27, low: 16, struggling: 9 },
];

const stressorData = [
  { name: "Academics", value: 340, fill: "hsl(174, 62%, 38%)" },
  { name: "Family", value: 210, fill: "hsl(36, 90%, 62%)" },
  { name: "Social Media", value: 180, fill: "hsl(280, 45%, 55%)" },
  { name: "Sleep", value: 150, fill: "hsl(0, 72%, 55%)" },
  { name: "Relationships", value: 120, fill: "hsl(145, 55%, 45%)" },
  { name: "Future", value: 100, fill: "hsl(200, 50%, 50%)" },
];

const regionData = [
  { region: "Delhi NCR", checkIns: 1240, avgMood: 3.2, trend: "down", alerts: 3 },
  { region: "Mumbai", checkIns: 980, avgMood: 3.5, trend: "up", alerts: 1 },
  { region: "Bengaluru", checkIns: 820, avgMood: 3.8, trend: "up", alerts: 0 },
  { region: "Chennai", checkIns: 650, avgMood: 3.1, trend: "down", alerts: 4 },
  { region: "Hyderabad", checkIns: 540, avgMood: 3.6, trend: "stable", alerts: 1 },
  { region: "Kolkata", checkIns: 420, avgMood: 2.9, trend: "down", alerts: 5 },
];

const hourlyData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  checkIns: i >= 22 || i <= 5
    ? Math.floor(Math.random() * 30 + 20)
    : i >= 8 && i <= 16
    ? Math.floor(Math.random() * 80 + 40)
    : Math.floor(Math.random() * 50 + 20),
  distress: i >= 0 && i <= 4 ? Math.floor(Math.random() * 15 + 10) : Math.floor(Math.random() * 8 + 2),
}));

const alerts = [
  { id: 1, type: "critical", region: "Kolkata", message: "Distress cluster detected — 23% increase in 'struggling' check-ins this week", time: "2h ago" },
  { id: 2, type: "warning", region: "Chennai", message: "Late-night usage spike: 3x normal between 1-4 AM", time: "5h ago" },
  { id: 3, type: "info", region: "Delhi NCR", message: "Academic stressor trending — exam season correlation detected", time: "1d ago" },
];

const chartConfig = {
  happy: { label: "Happy", color: "hsl(145, 55%, 45%)" },
  okay: { label: "Okay", color: "hsl(174, 62%, 38%)" },
  low: { label: "Low", color: "hsl(36, 90%, 62%)" },
  struggling: { label: "Struggling", color: "hsl(0, 72%, 55%)" },
  checkIns: { label: "Check-ins", color: "hsl(174, 62%, 38%)" },
  distress: { label: "Distress", color: "hsl(0, 72%, 55%)" },
};

const Dashboard = () => {
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
              <p className="text-muted-foreground">Anonymized youth wellbeing data • Updated in real-time</p>
            </div>
            <Badge variant="outline" className="gap-1 py-2 px-4">
              <Shield className="w-4 h-4" /> Zero personal data exposed
            </Badge>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Check-ins", value: "4,650", icon: Activity, change: "+12%", up: true },
              { label: "Active Regions", value: "6", icon: MapPin, change: "+2", up: true },
              { label: "Avg Mood Score", value: "3.4/5", icon: TrendingUp, change: "-0.2", up: false },
              { label: "Active Alerts", value: "14", icon: AlertTriangle, change: "+5", up: false },
            ].map((kpi, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <kpi.icon className="w-5 h-5 text-muted-foreground" />
                      <span className={`text-xs font-medium ${kpi.up ? "text-safe" : "text-alert"}`}>{kpi.change}</span>
                    </div>
                    <div className="font-heading text-2xl font-bold">{kpi.value}</div>
                    <div className="text-xs text-muted-foreground">{kpi.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Alerts */}
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
                    alert.type === "critical" ? "bg-alert/10" : alert.type === "warning" ? "bg-warm/10" : "bg-muted"
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    alert.type === "critical" ? "bg-alert" : alert.type === "warning" ? "bg-warm" : "bg-primary"
                  }`} />
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
                    {stressorData.map((s, i) => (
                      <div key={s.name} className="flex items-center gap-4">
                        <div className="w-24 text-sm font-medium">{s.name}</div>
                        <div className="flex-1">
                          <Progress value={(s.value / 340) * 100} className="h-3" />
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
                  <CardDescription>Mood indicators by locality</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {regionData.map((r) => (
                      <div key={r.region} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{r.region}</span>
                            {r.alerts > 0 && (
                              <Badge variant="destructive" className="text-xs">{r.alerts} alerts</Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">{r.checkIns.toLocaleString()} check-ins</div>
                        </div>
                        <div className="text-right">
                          <div className="font-heading font-bold">{r.avgMood}</div>
                          <div className="flex items-center gap-1">
                            {r.trend === "up" ? (
                              <TrendingUp className="w-3 h-3 text-safe" />
                            ) : r.trend === "down" ? (
                              <TrendingDown className="w-3 h-3 text-alert" />
                            ) : (
                              <span className="text-xs">→</span>
                            )}
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
