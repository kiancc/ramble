import type { Task, TaskSize } from '../types/task';

const sizeToLeadDays: Record<TaskSize, number> = {
  Small: 3,
  Medium: 7,
  Large: 21,
  XL: 42,
};

function daysUntilDeadline(deadline: string, now: Date) {
  const millis = new Date(deadline).getTime() - now.getTime();
  return millis / (1000 * 60 * 60 * 24);
}

function shouldPromoteToOnFire(task: Task, now: Date) {
  if (!task.deadline || task.status === 'Done') {
    return false;
  }

  const leadWindow = sizeToLeadDays[task.taskSize];
  const remainingDays = daysUntilDeadline(task.deadline, now);

  return remainingDays <= leadWindow;
}

export function applyUrgencyEscalation(tasks: Task[], now: Date = new Date()): Task[] {
  return tasks.map((task) => {
    if (!shouldPromoteToOnFire(task, now)) {
      return task;
    }

    return {
      ...task,
      oraclePlacement: 'On Fire',
    };
  });
}
