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

    this._commandHandler = new CommandHandler(this._client, this._options.commandsDir);

    this._client.once("ready", async (client) => {
      await client.application.commands.set(this._commandHandler.commandArray);
    })

    this._client.on("interactionCreate", async (interaction) => {
      if (!interaction.isChatInputCommand()) return;

      const command = this._commandHandler.commands.get(interaction.commandName);
      if (!command) {
        await interaction.reply({content: "명령어를 찾을 수 없습니다."});
        return;
      }

      try {
        await command.execute(this._client, interaction);
      } catch(err) {
        console.log(err)
        await interaction.reply({content: "명령을 실행하는 동안 오류가 발생했습니다.", ephemeral: true})
      }
    })
  }

  get client() {
    return this._client;
  }

  get commands() {
    return this._commandHandler.commands;
  }

  get commandArray() {
    return this._commandHandler.commandArray
  }
}
