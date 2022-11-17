import { SignalNodeModule } from '@signalnode/types';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

type PackageJson = {
  name: string;
  description: string;
  version: string;
  author: string;
};

class ModuleManager {
  private modules: (SignalNodeModule<unknown, unknown> & { name: string })[];

  constructor() {
    this.modules = [];
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
    console.log(this.modules);

    return module;
  };

  public getModule = (name: string) => this.modules.find((module) => module.name === name);
  public getAllModules = () => this.modules;
}

export default new ModuleManager();
