import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { Addon } from '../models/addon';
import { HomeNodeModule } from '@homenode/types';

type PackageJson = {
  name: string;
  description: string;
  version: string;
  author: string;
};

class ModuleManager {
  private modules: (HomeNodeModule & { name: string })[];

  constructor() {
    this.modules = [];
  }

  private load = async (name: string): Promise<HomeNodeModule> => {
    return (await import(path.resolve('./', 'node_modules', name))).default;
  };

  private getDetails = (name: string): PackageJson => {
    return JSON.parse(fs.readFileSync(path.resolve('./', 'node_modules', name, 'package.json'), { encoding: 'utf-8' }));
  };

  public install = async (name: string) => {
    try {
      execSync(`npm link ${name}`, {
        stdio: [0, 1, 2],
        // cwd: path.resolve('./', 'src', 'addons'),
      });

      const module = await this.load(name);
      const details = this.getDetails(name);

      this.modules.push({ ...module, name });

      Addon.create({ ...details, disabled: false });
    } catch (err) {
      // TODO: Handle exception
      console.log(err);
    }
  };

  public deinstall = (name: string) => {
    execSync(`npm remove ${name}`, { stdio: [0, 1, 2] });
  };

  public initialize = async (name: string) => {
    try {
      const module = await this.load(name);
      this.modules.push({ ...module, name });
      console.log(this.modules);
    } catch {
      // TODO: Module not found
    }
  };

  public getModule = (name: string) => this.modules.find((module) => module.name === name);
  public getAllModules = () => this.modules;
}

export default new ModuleManager();
