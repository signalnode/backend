import { SignalNodeModule } from '@signalnode/types';
import { execSync } from 'child_process';
import fs from 'fs';
import cron, { ScheduledTask } from 'node-cron';
import path from 'path';
import { Addon, updateEntityValues } from '../models/addon';

type PackageJson = {
  name: string;
  description: string;
  version: string;
  author: string;
};

class ModuleManager {
  private modules: (SignalNodeModule<unknown, unknown> & { name: string })[];
  private tasks: { [key: string]: ScheduledTask[] };

  constructor() {
    this.modules = [];
    this.tasks = {};
  }

  private load = async (name: string): Promise<SignalNodeModule<unknown, string>> => {
    return (await import(path.resolve('./', 'node_modules', name))).default;
  };

  public getDetails = (name: string): PackageJson => {
    return JSON.parse(fs.readFileSync(path.resolve('./', 'node_modules', name, 'package.json'), { encoding: 'utf-8' }));
  };

  public install = async (name: string) => {
    try {
      // TODO: Remove type linking for production
      execSync(`npm link ${name} @signalnode/types`, {
        stdio: [0, 1, 2],
        // cwd: path.resolve('./', 'src', 'addons'),
      });

      const module = await this.load(name);

      this.modules.push({ ...module, name });

      return module;
    } catch (err) {
      // TODO: Handle exception
      console.log(err);
    }
  };

  public deinstall = (name: string) => {
    execSync(`npm remove ${name}`, { stdio: [0, 1, 2] });
  };

  public initialize = async (name: string) => {
    const module = await this.load(name);

    this.modules.push({ ...module, name });

    return module;
  };

  public registerJobs = async (addon: Addon, update: typeof updateEntityValues) => {
    const module = this.getModule(addon.name);
    module?.entities
      ?.filter((entity) => entity.job)
      .forEach((entity) => {
        const task = cron.schedule(entity.job!.interval.join(' '), async () => {
          const res = await entity.job?.run(addon.config);
          // TODO: Save response
          console.log('Job response:', res);
        });
        this.tasks[addon.name] ? this.tasks[addon.name].push(task) : (this.tasks[addon.name] = [task]);
      });

    module?.jobs?.forEach((job) => {
      console.log('Job:', job.interval);

      const task = cron.schedule(job.interval.join(' '), async () => {
        console.log('Job runned');

        try {
          const res = await job.run(addon.config);
          update(addon, res);
          // TODO: Save response
          console.log('Job response:', res);
        } catch (err) {
          console.error(err);
        }
      });
      this.tasks[addon.name] ? this.tasks[addon.name].push(task) : (this.tasks[addon.name] = [task]);
    });
  };

  public stopJobs = async (name: string) => {
    this.tasks[name]?.forEach((task) => task.stop());
  };

  public getModule = (name: string) => this.modules.find((module) => module.name === name);
  public getAllModules = () => this.modules;
}

export default new ModuleManager();
