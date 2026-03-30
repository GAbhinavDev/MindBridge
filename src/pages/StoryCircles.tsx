import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Mic, MicOff, Send, Clock, Shield, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const reactionEmojis = ["❤️", "🫂", "💪", "🎉", "😢"];
const anonymousNames = ["Wave", "Blossom", "Moon", "Butterfly", "Star", "Cloud", "River", "Leaf", "Breeze", "Rain"];
const anonymousAvatars = ["🌊", "🌸", "🌙", "🦋", "⭐", "☁️", "🌿", "🍃", "💨", "🌧️"];

interface Story {
  id: string;
  anonymous_name: string;
  anonymous_avatar: string;
  content: string;
  tags: string[];
  is_voice: boolean;
  voice_url: string | null;
  created_at: string;
  expires_at: string;
  reactions: Record<string, number>;
  reply_count: number;
}

interface StoryReply {
  id: string;
  content: string;
  created_at: string;
}

const StoryCircles = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [newStory, setNewStory] = useState("");
  const [showCompose, setShowCompose] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<string | null>(null);
  const [replies, setReplies] = useState<Record<string, StoryReply[]>>({});
  const [replyText, setReplyText] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  const allTagOptions = ["Academics", "Family", "Anxiety", "Friendship", "Sleep", "Exams", "Coping", "Relationships"];

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    setIsLoading(true);
    const { data: storiesData } = await supabase
      .from("stories")
      .select("*")
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false });

    if (storiesData) {
      const storiesWithReactions = await Promise.all(
        storiesData.map(async (story) => {
          const { data: reactionsData } = await supabase
            .from("story_reactions")
            .select("emoji")
            .eq("story_id", story.id);

          const reactions: Record<string, number> = {};
          reactionsData?.forEach((r) => {
            reactions[r.emoji] = (reactions[r.emoji] || 0) + 1;
          });

          const { count } = await supabase
            .from("story_replies")
            .select("*", { count: "exact", head: true })
            .eq("story_id", story.id);

          return { ...story, reactions, reply_count: count || 0, tags: story.tags || [] };
        })
      );
      setStories(storiesWithReactions);
    }
    setIsLoading(false);
  };

  const handleReact = async (storyId: string, emoji: string) => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to react to stories.", variant: "destructive" });
      return;
    }
    try {
      const { data: existing } = await supabase
        .from("story_reactions")
        .select("id")
        .eq("story_id", storyId)
        .eq("user_id", user.id)
        .eq("emoji", emoji)
        .maybeSingle();

      if (existing) {
        await supabase.from("story_reactions").delete().eq("id", existing.id);
      } else {
        await supabase.from("story_reactions").insert({ story_id: storyId, user_id: user.id, emoji });
      }
      fetchStories();
    } catch (e) {
      console.error(e);
    }
  };

  const submitStory = async () => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to share stories.", variant: "destructive" });
      return;
    }
    if (!newStory.trim()) return;

    const idx = Math.floor(Math.random() * anonymousNames.length);
    const { error } = await supabase.from("stories").insert({
      user_id: user.id,
      anonymous_name: `Anonymous ${anonymousNames[idx]}`,
      anonymous_avatar: anonymousAvatars[idx],
      content: newStory.trim(),
      tags: selectedTags,
    });

    if (error) {
      toast({ title: "Error", description: "Failed to share story.", variant: "destructive" });
    } else {
      toast({ title: "Story shared 💚", description: "Your anonymous story is now visible to the community." });
      setNewStory("");
      setShowCompose(false);
      setSelectedTags([]);
      fetchStories();
    }
  };

  const loadReplies = async (storyId: string) => {
    if (expandedReplies === storyId) {
      setExpandedReplies(null);
      return;
    }
    const { data } = await supabase
      .from("story_replies")
      .select("id, content, created_at")
      .eq("story_id", storyId)
      .order("created_at", { ascending: true });

    if (data) {
      setReplies((prev) => ({ ...prev, [storyId]: data }));
    }
    setExpandedReplies(storyId);
  };

  const submitReply = async (storyId: string) => {
    if (!user || !replyText.trim()) return;
    await supabase.from("story_replies").insert({
      story_id: storyId,
      user_id: user.id,
      content: replyText.trim(),
    });
    setReplyText("");
    loadReplies(storyId);
    fetchStories();
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        if (!user) return;
        const filename = `${user.id}/${Date.now()}.webm`;
        const { error: uploadError } = await supabase.storage.from("voice_notes").upload(filename, blob);
        if (uploadError) {
          toast({ title: "Upload failed", variant: "destructive" });
          return;
        }
        const { data: urlData } = supabase.storage.from("voice_notes").getPublicUrl(filename);
        const idx = Math.floor(Math.random() * anonymousNames.length);
        await supabase.from("stories").insert({
          user_id: user.id,
          anonymous_name: `Anonymous ${anonymousNames[idx]}`,
          anonymous_avatar: anonymousAvatars[idx],
          content: "🎙️ Voice note shared",
          tags: selectedTags,
          is_voice: true,
          voice_url: urlData.publicUrl,
        });
        toast({ title: "Voice note shared! 🎙️" });
        fetchStories();
        stream.getTracks().forEach((t) => t.stop());
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (e) {
      toast({ title: "Microphone access denied", variant: "destructive" });
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const getTimeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const getDaysLeft = (date: string) => {
    const diff = new Date(date).getTime() - Date.now();
    return `${Math.max(0, Math.ceil(diff / 86400000))}d left`;
  };

  const filteredStories = selectedTag
    ? stories.filter((s) => s.tags.includes(selectedTag))
    : stories;

  const allTags = [...new Set(stories.flatMap((s) => s.tags))];

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-heading text-3xl md:text-4xl font-bold">Story Circles</h1>
            <Badge variant="outline" className="gap-1"><Shield className="w-3 h-3" /> Anonymous</Badge>
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
                  <div className="flex flex-wrap gap-1">
                    {allTagOptions.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer text-xs"
                        onClick={() => setSelectedTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag])}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      onClick={isRecording ? stopRecording : startRecording}
                    >
                      {isRecording ? <><MicOff className="w-4 h-4 text-alert" /> Stop Recording</> : <><Mic className="w-4 h-4" /> Voice Note</>}
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setShowCompose(false)}>Cancel</Button>
                      <Button size="sm" className="gap-1" onClick={submitStory} disabled={!newStory.trim()}>
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
            <Badge variant={selectedTag === null ? "default" : "outline"} className="cursor-pointer" onClick={() => setSelectedTag(null)}>
              All Stories
            </Badge>
            {allTags.map((tag) => (
              <Badge key={tag} variant={selectedTag === tag ? "default" : "outline"} className="cursor-pointer" onClick={() => setSelectedTag(tag)}>
                {tag}
              </Badge>
            ))}
          </div>

          {/* Stories */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading stories...</p>
            </div>
          ) : filteredStories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No stories yet. Be the first to share! 💚</p>
              <Button onClick={() => setShowCompose(true)} className="gap-2">
                <Plus className="w-4 h-4" /> Share Your Story
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredStories.map((story, i) => (
                <motion.div key={story.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3 mb-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="text-lg bg-muted">{story.anonymous_avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-sm">{story.anonymous_name}</span>
                            <span className="text-xs text-muted-foreground">{getTimeAgo(story.created_at)}</span>
                            {story.is_voice && (
                              <Badge variant="outline" className="text-xs gap-1"><Mic className="w-3 h-3" /> Voice</Badge>
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

                      {story.is_voice && story.voice_url && (
                        <div className="bg-muted rounded-xl p-3 mb-4">
                          <audio controls className="w-full h-8" src={story.voice_url} />
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                          {reactionEmojis.map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => handleReact(story.id, emoji)}
                              className="px-2 py-1 rounded-full text-sm hover:bg-muted transition-colors"
                            >
                              {emoji} <span className="text-xs text-muted-foreground">{story.reactions[emoji] || ""}</span>
                            </button>
                          ))}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <button onClick={() => loadReplies(story.id)} className="flex items-center gap-1 hover:text-foreground">
                            <MessageCircle className="w-3 h-3" /> {story.reply_count}
                          </button>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {getDaysLeft(story.expires_at)}
                          </span>
                        </div>
                      </div>

                      {/* Replies */}
                      <AnimatePresence>
                        {expandedReplies === story.id && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <div className="mt-4 pt-4 border-t border-border space-y-2">
                              {(replies[story.id] || []).map((reply) => (
                                <div key={reply.id} className="bg-muted/50 rounded-lg p-3 text-sm">
                                  <p>{reply.content}</p>
                                  <span className="text-xs text-muted-foreground">{getTimeAgo(reply.created_at)}</span>
                                </div>
                              ))}
                              {user && (
                                <div className="flex gap-2">
                                  <Input
                                    value={replyText}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReplyText(e.target.value)}
                                    placeholder="Write a supportive reply..."
                                    className="flex-1 text-sm"
                                  />
                                  <Button size="sm" onClick={() => submitReply(story.id)} disabled={!replyText.trim()}>
                                    <Send className="w-3 h-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

// Need Input import
import { Input } from "@/components/ui/input";

export default StoryCircles;
