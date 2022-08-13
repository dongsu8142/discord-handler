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
    await this._client.application?.commands.set(
      this._commandArray
    );

    this._client.on("interactionCreate", async (interaction) => {
      if (!interaction.isChatInputCommand()) return;

      const command = this._commands.get(
        interaction.commandName
      );
      if (!command) {
        await interaction.reply({ content: "명령어를 찾을 수 없습니다." });
        return;
      }

      try {
        await command.execute(this._client, interaction);
      } catch (err) {
        console.log(err);
        await interaction.reply({
          content: "명령을 실행하는 동안 오류가 발생했습니다.",
          ephemeral: true,
        });
      }
    })
  }

  get commands() {
    return this._commands;
  }

  get commandArray() {
    return this._commandArray;
  }
}
