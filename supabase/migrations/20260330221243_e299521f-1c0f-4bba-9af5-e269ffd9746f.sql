
-- Enum for user roles
CREATE TYPE public.app_role AS ENUM ('user', 'ngo_admin', 'peer_leader');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_emoji TEXT DEFAULT '😊',
  locality TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- User roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert roles" ON public.user_roles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Mood checkins table
CREATE TABLE public.mood_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  mood_value INTEGER NOT NULL CHECK (mood_value BETWEEN 1 AND 5),
  stressors TEXT[] DEFAULT '{}',
  journal_text TEXT,
  locality TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.mood_checkins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert mood checkins" ON public.mood_checkins FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own checkins" ON public.mood_checkins FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "NGO admins can view all checkins" ON public.mood_checkins FOR SELECT USING (public.has_role(auth.uid(), 'ngo_admin'));

-- Stories table
CREATE TABLE public.stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  anonymous_name TEXT NOT NULL,
  anonymous_avatar TEXT NOT NULL DEFAULT '🌿',
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_voice BOOLEAN DEFAULT false,
  voice_url TEXT,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '7 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone authed can view non-expired stories" ON public.stories FOR SELECT USING (expires_at > now());
CREATE POLICY "Users can insert stories" ON public.stories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own stories" ON public.stories FOR DELETE USING (auth.uid() = user_id);

-- Story reactions
CREATE TABLE public.story_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(story_id, user_id, emoji)
);
ALTER TABLE public.story_reactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone authed can view reactions" ON public.story_reactions FOR SELECT USING (true);
CREATE POLICY "Users can insert reactions" ON public.story_reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own reactions" ON public.story_reactions FOR DELETE USING (auth.uid() = user_id);

-- Story replies
CREATE TABLE public.story_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.story_replies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone authed can view replies" ON public.story_replies FOR SELECT USING (true);
CREATE POLICY "Users can insert replies" ON public.story_replies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own replies" ON public.story_replies FOR DELETE USING (auth.uid() = user_id);

-- Streaks table
CREATE TABLE public.streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  total_checkins INTEGER NOT NULL DEFAULT 0,
  last_checkin_date DATE,
  xp_points INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1
);
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own streaks" ON public.streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own streaks" ON public.streaks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own streaks" ON public.streaks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "View leaderboard" ON public.streaks FOR SELECT USING (true);

-- Badges earned
CREATE TABLE public.badges_earned (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_key TEXT NOT NULL,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_key)
);
ALTER TABLE public.badges_earned ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own badges" ON public.badges_earned FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own badges" ON public.badges_earned FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Quests
CREATE TABLE public.quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  xp_reward INTEGER NOT NULL DEFAULT 10,
  quest_type TEXT NOT NULL DEFAULT 'daily',
  target_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view quests" ON public.quests FOR SELECT USING (true);

-- User quests progress
CREATE TABLE public.user_quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_id UUID NOT NULL REFERENCES public.quests(id) ON DELETE CASCADE,
  progress INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, quest_id)
);
ALTER TABLE public.user_quests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own quest progress" ON public.user_quests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quest progress" ON public.user_quests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own quest progress" ON public.user_quests FOR UPDATE USING (auth.uid() = user_id);

-- Trigger to auto-create profile + streak + default role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', 'Anonymous'));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  INSERT INTO public.streaks (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Storage bucket for voice notes
INSERT INTO storage.buckets (id, name, public) VALUES ('voice_notes', 'voice_notes', true);
CREATE POLICY "Anyone can view voice notes" ON storage.objects FOR SELECT USING (bucket_id = 'voice_notes');
CREATE POLICY "Authenticated users can upload voice notes" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'voice_notes' AND auth.role() = 'authenticated');

-- Timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_mood_checkins_locality ON public.mood_checkins(locality);
CREATE INDEX idx_mood_checkins_created ON public.mood_checkins(created_at);
CREATE INDEX idx_mood_checkins_mood ON public.mood_checkins(mood_value);
CREATE INDEX idx_stories_expires ON public.stories(expires_at);
CREATE INDEX idx_story_reactions_story ON public.story_reactions(story_id);
CREATE INDEX idx_streaks_xp ON public.streaks(xp_points DESC);

-- Insert default quests
INSERT INTO public.quests (title, description, xp_reward, quest_type, target_count) VALUES
('First Check-in', 'Complete your first mood check-in', 20, 'one_time', 1),
('3-Day Streak', 'Check in 3 days in a row', 50, 'milestone', 3),
('7-Day Streak', 'Check in 7 days in a row', 100, 'milestone', 7),
('Story Teller', 'Share your first story', 25, 'one_time', 1),
('Supportive Friend', 'React to 5 stories', 30, 'cumulative', 5),
('Weekly Warrior', 'Check in every day this week', 75, 'weekly', 7),
('Voice Note Pioneer', 'Share a voice note story', 35, 'one_time', 1),
('Community Builder', 'Reply to 3 stories', 40, 'cumulative', 3),
('Mood Master', 'Complete 30 check-ins', 150, 'cumulative', 30),
('30-Day Legend', 'Maintain a 30-day streak', 300, 'milestone', 30);
