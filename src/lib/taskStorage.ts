import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Task } from '../types/task';

const TASK_STORAGE_KEY = 'ramble.tasks.v1';
const LEGACY_DUMMY_TASK_IDS = new Set([
  'task-bursary-form',
  'task-fyp-routing',
  'task-stripe-forum',
  'task-rent-transfer',
  'task-lab-summary',
]);

type StoredTaskPayload = {
  tasks: Task[];
  updatedAt: string;
};

function isTaskArray(value: unknown): value is Task[] {
  return Array.isArray(value);
}

function removeLegacyDummyTasks(tasks: Task[]) {
  return tasks.filter((task) => !LEGACY_DUMMY_TASK_IDS.has(task.id));
}

export async function loadStoredTasks(): Promise<Task[] | null> {
  const raw = await AsyncStorage.getItem(TASK_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<StoredTaskPayload>;

    if (!isTaskArray(parsed.tasks)) {
      return null;
    }

    return removeLegacyDummyTasks(parsed.tasks);
  } catch {
    return null;
  }
}

export async function saveStoredTasks(tasks: Task[]): Promise<void> {
  const payload: StoredTaskPayload = {
    tasks,
    updatedAt: new Date().toISOString(),
  };

  await AsyncStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(payload));
}
