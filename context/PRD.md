
**Product Name:** [Placeholder - e.g., Ramble] **Platform:** Mobile (Expo / React Native) **Objective:** To serve as an AI-powered "external executive function" for an ADHD user, reducing task-initiation friction, bypassing time blindness, preserving key context from voice capture, and filtering tasks based on dopamine/energy levels (The ICNU framework).

#### 1. Core User Flow

1. **Capture:** User taps a microphone button, uses native device dictation to ramble about a task/thought, and taps "Send."
    
2. **Processing:** Text is sent to the Gemini API, which extracts structured JSON (Task name, Category, ICNU scores, Energy Level, Task Size, High-Level Steps, Deadline, Next Physical Action) plus contextual memory fields (supporting notes, key details, artifacts, parameters, follow-up tasks, open questions).
    
3. **Triaging (The Oracle View):** The user views a ruthlessly filtered feed:
    
    - **On Fire:** Tasks with imminent deadlines (adjusted dynamically based on Task Size).
        
    - **Momentum Builders:** Low-friction, "Brain Dead" tasks to build momentum.
        
    - **Rabbit Holes:** High-interest, High-challenge tasks for hyperfocus.
        
4. **Review (The Vault View):** A secondary tab containing all captured tasks, categorized by high-level folders (FYP, Life Admin, etc.), ensuring nothing is lost.

5. **Schema Inspection (MVP Debug):** User can open a task and inspect full schema fields, including the original transcript, Gemini raw response, and extracted context fields.
    

#### 2. Key Features & Logic

- **Voice-to-JSON Pipeline:** Utilizing device dictation to capture input and Gemini as the NLP engine to parse the text into a strict schema.

- **Context Preservation:** Each capture stores relevant thought context alongside the main task, including constraints, existing progress, artifacts, and follow-up actions extracted from a single ramble.
    
- **Next Physical Action Generator:** Every task must have a microscopic, zero-friction first step defined by the AI.

- **High-Level Steps:** Every task should include a short 3-5 step high-level plan to reduce planning paralysis after initiation.
    
- **Dynamic Urgency Escalation:** A background/on-load function that compares the current date to a task's deadline, using the AI-estimated "Task Size" to determine how early a task moves to the "On Fire" list (Small = 3 days, XL = 6 weeks).
    
- **Task Updating (Partial Completion):** Users can append a voice note to an existing task to update its state. The AI recalculates the "Next Physical Action" and re-sorts the task to prevent it from going stale.

- **Debug Visibility (MVP only):** Task detail view exposes transcript input, Gemini raw output, and full extracted schema for development validation.
    

#### 3. Data Model (Updated JSON Schema)

JSON

```
{
  "task_name": "string",
  "category": "string",
  "task_size": "string (Small, Medium, Large, XL)",
  "high_level_steps": ["string"],
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
  "status": "string (To Do, Paused, Done)",
  "context": {
    "supporting_notes": "string",
    "key_details": ["string"],
    "artifacts": ["string"],
    "parameters": ["string"],
    "follow_up_tasks": ["string"],
    "open_questions": ["string"]
  },
  "capture_debug": {
    "input_transcript": "string",
    "source": "string (gemini|fallback)",
    "model": "string",
    "captured_at": "string",
    "gemini_raw_text": "string|null",
    "gemini_raw_response": "string|null"
  }
}
```

#### 4. New Use Case: Task + Context in One Capture

Example capture:
"I need to send FYP progress report, I have result files created and feature extraction done, I still need to run the pipeline and capture results, and I need to filter out features below a confidence score."

Expected system behavior:

- Create one main task for execution priority.

- Extract and store progress context (already done vs remaining work).

- Extract artifacts and constraints (result files, feature extraction, confidence threshold).

- Extract follow-up actions from the same ramble.

- Surface open questions if a value is missing (e.g., threshold value not specified).

#### 5. Tech Stack (MVP)

- **Frontend:** React Native with Expo (managed workflow).
    
- **Storage:** AsyncStorage or SQLite (local-first approach to start, ensuring speed and privacy).
    
- **AI Integration:** Gemini API (direct fetch requests from the client).
    
- **UI Framework:** React Native Paper or NativeWind (Tailwind) for rapid, clean styling.

#### 6. Future Features (Not in Current Scope): Brain Dump

- **Feature Name:** Brain Dump

- **Description:** A dedicated mode where user can ramble all pending thoughts/tasks in one long capture.

- **Expected Behavior:** Gemini decomposes the ramble into multiple categorized tasks, each with ICNU, next action, and context payload.

- **Goal:** Offload cognitive sorting to AI so the app acts as an external executive function for rapid organization.

- **Status:** Deferred, documented for later implementation.

- **Feature Name:** Brain Vault

- **Description:** Obsidian-style knowledge tracker

- **Expected Behavior:** TODO

- **Goal:** TODO

- **Status:** Deferred, documented for later implementation.