import { ScheduledTask } from 'node-cron';

class TaskManager {
  private tasks: { [key: string]: ScheduledTask[] } = {};

  public add = (name: string, task: ScheduledTask) => (this.tasks[name] ? this.tasks[name].push(task) : (this.tasks[name] = [task]));
  public get = (name: string) => this.tasks[name];
}

export default new TaskManager();
