import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Mic, Send, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const sampleStories = [
  {
    id: 1,
    avatar: "🌊",
    name: "Anonymous Wave",
    time: "2 hours ago",
    content: "My parents keep comparing me to my cousin who got into IIT. I know they mean well but it makes me feel like nothing I do is ever enough. Does anyone else feel this way?",
    reactions: { "❤️": 24, "🫂": 18, "💪": 12 },
    replies: 7,
    tags: ["Family", "Academics"],
    expiresIn: "5 days",
  },
  {
    id: 2,
    avatar: "🌸",
    name: "Anonymous Blossom",
    time: "5 hours ago",
    content: "I finally told my best friend about my anxiety and she didn't judge me at all. She said she feels the same way sometimes. If you're scared to talk to someone — try. You might be surprised.",
    reactions: { "❤️": 45, "🎉": 22, "🫂": 15 },
    replies: 12,
    tags: ["Friendship", "Anxiety"],
    expiresIn: "4 days",
    isVoice: true,
  },
  {
    id: 3,
    avatar: "🌙",
    name: "Anonymous Moon",
    time: "1 day ago",
    content: "I can't sleep most nights. My mind just races about boards, entrance exams, what if I don't get a good college. I'm 16 and I'm already exhausted. When does it get easier?",
    reactions: { "❤️": 56, "🫂": 34, "💪": 20 },
    replies: 18,
    tags: ["Sleep", "Academic Pressure"],
    expiresIn: "3 days",
  },
  {
    id: 4,
    avatar: "🦋",
    name: "Anonymous Butterfly",
    time: "2 days ago",
    content: "Started doing 5-minute breathing exercises before exams. Thought it was silly at first but honestly it helps so much. My hands stop shaking. Sharing this because maybe it'll help someone else too.",
    reactions: { "❤️": 67, "🎉": 30, "💪": 42 },
    replies: 23,
    tags: ["Coping", "Exams"],
    expiresIn: "2 days",
  },
];

const reactionEmojis = ["❤️", "🫂", "💪", "🎉", "😢"];

const StoryCircles = () => {
  const [newStory, setNewStory] = useState("");
  const [showCompose, setShowCompose] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = [...new Set(sampleStories.flatMap((s) => s.tags))];

  const filteredStories = selectedTag
    ? sampleStories.filter((s) => s.tags.includes(selectedTag))
    : sampleStories;

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-heading text-3xl md:text-4xl font-bold">Story Circles</h1>
            <Badge variant="outline" className="gap-1">
              <Shield className="w-3 h-3" /> Anonymous
            </Badge>
          </div>
          <p className="text-muted-foreground mb-8">
            Share your story. Voice notes disappear after 7 days. Peers respond when they're ready.
          </p>

          {/* Compose */}
          <Card className="mb-8 border-primary/20">
            <CardContent className="p-4">
              {showCompose ? (
                <div className="space-y-3">
                  <Textarea
                    placeholder="What's on your mind? Share anonymously..."
                    value={newStory}
                    onChange={(e) => setNewStory(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Mic className="w-4 h-4" /> Voice Note
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setShowCompose(false)}>Cancel</Button>
                      <Button size="sm" className="gap-1">
                        <Send className="w-4 h-4" /> Share Story
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowCompose(true)}
                  className="w-full text-left text-muted-foreground p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  Share what's on your mind... 💭
                </button>
              )}
            </CardContent>
          </Card>

          {/* Tags filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge
              variant={selectedTag === null ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedTag(null)}
            >
              All Stories
            </Badge>
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* Stories */}
          <div className="space-y-4">
            {filteredStories.map((story, i) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="text-lg bg-muted">{story.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm">{story.name}</span>
                          <span className="text-xs text-muted-foreground">{story.time}</span>
                          {story.isVoice && (
                            <Badge variant="outline" className="text-xs gap-1">
                              <Mic className="w-3 h-3" /> Voice
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-1 mt-1">
                          {story.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm leading-relaxed mb-4">{story.content}</p>

                    {story.isVoice && (
                      <div className="bg-muted rounded-xl p-3 mb-4 flex items-center gap-3">
                        <Button variant="ghost" size="icon" className="rounded-full w-8 h-8">
                          ▶️
                        </Button>
                        <div className="flex-1 h-6 flex items-center gap-0.5">
                          {Array.from({ length: 30 }).map((_, j) => (
                            <div
                              key={j}
                              className="w-1 bg-primary/40 rounded-full"
                              style={{ height: `${Math.random() * 20 + 4}px` }}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">1:24</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {reactionEmojis.map((emoji) => (
                          <button
                            key={emoji}
                            className="px-2 py-1 rounded-full text-sm hover:bg-muted transition-colors"
                          >
                            {emoji}{" "}
                            <span className="text-xs text-muted-foreground">
                              {story.reactions[emoji as keyof typeof story.reactions] || ""}
                            </span>
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" /> {story.replies}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {story.expiresIn}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StoryCircles;
