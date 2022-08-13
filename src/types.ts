import type { Client, CommandInteraction, SlashCommandBuilder } from "discord.js";

export interface Options {
  commandsDir: string;
}

export interface CommandType {
  data: SlashCommandBuilder;
  execute(client: Client, interaction: CommandInteraction): Promise<void>;
}