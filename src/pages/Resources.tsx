import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ExternalLink, Users, Video, FileText, Headphones, Shield, Award, X, Play, Pause, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

// Full article/guide content
const resourceContent: Record<string, { title: string; type: string; body: string; audioUrl?: string; videoUrl?: string }> = {
  // Self-Help Guides
  "Understanding Anxiety — A Teen's Guide": {
    title: "Understanding Anxiety — A Teen's Guide",
    type: "Article",
    body: `## What Is Anxiety?

Anxiety is your body's natural alarm system. It's that feeling of unease, worry, or fear that can range from mild to severe. Everyone experiences anxiety — it's a normal part of being human. But when it starts controlling your daily life, it's time to understand it better.

### Why Do Teens Experience More Anxiety?

Your brain is still developing, especially the prefrontal cortex (the part that manages emotions and decision-making). This means:
- **Emotional responses feel more intense** than they might for adults
- **Social situations feel high-stakes** because peer acceptance is a core developmental need
- **Academic pressure** creates real physiological stress responses
- **Hormonal changes** amplify emotional reactions

### Types of Anxiety You Might Recognize

1. **Social Anxiety**: Fear of being judged or embarrassed in social settings
2. **Performance Anxiety**: Worry about exams, presentations, or competitions
3. **Generalized Anxiety**: Constant worry about many different things
4. **Separation Anxiety**: Distress when away from home or loved ones

### Quick Coping Strategies

**The 5-4-3-2-1 Technique:**
- 5 things you can SEE
- 4 things you can TOUCH
- 3 things you can HEAR
- 2 things you can SMELL
- 1 thing you can TASTE

**Box Breathing:**
- Breathe in for 4 seconds
- Hold for 4 seconds
- Breathe out for 4 seconds
- Hold for 4 seconds
- Repeat 4 times

### When to Seek Help

If anxiety is stopping you from doing things you enjoy, affecting your sleep, or making school feel impossible — talk to someone. That could be a trusted adult, school counselor, or helpline. You're not "weak" for asking for help. You're being brave.

> "Anxiety is not a sign of weakness. It's a sign that you've been trying to be strong for too long."`,
  },
  "How to Talk to Your Parents About Mental Health": {
    title: "How to Talk to Your Parents About Mental Health",
    type: "Guide",
    body: `## Breaking the Ice

Talking to parents about mental health can feel intimidating. Many Indian parents grew up in a culture where mental health wasn't discussed openly. Here's how to bridge that gap.

### Before the Conversation

1. **Choose the right moment** — Not during an argument or when they're stressed. Pick a calm, private time.
2. **Write down your thoughts** — Having notes helps when emotions run high.
3. **Use "I" statements** — "I've been feeling overwhelmed" instead of "You don't understand me."

### Starting the Conversation

**Opening lines that work:**
- "Maa/Papa, I want to talk about something important to me."
- "I've been feeling [emotion] lately and I think talking about it would help."
- "I learned something about mental health at school and wanted to share it with you."

### Common Parent Reactions & How to Respond

**"It's just a phase"**
→ "I understand it might seem that way. But these feelings have been affecting my [sleep/studies/friendships] for [time period]."

**"We didn't have these problems"**
→ "I know your generation was strong. But times have changed, and I want to be open with you about what I'm going through."

**"What will people say?"**
→ "This is just between us. I'm not asking to broadcast it. I just need your support."

**"Just study harder / pray more"**
→ "I appreciate that advice. But I think talking to a counselor could also help me focus better."

### What If They Don't Understand?

- Give them time. The first conversation plants a seed.
- Share articles or videos they can read on their own.
- Ask another trusted adult (uncle, aunt, teacher) to help bridge the conversation.
- Remember: their reaction is about THEIR understanding, not your worth.

### Resources for Parents
- NIMHANS parent helpline: 080-46110007
- Books: "What Happened to You?" by Bruce Perry
- YouTube: Search "teen mental health for Indian parents"

> "The bravest thing you can do is ask for help. The second bravest is accepting it."`,
  },
  "Exam Stress Survival Kit": {
    title: "Exam Stress Survival Kit",
    type: "Toolkit",
    body: `## Your Exam Stress Survival Kit 🎒

Exams are stressful. But stress doesn't have to control you. Here's your complete toolkit.

### Before Exams

**Study Smart, Not Just Hard:**
- Use the **Pomodoro Technique**: 25 min study → 5 min break → repeat
- **Active recall**: Test yourself instead of re-reading notes
- **Spaced repetition**: Review material over days, not just the night before
- **Teach someone**: Explaining concepts helps you understand them deeply

**Physical Preparation:**
- Sleep 7-8 hours (your brain consolidates memory during sleep!)
- Eat regular meals (your brain uses 20% of your body's energy)
- Exercise 20 minutes daily (releases BDNF, which helps memory)
- Stay hydrated (even mild dehydration affects concentration)

### During Exams

**Morning Routine:**
1. Wake up 1 hour before you need to leave
2. Eat protein-rich breakfast (eggs, daal, nuts)
3. Do 5 minutes of deep breathing
4. Quick review of key points (not new material!)
5. Positive affirmation: "I have prepared. I am ready."

**In the Exam Hall:**
- Read ALL questions first before starting
- Start with questions you're most confident about
- If you blank out: close your eyes, breathe deeply, move to another question
- Watch the clock — allocate time per question

### After Exams

- **Don't post-mortem** with friends immediately — it increases anxiety
- Do something enjoyable as a reward
- If you feel it didn't go well: remind yourself that one exam ≠ your entire future

### Emergency Calm-Down (2 minutes)

1. Place both feet flat on the ground
2. Breathe in through nose for 4 counts
3. Hold for 7 counts
4. Exhale through mouth for 8 counts
5. Repeat 3 times
6. Squeeze and release your fists

### Perspective Check ✓
- Will this matter in 5 years? Usually no.
- What's the WORST realistic outcome? Usually manageable.
- Have I survived stressful things before? Always yes.

> "You are more than a number on a scorecard. Your mental health matters more than any grade."`,
  },
  "Social Media & Self-Worth": {
    title: "Social Media & Self-Worth",
    type: "Article",
    body: `## Social Media vs. Reality

You already know social media isn't "real." But knowing that intellectually doesn't stop the feelings. Let's dig deeper.

### The Comparison Trap

**What you see:** Perfect photos, exciting stories, happy couples, achievement posts
**What's hidden:** Hundreds of deleted photos, editing, bad days, failures, loneliness

**The algorithm is designed to:**
- Show you content that triggers strong emotions (envy, inadequacy, FOMO)
- Keep you scrolling longer
- Make you compare your "behind-the-scenes" to someone's "highlight reel"

### How Social Media Affects Your Brain

- **Dopamine loops**: Likes and comments trigger the same reward pathways as sugar
- **Social comparison**: Happens automatically — you can't "just stop"
- **Sleep disruption**: Blue light + emotional activation = poor sleep
- **Body image**: Even "body positive" content can increase body surveillance

### Practical Steps (Not "Just Delete It")

**The 3-Day Reset:**
- Day 1: Turn off all push notifications
- Day 2: Set a 30-min daily time limit
- Day 3: Unfollow 10 accounts that make you feel bad, follow 5 that inspire you

**The "Before I Post" Check:**
- Am I posting this for myself or for validation?
- Will I care about this post in a week?
- Am I presenting my real self or a performance?

**The "After I Scroll" Check:**
- How do I feel right now compared to before?
- Am I comparing myself to someone?
- Do I want to DO something or just keep scrolling?

### Building Self-Worth Offline

1. **Keep a "wins" journal** — Write 3 things you're proud of each day (small counts!)
2. **Develop a skill** — Something where progress is visible (art, music, cooking, coding)
3. **Help someone** — Acts of service boost self-worth more than any like count
4. **Body appreciation** — List what your body CAN do, not how it looks
5. **Real connections** — One honest conversation > 100 comments

### Remember
- Your worth is not measured in followers
- Taking a break from social media is self-care, not weakness
- The people who matter don't judge you by your feed

> "You are not your Instagram. You are the person who laughs until they cry, who stays up helping a friend, who keeps trying even when it's hard."`,
  },

  // Videos & Audio
  "Body Scan Meditation for Teens": {
    title: "Body Scan Meditation for Teens",
    type: "Audio",
    body: `## Body Scan Meditation — 12 Minutes

This guided body scan will help you release tension and become more aware of how your body feels. Perfect for before sleep or during study breaks.

### How to Do It

1. **Find a comfortable position** — Lie down or sit with your back supported
2. **Close your eyes** and take 3 deep breaths
3. **Start at your feet** — Notice any sensations without trying to change them
4. **Slowly move upward** — Feet → ankles → calves → knees → thighs → hips
5. **Continue through your torso** — Belly → chest → back → shoulders
6. **Move to your arms** — Shoulders → upper arms → elbows → forearms → hands → fingers
7. **Finish with your head** — Neck → jaw → face → scalp

### Script (Read slowly or have someone read to you)

*"Begin by taking a deep breath in... and slowly letting it go. Another breath in... and out. One more, deeper this time... and release.*

*Now bring your attention to your feet. Notice them resting. Maybe you feel warmth, or coolness, or tingling. There's no right or wrong answer. Just notice.*

*Slowly move your attention up to your ankles... your calves. If you notice tension anywhere, imagine breathing into that spot. Letting it soften.*

*Moving to your knees... your thighs. Heavy and relaxed. The chair or bed supporting you completely.*

*Now your belly. Notice it rising and falling with each breath. No need to control it. Just observe.*

*Your chest. Your heartbeat. The steady rhythm that has been with you since before you were born.*

*Your shoulders — where many of us carry stress. Let them drop. Let them be heavy.*

*Down through your arms to your fingertips. Notice any sensation. Warmth, pulsing, stillness.*

*Your neck. Your jaw — let it unclench. Your face — smooth your forehead. Let your eyes rest behind closed lids.*

*Take a moment to feel your whole body at once. Breathing. Present. Alive.*

*When you're ready, wiggle your fingers and toes. Take a deep breath. And gently open your eyes."*

### Benefits of Body Scan
- Reduces physical tension
- Improves sleep quality
- Builds mind-body awareness
- Reduces anxiety and stress
- Takes only 12 minutes

🎧 Press play below to listen to the guided audio version.`,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  "What Is Depression? Explained Simply": {
    title: "What Is Depression? Explained Simply",
    type: "Video",
    body: `## Understanding Depression — Explained Simply

Depression is more than feeling sad. It's a medical condition that affects how you think, feel, and handle daily activities. Watch the video below for a clear explanation.

### Key Facts

- Depression is the **leading cause of disability** worldwide for young people
- It's caused by a combination of **genetic, biological, environmental, and psychological factors**
- It is **NOT** a sign of weakness or a character flaw
- It is **treatable** — most people improve with the right support

### Signs of Depression in Teens

**Emotional:**
- Persistent sadness or emptiness
- Irritability or frustration over small things
- Loss of interest in things you used to enjoy
- Feelings of worthlessness or excessive guilt

**Physical:**
- Changes in appetite (eating much more or much less)
- Sleep problems (insomnia or sleeping too much)
- Fatigue and low energy
- Unexplained aches and pains

**Behavioral:**
- Withdrawing from friends and activities
- Declining school performance
- Difficulty concentrating
- Avoiding social situations

### Depression vs. Sadness

| Sadness | Depression |
|---------|-----------|
| Comes and goes | Persists for 2+ weeks |
| Has a clear trigger | May have no obvious cause |
| Doesn't affect self-worth | Makes you feel worthless |
| You can still enjoy things | Nothing feels enjoyable |
| Sleep returns to normal | Sleep is consistently disrupted |

### What Helps

1. **Talk to someone** — A trusted adult, counselor, or helpline
2. **Stay connected** — Even when you want to isolate
3. **Move your body** — Even a 10-minute walk helps
4. **Maintain routines** — Structure provides stability
5. **Professional help** — Therapy and/or medication can be life-changing

### Video Explanation

▶️ Watch the animated explainer video below for a visual understanding of how depression works in the brain and body.`,
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  "Sleep Hygiene Tips for Students": {
    title: "Sleep Hygiene Tips for Students",
    type: "Video",
    body: `## Sleep Hygiene for Students 🌙

Your brain needs sleep like your phone needs charging. Here's your complete guide to better sleep.

### Why Sleep Matters for Teens

- Your brain needs **8-10 hours** of sleep (not 5-6!)
- During sleep, your brain **consolidates memories** from the day
- Sleep deprivation affects **mood, concentration, and immune function**
- Teen circadian rhythms naturally shift later — you're NOT lazy for wanting to sleep in

### The Sleep Hygiene Checklist

**Environment:**
- ✅ Room temperature 18-20°C (cool is better)
- ✅ Complete darkness (use curtains or eye mask)
- ✅ Quiet (use earplugs or white noise if needed)
- ✅ Comfortable bedding
- ❌ No screens in bed

**Routine (The "Power Down" Hour):**
- 60 min before bed: Stop studying
- 45 min before bed: Dim lights, no screens
- 30 min before bed: Warm shower or read a book
- 15 min before bed: Gentle stretching or journaling
- Bed: Same time every night (±30 min)

**During the Day:**
- Get sunlight within 30 minutes of waking
- Exercise (but not within 3 hours of bedtime)
- Limit caffeine after 2 PM
- Short naps only (20 min max, before 3 PM)

### Common Sleep Killers for Students

1. **Phone in bed** — Blue light suppresses melatonin by 50%
2. **Late-night studying** — Studying ≠ learning when sleep-deprived
3. **Irregular schedule** — Weekend sleep-ins disrupt your body clock
4. **Caffeine** — Half-life is 5-6 hours (a 4 PM coffee is still active at 10 PM)
5. **Worry** — Try a "brain dump" journal before bed

### The "Can't Sleep" Protocol

1. If not asleep in 20 min → get up
2. Go to another room
3. Do something boring (fold clothes, read a textbook)
4. Return when sleepy
5. Repeat if needed

▶️ Watch the video guide below for visual sleep tips.`,
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  "Progressive Muscle Relaxation": {
    title: "Progressive Muscle Relaxation",
    type: "Audio",
    body: `## Progressive Muscle Relaxation (PMR) — 15 Minutes

PMR is a technique where you systematically tense and release muscle groups. It's incredibly effective for reducing physical tension and anxiety.

### How It Works

When you're anxious, your muscles tense up (often without you realizing). PMR teaches your body the difference between tension and relaxation, and trains your nervous system to calm down.

### The Technique

For each muscle group:
1. **Tense** the muscles for 5-7 seconds
2. **Release** suddenly and completely
3. **Notice** the difference for 15-20 seconds
4. Move to the next group

### Muscle Groups (In Order)

1. **Hands** — Make tight fists → release
2. **Forearms** — Bend wrists back → release
3. **Biceps** — Flex like showing muscles → release
4. **Shoulders** — Shrug up to ears → release
5. **Forehead** — Raise eyebrows high → release
6. **Eyes** — Squeeze shut tight → release
7. **Jaw** — Clench teeth gently → release
8. **Neck** — Press head back gently → release
9. **Chest** — Take deep breath, hold → exhale and release
10. **Stomach** — Tighten abs → release
11. **Thighs** — Press knees together → release
12. **Calves** — Point toes up → release
13. **Feet** — Curl toes tight → release

### Guided Script

*"Find a comfortable position. Close your eyes. Take three slow, deep breaths.*

*We'll start with your hands. Make tight fists. Squeeze hard. Feel the tension in your fingers, your palms, your wrists. Hold... hold... and release. Let your hands go completely limp. Notice the warmth flowing in. The tingling. The difference between tension and relaxation.*

*Now your forearms. Bend your wrists back, stretching your forearms. Feel the pull. Hold... and release. Completely loose.*

*(Continue through each muscle group...)*

*Now take a moment to scan your whole body. From head to toe. Notice how different your body feels compared to when we started. Heavy. Warm. Relaxed. This is your body's natural state. You can return to it anytime."*

### When to Use PMR
- Before sleep
- Before exams
- During study breaks (mini version: hands, shoulders, jaw only)
- When you notice physical tension
- As a daily 15-minute practice

🎧 Press play below for the guided audio session.`,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },

  // Peer Support
  "How to Be a Good Listener": {
    title: "How to Be a Good Listener",
    type: "Guide",
    body: `## How to Be a Good Listener 👂

Being a good listener is one of the most powerful things you can do for someone who's struggling. Here's how to do it well.

### The HEAR Framework

**H — Halt** what you're doing
- Put your phone away (not face-down, completely away)
- Turn your body toward them
- Make gentle eye contact

**E — Empathize** before you advise
- "That sounds really tough"
- "I can see why you'd feel that way"
- "Thank you for trusting me with this"

**A — Ask** open questions
- "How are you feeling about that?"
- "What would feel helpful right now?"
- "Can you tell me more?"
- NOT: "Why did you do that?" or "Don't you think you should...?"

**R — Reflect** back what you heard
- "So it sounds like you're feeling overwhelmed because of exams and your parents are adding pressure?"
- This shows you listened AND helps them clarify their own thoughts

### What NOT to Do

❌ **Don't minimize**: "It's not that bad" / "Others have it worse"
❌ **Don't fix immediately**: "Just do this..." / "You should..."
❌ **Don't make it about you**: "I went through the same thing and I..."
❌ **Don't judge**: "Why would you think that?" / "That's silly"
❌ **Don't share their secret**: What's shared in confidence stays in confidence

### What TO Do

✅ **Validate**: "Your feelings make sense"
✅ **Be present**: Silence is okay — don't rush to fill it
✅ **Ask permission**: "Would you like advice, or do you just need to vent?"
✅ **Follow up later**: "Hey, I've been thinking about what you told me. How are you doing?"
✅ **Know your limits**: "I care about you, and I think a counselor could really help with this"

### When Someone Tells You Something Serious

If a friend tells you they're:
- Self-harming
- Thinking about suicide
- Being abused
- Using substances

**You MUST tell a trusted adult.** This isn't betraying their trust — it's potentially saving their life. You can say:

*"I love you and I care about you too much to keep this to myself. I'm going to help you get the right support."*

### Practice Exercise

Next time someone talks to you:
1. Put your phone completely away
2. Listen for 2 full minutes without interrupting
3. Reflect back what they said before responding
4. Ask: "What would be most helpful right now?"

> "Most people don't need advice. They need to feel heard."`,
  },
  "Peer Leader Training Module 1": {
    title: "Peer Leader Training Module 1",
    type: "Course",
    body: `## Peer Leader Training — Module 1: Foundations

Welcome to the MindBridge Peer Leader program! This training will prepare you to be a supportive presence in your community.

### What is a Peer Leader?

A Peer Leader is a trained teen who:
- **Listens** without judgment
- **Supports** peers who are struggling
- **Connects** people with professional resources
- **Moderates** Story Circles to maintain safety
- Is **NOT** a therapist or counselor

### Core Principles

**1. Confidentiality**
- What peers share stays private
- Exception: if someone is in danger (self-harm, abuse, suicidal ideation)
- In those cases, involve a trusted adult immediately

**2. Non-Judgment**
- Everyone's experience is valid
- You don't need to agree to be supportive
- Avoid "should" language

**3. Boundaries**
- You are NOT responsible for "fixing" anyone
- It's okay to say "I'm not sure how to help with this, but I know someone who can"
- Take care of your own mental health first

**4. Cultural Sensitivity**
- Different communities have different norms
- Be aware of your own biases
- Don't assume everyone's experience matches yours

### Peer Leader Skills

**Active Listening (Review)**
- Eye contact, body language, reflection, open questions

**De-escalation**
- Speak slowly and calmly
- Validate the emotion: "I can see you're really upset"
- Ground them: "Can you take a breath with me?"
- Don't argue or debate

**Knowing When to Escalate**
Immediately involve an adult if someone mentions:
- Suicide or self-harm
- Abuse (physical, emotional, sexual)
- Substance abuse
- Eating disorders
- Being in immediate danger

**Supporting in Story Circles**
- Welcome new members
- Encourage sharing but never pressure
- React with empathy (use the reaction emojis!)
- Flag concerning content to moderators

### Module 1 Assessment

After reviewing this material:
1. Can you name the 4 core principles?
2. What are 3 situations where you MUST escalate to an adult?
3. Practice the HEAR framework with a friend

### Your Commitment

As a Peer Leader, you commit to:
- Completing all training modules
- Checking in on Story Circles at least 3x/week
- Maintaining your own wellbeing practices
- Asking for help when YOU need it

> "You don't need to have all the answers. You just need to have an open heart."`,
  },
  "Setting Boundaries with Friends": {
    title: "Setting Boundaries with Friends",
    type: "Article",
    body: `## Setting Boundaries with Friends

Boundaries aren't walls — they're guidelines for how you want to be treated. Setting them is one of the healthiest things you can do for your friendships.

### Why Boundaries Matter

- They protect your emotional energy
- They prevent resentment from building up
- They make relationships more honest
- They teach others how to treat you

### Common Boundary Issues for Teens

**The Emotional Sponge**
You absorb everyone else's problems and feel drained.
→ Boundary: "I care about you, but I need to take care of my own feelings right now. Can we talk about this tomorrow?"

**The Constant Availability**
Friends expect you to respond instantly, always be free.
→ Boundary: "I can't always reply right away, but I'll get back to you when I can."

**The Peer Pressure**
Being pushed to do things you're not comfortable with.
→ Boundary: "I'm not into that, but you do you. I'll catch up with you later."

**The One-Sided Friendship**
You always listen but they never ask about you.
→ Boundary: "Hey, I'd love to share something with you too. Can I tell you about my day?"

**The Gossip Circle**
Being expected to share or listen to gossip.
→ Boundary: "I'd rather not talk about [person] when they're not here."

### How to Set a Boundary

**The KIND Framework:**

**K — Know** your limit (what's making you uncomfortable?)
**I — "I" statement** (use "I feel..." not "You always...")
**N — Name** what you need ("I need some space" / "I need you to stop")
**D — Don't apologize** for having needs

### Example Scripts

*"I love hanging out with you, but I need some alone time today. Let's plan something this weekend."*

*"When you share my private stuff with others, I feel hurt. I need to be able to trust you with what I tell you."*

*"I can't keep staying up late talking every night. My sleep is really suffering. Can we chat earlier?"*

### When They Don't Respect Your Boundaries

1. **Restate clearly**: "I meant what I said about needing space."
2. **Follow through**: If you said you'd leave, leave.
3. **Evaluate**: Is this person respecting you as a friend?
4. **Seek support**: Talk to a trusted adult if you feel pressured.

### Remember

- Setting boundaries is NOT selfish
- Real friends respect your boundaries
- It gets easier with practice
- You teach people how to treat you

> "Daring to set boundaries is about having the courage to love ourselves, even when we risk disappointing others."`,
  },
  "When a Friend is in Crisis — What To Do": {
    title: "When a Friend is in Crisis — What To Do",
    type: "Guide",
    body: `## When a Friend is in Crisis — What To Do

This is the most important guide you'll read. If a friend is in danger, your response matters.

### ⚠️ Immediate Danger Signs

Call for help IMMEDIATELY if your friend:
- Has a plan to hurt themselves
- Has access to means (pills, weapons, etc.)
- Is severely intoxicated and talking about death
- Is in physical danger from someone else

**Call: 112 (Emergency) or iCall: 9152987821**

### The ALGEE Framework (Mental Health First Aid)

**A — Approach**, assess, and assist
- Find a private, quiet place
- "I've noticed you seem really down lately. I'm worried about you."
- Stay calm even if they're not

**L — Listen** non-judgmentally
- Let them talk
- Don't try to fix it
- Don't minimize ("It's not that bad")
- Do validate ("That sounds incredibly painful")

**G — Give** reassurance and information
- "What you're feeling is real, and help is available"
- "Depression/anxiety is a medical condition, not a weakness"
- "Many people feel this way and get better with support"

**E — Encourage** professional help
- "Would you be open to talking to a counselor?"
- "I can help you find someone to talk to"
- "I'll go with you if that helps"

**E — Encourage** self-help and other support
- "What usually helps you feel better?"
- "Is there a family member you trust?"
- "Would you like to do something calming together?"

### The Direct Question

If you suspect a friend is suicidal, ASK DIRECTLY:

*"Are you thinking about hurting yourself?"*

**This does NOT plant the idea.** Research consistently shows that asking directly:
- Opens the door for honest conversation
- Shows you care enough to ask the hard question
- Reduces their isolation

### What To Say

✅ "I'm here for you"
✅ "You matter to me"
✅ "Let's figure out next steps together"
✅ "This won't last forever, even if it feels that way"
✅ "I'm going to help you get support"

### What NOT To Say

❌ "Just think positive"
❌ "Other people have it worse"
❌ "I know how you feel" (unless you truly do)
❌ "Promise me you won't do anything"
❌ "You have so much to live for" (they can't feel that right now)

### After the Crisis

- **Follow up** the next day and regularly after
- **Don't pretend it didn't happen**
- **Encourage ongoing support** (therapy, counseling)
- **Take care of yourself** — supporting someone in crisis is emotionally heavy
- **Talk to someone about YOUR feelings** too

### Key Helpline Numbers

| Helpline | Number | Available |
|----------|--------|-----------|
| iCall | 9152987821 | Mon-Sat, 8am-10pm |
| Vandrevala Foundation | 1860-2662-345 | 24/7 |
| NIMHANS | 080-46110007 | 24/7 |
| Sneha India | 044-24640050 | 24/7 |
| Emergency | 112 | 24/7 |

> "You don't need to be a therapist to save a life. Sometimes, just being there is enough."`,
  },
};

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
  const [openResource, setOpenResource] = useState<string | null>(null);
  const activeResource = openResource ? resourceContent[openResource] : null;

  const renderMarkdown = (text: string) => {
    // Simple markdown-like rendering
    return text.split("\n").map((line, i) => {
      if (line.startsWith("## ")) return <h2 key={i} className="font-heading text-2xl font-bold mt-6 mb-3">{line.slice(3)}</h2>;
      if (line.startsWith("### ")) return <h3 key={i} className="font-heading text-lg font-semibold mt-4 mb-2">{line.slice(4)}</h3>;
      if (line.startsWith("> ")) return <blockquote key={i} className="border-l-4 border-primary pl-4 py-2 my-4 italic text-muted-foreground bg-primary/5 rounded-r-lg">{line.slice(2)}</blockquote>;
      if (line.startsWith("- ")) return <li key={i} className="ml-4 text-sm leading-relaxed list-disc">{line.slice(2)}</li>;
      if (line.startsWith("1. ") || line.startsWith("2. ") || line.startsWith("3. ") || line.startsWith("4. ") || line.startsWith("5. ") || line.startsWith("6. ") || line.startsWith("7. ") || line.startsWith("8. ") || line.startsWith("9. ")) {
        return <li key={i} className="ml-4 text-sm leading-relaxed list-decimal">{line.slice(3)}</li>;
      }
      if (line.startsWith("**") && line.endsWith("**")) return <p key={i} className="font-semibold text-sm mt-2">{line.slice(2, -2)}</p>;
      if (line.startsWith("| ")) return null; // skip tables for simplicity
      if (line.startsWith("---")) return <hr key={i} className="my-4 border-border" />;
      if (line.startsWith("❌") || line.startsWith("✅")) return <p key={i} className="text-sm leading-relaxed ml-2">{line}</p>;
      if (line.trim() === "") return <div key={i} className="h-2" />;
      return <p key={i} className="text-sm leading-relaxed text-muted-foreground">{line}</p>;
    });
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">Resources & Peer Leaders</h1>
          <p className="text-muted-foreground mb-8">
            Curated mental health resources for teens, by teens. Click any resource to read, watch, or listen.
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
                          onClick={() => setOpenResource(item.title)}
                          className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-primary/10 transition-colors text-left group"
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            {item.type === "Audio" ? <Headphones className="w-5 h-5 text-primary" /> :
                             item.type === "Video" ? <Play className="w-5 h-5 text-primary" /> :
                             item.type === "Course" ? <Award className="w-5 h-5 text-primary" /> :
                             <FileText className="w-5 h-5 text-primary" />}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm group-hover:text-primary transition-colors">{item.title}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">{item.type}</Badge>
                              <span className="text-xs text-muted-foreground">{item.time}</span>
                            </div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary flex-shrink-0 transition-colors" />
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

      {/* Resource Content Dialog */}
      <Dialog open={!!openResource} onOpenChange={(open) => !open && setOpenResource(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {activeResource && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary">{activeResource.type}</Badge>
                </div>
                <DialogTitle className="font-heading text-xl">{activeResource.title}</DialogTitle>
                <DialogDescription className="sr-only">Resource content for {activeResource.title}</DialogDescription>
              </DialogHeader>

              {/* Video Player */}
              {activeResource.videoUrl && (
                <div className="rounded-xl overflow-hidden bg-black my-4">
                  <video
                    controls
                    className="w-full"
                    src={activeResource.videoUrl}
                    poster=""
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}

              {/* Audio Player */}
              {activeResource.audioUrl && (
                <div className="bg-muted rounded-xl p-4 my-4 flex items-center gap-3">
                  <Headphones className="w-6 h-6 text-primary flex-shrink-0" />
                  <audio controls className="w-full h-10" src={activeResource.audioUrl}>
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}

              {/* Article Content */}
              <div className="prose-sm">
                {renderMarkdown(activeResource.body)}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Resources;
