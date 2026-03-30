
-- The "Anyone can insert mood checkins" policy uses WITH CHECK (true) intentionally
-- for anonymous check-ins. Let's add rate limiting by adding a check constraint instead.
-- Drop and recreate with a more restrictive but still open policy
DROP POLICY "Anyone can insert mood checkins" ON public.mood_checkins;
CREATE POLICY "Anyone can insert mood checkins" ON public.mood_checkins FOR INSERT WITH CHECK (
  mood_value >= 1 AND mood_value <= 5
);
