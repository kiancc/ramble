Using Gemini 3.1 Pro

You said

I want to build a simple expo prototype for me to use for my personal use that is basically an ADHD friendly task trakcer. Ideally for now lets keep the interface super simple and just minimal features, where I can record a voice note and it instantly captures, and 'files' the task away. Ideally the way the tasks are categorised and organised should act as an external executive function. This is going to be highly personalised towards my needs, where I can be high functioning, such as life, bills, general organisation is fine, but struggle with interest for example I had stripe interview process and was super locked in but now after the offer am making zero/very little progress on uni work. Before we commit to anything, lets review this first, I want to do a bit of a back and forward with you to see if I am missing anything. Ideally I want this up and running in two hours, and using the Gemini API or whatever for speech to text, and acting as the external executive function.

## Gemini said

This sounds like an incredibly practical and high-impact project. First off, congratulations on the Stripe offer! It completely makes sense why you were locked in for that and are now struggling with uni work. You're describing the classic ADHD "interest-based nervous system." When there's high novelty, challenge, or urgency (like a massive tech interview), your brain supplies the dopamine required to hyper-focus. Now that the chase is over, the mundane uni work feels physically impossible to start.

Using AI as an "external executive function" to bridge that gap is a brilliant use case. Building a barebones Expo prototype in two hours is entirely doable if we aggressively scope it down and rely on Gemini's API to do the heavy lifting for both transcription (speech-to-text) and task processing.

Before we write a single line of code, let’s review your concept and spot any potential gaps. Here are the main areas we need to nail down for an ADHD-friendly workflow:

### 1. The "Black Hole" Problem (Retrieval)

ADHD brains often struggle with "out of sight, out of mind." If you capture a task effortlessly but it goes into a hidden list, it ceases to exist.

- **The Gap:** You mentioned capturing and filing, but how do you want to _retrieve_ or look at these tasks?
    
- **Recommendation:** Keep the UI to exactly two screens. Screen 1: A giant "Hold to Record" button. Screen 2: A brutally simple, AI-curated "Do This Next" list. No folders, no complex tagging systems you have to navigate.
    

### 2. The AI Executive Assistant (Categorization Logic)

Standard task managers categorize by "Work," "Personal," or "Urgent." That doesn't work well for the interest-based nervous system. We need Gemini to categorize based on _energy and friction_.

- **The Gap:** What data should Gemini extract from your voice note?
    
- **Recommendation:** When you send the audio/text to the Gemini API, we give it a system prompt to extract:
    
    - **Task Name:** (Short, actionable)
        
    - **Energy Cost:** (Low, Medium, High)
        
    - **Dopamine Return:** (Is this interesting/rewarding, or pure drudgery like uni coursework?)
        
    - **Suggested Next Physical Action:** (Breaking it down so you don't have to think about _how_ to start).
        

### 3. Audio Processing Flow

To keep this under two hours, we need the path of least resistance for voice.

- **Recommendation:** Instead of dealing with third-party STT APIs, we can either use the Expo device's native dictation to get text and send _that_ to Gemini, OR record a quick audio file in Expo and send the raw audio directly to the Gemini API (which natively understands audio). Native device dictation to text -> Gemini is usually the fastest to implement in React Native.
    

---

### Let's narrow this down before building:

To make sure we hit that 2-hour window, tell me how you feel about these three questions:

1. **Output:** Do you want the app to just show you a standard categorized list of everything, or do you want it to act like an oracle where you open it and it says, "Based on your current load, just do _this one thing_ right now"?
    
2. **Categories:** Instead of standard folders, do you like the idea of the AI categorizing by "Energy Level" (e.g., Brain Dead, Normal, Hyperfocus)?
    
3. **Input:** Are you okay with tapping a button, using your phone's built-in voice-to-text keyboard to dictate, and hitting send? Or do you strictly want to hold a custom button to record raw audio?
    

Would you like me to draft up the exact Gemini system prompt we'll use for the "executive function" based on your thoughts, so we have the logic ready before we touch the Expo code?

You said

For 1. Yes I think a do this next list is ideal. We can leave space later to have a viewable tagging system for deep dives. I'm thinking something like an obsidian knowledge store, I know there is obsidian AI which you could use as an external executive function, but I want to build my own for my own personal use.

  

2. THis recommendation is perfect. Do you have recommendation on dopamine return scaling? Also the next physical action is great, I find starting is most difficult but if I can lock in then I'm focused.

  

3. lets do the native device dictation.

  

for narrowing down, 1. Ideally an oracle, or at least a smart task tracker. Eessentially you cant trust the idea/task you havent written down so its acting a an external executive function.

2. So I'm thinking it should have high level category names, such as 'Final Year Project', or 'Life Admin', then within those there will be the tasks, and each tak will have energy level like brain dead, normal or hyperfocus.

3. I think just tap so you can ramble on then click.

  

Some example use cases for me would be if I randomly remember 'Oh I need to add this feature to my FYP pipeline and do X', or 'Oh I just remembered I need to fill in this form so I can get bursary money' or 'Oh when I get home I should look up that forum post with an example Stripe interview question so I can practice it'. Notice the urgency? For the bursary money I got the form 2 months ago, printed it a month ago and still havent sent it because the deadline is in July. For the FYP addition, as I now have 5 weeks and am feeling the looming urgency I'm starting to finish up the project. FOr hte last one, when that happened I locked in on the question.

  

Before we draft up the system prompt, what are our thhoughts? Also dont woryr too much about the 2 hour time line, lets make sure we just have a strong platform to build from and we will takae our time

## Gemini said

Taking the 2-hour pressure off is a brilliant move. When building tools for our own executive functioning, rushing often leads to a rigid system that we abandon a week later. Let's focus on a rock-solid foundation that actually maps to how your brain works.

Your examples (Stripe vs. FYP vs. Bursary) perfectly highlight the core of ADHD motivation. Neurotypical brains prioritize by **Importance** and **Time**. ADHD brains prioritize by **Interest, Challenge, Novelty, and Urgency (ICNU)**.

Here are my thoughts on how we structure this, especially regarding your question about dopamine scaling:

### 1. The Dopamine Return Scale (The ICNU Framework)

Instead of a simple "High/Low" dopamine tag, we should have the AI evaluate your ramblings based on Dr. William Dodson's ICNU framework. When you dictate a task, the AI will score it on these four metrics:

- **Interest:** Is this inherently fascinating to you? (e.g., _Low_ for the bursary form).
    
- **Challenge:** Is this a puzzle to solve? (e.g., _High_ for the Stripe interview question).
    
- **Novelty:** Is this a brand-new shiny thing? (e.g., _High_ for a new FYP feature).
    
- **Urgency:** Is the consequence of not doing this imminent? (e.g., _High_ for FYP right now, _Zero_ for the July bursary deadline).
    

**How the Oracle uses this:** If a task has _zero_ points across all four of these (like the bursary form), the Oracle knows it's a "danger zone" task. It knows it needs to break that task down into microscopic, "Brain Dead" physical actions (e.g., "Put a stamp on the envelope") to bypass the lack of dopamine.

### 2. The Task Hierarchy

Based on your notes, here is the architecture of a single task once the AI processes your voice note.

- **Category:** (e.g., _FYP, Life Admin, Career_) - _Extracted automatically by AI._
    
- **Task Name:** (e.g., _Practice Stripe routing question_)
    
- **Energy Level Required:** _Brain Dead, Normal, or Hyperfocus._
    
- **Dopamine Profile:** _High Urgency, High Challenge, Low Novelty, etc._
    
- **Next Physical Action:** The absolute smallest physical movement required to start. (e.g., _Open a blank text file and paste the forum link_).
    

### 3. The "Rumble and Tap" Input

Native dictation is the way to go. You tap a text input box, hit the microphone icon on your iOS/Android keyboard, pace around the room rambling about what you need to do, and hit "Send."

The magic happens when the Gemini API takes that messy, unstructured ramble and silently formats it into the clean, tagged hierarchy above.

### 4. The Oracle Interface (The Output)

When you open the app, you shouldn't see a massive wall of tasks. You should see a simple prompt: **"What's your energy level?"**

- If you tap **"Brain Dead"**, the Oracle filters your list and shows you 1 or 2 Low-Energy tasks with High Urgency (like printing a form).
    
- If you tap **"Hyperfocus"**, it feeds you those High-Challenge, High-Interest tasks (like building the new FYP pipeline).
    

---

### The Next Step

Does this architecture—specifically using Interest, Challenge, Novelty, and Urgency to define the "dopamine scale"—feel like it accurately captures how your motivation works?

Would you like me to draft the exact System Prompt we will send to the Gemini API so we can test how well it extracts this data from a hypothetical "ramble"?

You said

yes and yes, but before this I want to examine the task view. Is my proposed structure the best? Or is the immediate 'brain dead, neutral, hyperfocus' better? Or just a list of all the tasks, with filters? I am trying to understand the risks related to just ignoring something? Also what if I struggle with noticing my energy levels? Like hyperfocus isnt on command. Also what about tasks that are genuinly urgent and take precedence over engery level?

## Gemini said

You’ve just hit on the exact failure points of almost every ADHD productivity system. Your self-awareness here is spot on.

Let's validate these concerns with some candor: You are 100% right that "hyperfocus" is not a switch you can flip on command. It’s a state you fall into, often accidentally. Furthermore, asking an ADHD brain with executive dysfunction to _evaluate its own executive function capacity_ (i.e., "What is my energy level right now?") introduces a massive point of friction. That alone can cause decision paralysis before you even look at a task.

And you are absolutely correct about urgency: if rent is due at midnight, it doesn't matter if you feel "brain dead." It has to happen.

Let’s break down the risks of the different views and build a better, combined approach based on your insights.

### Evaluating the UI Options (The Risks)

1. **The "Energy First" Oracle (Asking "How do you feel?"):**
    
    - **The Risk:** Decision fatigue and poor self-assessment. As you noted, you might not know your energy level until you actually try to start something.
        
2. **The Standard List with Filters:**
    
    - **The Risk:** The "Wall of Awful." If you open the app and see 40 tasks, your brain will likely get overwhelmed, shut down, and close the app. This is how tasks become a "black hole."
        
3. **The Strict Folder System (FYP, Life Admin, etc.):**
    
    - **The Risk:** Out of sight, out of mind. If you have to click into a "Life Admin" folder to see you need to pay a bill, you will never pay that bill.
        

### The Solution: The "Triaging Feed"

Instead of forcing _you_ to filter, or showing you _everything_, the app should act as a ruthless bouncer. When you open the app, you don't choose an energy level. You just see a single screen with exactly three distinct sections, curated by the AI:

**1. "On Fire" (Absolute Urgency)**

- **What it is:** The 1 or 2 tasks where the deadline is imminent (e.g., "Submit FYP proposal by 5 PM," "Pay phone bill today").
    
- **Why it works:** This overrides energy levels. The AI flags these based on the dates/urgency you mentioned in your voice note. If this section has something in it, you do not look at anything else.
    

**2. "Momentum Builders" (Brain Dead / Low Friction)**

- **What it is:** 2 or 3 tasks that the AI determined require virtually zero activation energy (e.g., "Put the printed bursary form in your backpack").
    
- **Why it works:** Because hyperfocus isn't on command, the best way to trigger it—or just to get moving—is to do something incredibly easy. This section gives you immediate, low-barrier options to get the dopamine flowing.
    

**3. "Rabbit Holes" (High Interest / High Challenge)**

- **What it is:** 1 or 2 tasks the AI flagged as highly novel or challenging (e.g., "Look up Stripe forum post," "Map out new FYP feature").
    
- **Why it works:** When you _do_ randomly have that spark of energy or interest, this is where you go. It captures your hyperfocus tasks without burying them in folders.
    

### Solving the "Black Hole" Problem

To ensure you never ignore anything, we just add a second tab at the bottom of the screen called **"The Vault"** or **"All Tasks."** You don't use this tab for your daily execution. You only use this tab when you are feeling organized and want to review everything you've ever captured, grouped by your high-level categories (FYP, Life Admin, etc.). This gives you the peace of mind that nothing is lost, without cluttering your daily "Executive Function" view.

### Summary of the New Architecture

- **Input:** Tap, ramble, send.
    
- **AI Processing:** Gemini extracts Task, Category, ICNU score, Next Physical Action, and **Deadline/Urgency**.
    
- **Main View:** A dynamic feed showing only: _On Fire_ -> _Momentum Builders_ -> _Rabbit Holes_. (Maximum 5-6 items on screen).
    
- **Review View:** "The Vault" where everything lives in a standard list, just for peace of mind.
    

How does this hybrid approach feel? If it resolves the risks you mentioned, would you like me to draft the Gemini system prompt so we can see how the AI handles sorting a messy voice note into this structure?

You said

Yeah this is fantastic, we will have to determine logic to move into on fire urgency, but this is great. We use the logic of the orcale wih this. Lets have the system prompt

## Gemini said

This is exactly how you build a system that works _with_ your brain instead of against it. You are completely right about the "On Fire" logic: the AI will flag the initial urgency based on your voice note, but your app's frontend will also need a simple background function that automatically moves a task into "On Fire" as a deadline approaches (e.g., if a deadline is exactly 48 hours away, push it to the top).

Here is the master system prompt. Since we are building an Expo app, the absolute best way to do this is to force the Gemini API to return **strict JSON**. This means your app doesn't have to read sentences; it just instantly takes the data and plugs it into your UI.

### The Gemini System Prompt

Copy and paste this exactly into your Gemini API call configuration as the `system_instruction`:

Plaintext

```
You are an expert Executive Function Assistant designed for an ADHD user. Your job is to take messy, rambling, stream-of-consciousness voice-to-text transcriptions and extract structured, actionable task data based on the ICNU (Interest, Challenge, Novelty, Urgency) framework. 

You must evaluate the implicit meaning, energy required, and friction involved in the user's request. 

Analyze the user's input and return ONLY a valid JSON object matching this exact schema. Do not include markdown formatting like ```json or any conversational text.

{
  "task_name": "string (A concise, clear name for the task)",
  "category": "string (Choose or create a broad category like 'FYP', 'Life Admin', 'Career', 'Finances', etc.)",
  "icnu_scores": {
    "interest": "integer 1-5 (1 = boring/drudgery, 5 = inherently fascinating)",
    "challenge": "integer 1-5 (1 = simple/repetitive, 5 = complex puzzle/problem solving)",
    "novelty": "integer 1-5 (1 = routine, 5 = brand new/shiny)",
    "urgency": "integer 1-5 (1 = no real deadline, 5 = extreme immediate consequence)"
  },
  "energy_level": "string (Must be exactly one of: 'Brain Dead', 'Normal', 'Hyperfocus'. Default to Brain Dead for high-friction/boring tasks. Hyperfocus is for high interest/challenge tasks.)",
  "next_physical_action": "string (The absolute smallest, microscopic physical movement required to start. E.g., 'Open a new Chrome tab' or 'Put the paper on the desk'.)",
  "deadline": "string (Extract any mentioned deadline as an ISO 8601 date, or return null if none is mentioned.)",
  "oracle_placement": "string (Must be exactly one of: 'On Fire', 'Momentum Builder', 'Rabbit Hole', 'The Vault')"
}

Rules for oracle_placement:
- "On Fire": Only if urgency is 5 or there is an immediate, severe impending deadline.
- "Rabbit Hole": If Interest and/or Challenge are 4 or 5.
- "Momentum Builder": If Energy Level is 'Brain Dead' and the next physical action is incredibly simple.
- "The Vault": If it's just a general idea, low urgency, and doesn't fit the above.
```

---

### How this works in practice

If you tap the microphone and dictate:

> _"Oh man, I just remembered I need to fill in that bursary form so I can get the money. I got it like two months ago and I printed it, but it's just sitting there. The deadline is sometime in July, but I just need to do it."_

The Gemini API will return this exact JSON to your Expo app in seconds:

JSON

```
{
  "task_name": "Fill out bursary form",
  "category": "Finances",
  "icnu_scores": {
    "interest": 1,
    "challenge": 1,
    "novelty": 1,
    "urgency": 2
  },
  "energy_level": "Brain Dead",
  "next_physical_action": "Pick up a pen and place it on top of the printed form.",
  "deadline": "2026-07-31T23:59:59Z",
  "oracle_placement": "Momentum Builder"
}
```

_Notice how beautifully it handles the ADHD friction: It knows the task is boring (Interest 1), requires no brainpower ("Brain Dead"), and gives you a micro-step ("Pick up a pen") to just get you moving._

Would you like to throw a messy, real-world "ramble" at me right now to see how the prompt handles it, or would you like to start outlining the barebones Expo folder structure?

You said

Now create the PRD for this, and suggest 5 names for this app. Also lets consider at a high level how the logic will work for upgrading tasks to super urgent, and what is the threshold. For example, something that doesnt take a long time such as posting a letter by a certain date can have a smaller window such as 3 days or something then moves to urgent, but something like a FYP should have a larger window, based on the tasks progress. This is to deal with time blindness. Also how can we deal with tasks that are halfway complete?

## Gemini said

This is a fantastic catch. Time blindness is arguably the most destructive part of ADHD because our internal clock essentially only has two settings: **"Now"** and **"Not Now."** If a 50-hour Final Year Project (FYP) task and a 5-minute letter-posting task both have a deadline of Friday, your brain will treat them with the exact same level of (non) urgency on Tuesday. We absolutely need the system to calculate the "runway" required for a task and escalate it to "On Fire" automatically.

Here is how we solve the time blindness and half-finished task problems, followed by 5 name ideas and the formal Product Requirements Document (PRD).

### 1. Logic for "Dynamic Urgency" (Curing Time Blindness)

To make the escalation smart, we need the Gemini API to estimate the **Task Size** (e.g., Small, Medium, Large, XL) based on your voice ramble.

When you open the app, a simple local function runs:

- **Small Tasks (e.g., post a letter, pay a bill):** Escalates to "On Fire" **3 days** before the deadline.
    
- **Medium Tasks (e.g., read a chapter, draft an email):** Escalates to "On Fire" **1 week** before the deadline.
    
- **Large Tasks (e.g., build a feature pipeline):** Escalates to "On Fire" **3 weeks** before the deadline.
    
- **XL / Project Level (e.g., FYP dissertation):** Escalates to "On Fire" **6 weeks** before the deadline.
    

_The rule:_ The heavier the cognitive load or time requirement, the earlier it breaches the "On Fire" threshold.

### 2. Logic for Halfway Complete Tasks (The "Pause & Pivot")

ADHD brains rarely finish a medium/large task in one sitting. If you just leave it in the list, it becomes stale and you go "app blind" to it.

- **The Fix:** Instead of just a "Done" checkbox, we add an **"Update"** button.
    
- **How it works:** You hit "Update," tap the mic, and say: _"I finished the database schema but I got stuck on the API routing, I'm too tired to finish."_
    
- **The Magic:** The app sends the existing task + your update to Gemini. Gemini updates the status to "Paused," adjusts the remaining task size, and most importantly, **generates a brand new 'Next Physical Action'** (e.g., _"Open the routing file and write a comment for what to do next"_). It then kicks the task out of "On Fire" and back into "Rabbit Hole" or "Momentum Builder" for tomorrow.