
**Product Name:** [Placeholder - e.g., Ramble] **Platform:** Mobile (Expo / React Native) **Objective:** To serve as an AI-powered "external executive function" for an ADHD user, reducing task-initiation friction, bypassing time blindness, and filtering tasks based on dopamine/energy levels (The ICNU framework).

#### 1. Core User Flow

1. **Capture:** User taps a microphone button, uses native device dictation to ramble about a task/thought, and taps "Send."
    
2. **Processing:** Text is sent to the Gemini API, which extracts structured JSON (Task name, Category, ICNU scores, Energy Level, Task Size, Deadline, Next Physical Action).
    
3. **Triaging (The Oracle View):** The user views a ruthlessly filtered feed:
    
    - **On Fire:** Tasks with imminent deadlines (adjusted dynamically based on Task Size).
        
    - **Momentum Builders:** Low-friction, "Brain Dead" tasks to build momentum.
        
    - **Rabbit Holes:** High-interest, High-challenge tasks for hyperfocus.
        
4. **Review (The Vault View):** A secondary tab containing all captured tasks, categorized by high-level folders (FYP, Life Admin, etc.), ensuring nothing is lost.
    

#### 2. Key Features & Logic

- **Voice-to-JSON Pipeline:** Utilizing device dictation to capture input and Gemini as the NLP engine to parse the text into a strict schema.
    
- **Next Physical Action Generator:** Every task must have a microscopic, zero-friction first step defined by the AI.
    
- **Dynamic Urgency Escalation:** A background/on-load function that compares the current date to a task's deadline, using the AI-estimated "Task Size" to determine how early a task moves to the "On Fire" list (Small = 3 days, XL = 6 weeks).
    
- **Task Updating (Partial Completion):** Users can append a voice note to an existing task to update its state. The AI recalculates the "Next Physical Action" and re-sorts the task to prevent it from going stale.
    

#### 3. Data Model (Updated JSON Schema)

JSON

```
{
  "task_name": "string",
  "category": "string",
  "task_size": "string (Small, Medium, Large, XL)",
  "icnu_scores": {
    "interest": "integer 1-5",
    "challenge": "integer 1-5",
    "novelty": "integer 1-5",
    "urgency": "integer 1-5"
  },
  "energy_level": "string (Brain Dead, Normal, Hyperfocus)",
  "next_physical_action": "string",
  "deadline": "string (ISO 8601 or null)",
  "oracle_placement": "string",
  "status": "string (To Do, Paused, Done)"
}
```

#### 4. Tech Stack (MVP)

- **Frontend:** React Native with Expo (managed workflow).
    
- **Storage:** AsyncStorage or SQLite (local-first approach to start, ensuring speed and privacy).
    
- **AI Integration:** Gemini API (direct fetch requests from the client).
    
- **UI Framework:** React Native Paper or NativeWind (Tailwind) for rapid, clean styling.