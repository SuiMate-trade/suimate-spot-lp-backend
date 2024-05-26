import TelegramBot from 'node-telegram-bot-api';

const TOKEN = '6484855988:AAHbGq1JAHFuoFIsQnTFmgCO_45Vh6G6O2A';

class SuimateTelegramBot {
  private bot: any;

  constructor() {
    this.bot = new TelegramBot(TOKEN);
  }

  async sendMessage(chatId: string, message: string) {
    return await this.bot.sendMessage(chatId, message);
  }
}

const bot = new SuimateTelegramBot();

export default bot;
