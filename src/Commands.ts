import type { Client } from "discord.js";
import CommandHandler from "./CommandHandler";
import type { Options } from "./types";

export class Commands {
  private _client: Client;
  private _options: Options;
  private _commandHandler!: CommandHandler;

  constructor(client: Client, options: Options) {
    this._client = client;
    this._options = options;
    this.setUp();
  }

  private async setUp() {
    if (
      this._options.commandsDir &&
      !(
        this._options.commandsDir.includes("/") ||
        this._options.commandsDir.includes("\\")
      )
    ) {
      throw new Error(
        "The 'commands' directory must be an absolute path. This can be done by using the 'path' module."
      );
    }

    this._commandHandler = new CommandHandler(
      this._client,
      this._options.commandsDir
    );
  }

  get client() {
    return this._client;
  }

  get commands() {
    return this._commandHandler.commands;
  }

  get commandArray() {
    return this._commandHandler.commandArray;
  }
}
