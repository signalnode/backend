import { ScheduledTask } from 'node-cron';

const tasks: { [key: string]: ScheduledTask[] } = {};

export const addTask = (name: string, task: ScheduledTask) => (tasks[name] ? tasks[name].push(task) : (tasks[name] = [task]));
export const getTasks = (name: string) => tasks[name];
