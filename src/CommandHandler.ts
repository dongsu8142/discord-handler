import {
  Client,
  Collection,
  RESTPostAPIApplicationCommandsJSONBody,
} from "discord.js";
import type { CommandType } from "./types";
import fs from "fs";
import path from "path";

export default class CommandHandler {
  private _client: Client;
  private _commands = new Collection<string, CommandType>();
  private _commandArray: RESTPostAPIApplicationCommandsJSONBody[] = [];

  constructor(client: Client, dir: string) {
    this._client = client;

    this.setUp(dir);
  }

  private async setUp(dir: string) {
    const commandFolders = fs.readdirSync(dir);
    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(path.join(dir, folder))
        .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));
      for (const file of commandFiles) {
        const command = (await import(path.join(dir, folder, file)))
          .default as CommandType;
        this._commands.set(command.data.name, command);
        this._commandArray.push(command.data.toJSON());
      }
    }
  }

  get commands() {
    return this._commands;
  }

  get commandArray() {
    return this._commandArray;
  }
}
