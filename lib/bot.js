import { Telegraf } from 'telegraf';
import { session } from './session';
import { handleTimer } from './timer';
import { db } from '../firebase';

export const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(session());

bot.command('start', (ctx) => {
  ctx.reply(`Welcome to Pomodoro Bot! 🍅\n
    Commands:\n
    /start - Start bot\n
    /pomodoro - Start 25min session\n
    /break - Start 5min break\n
    /stats - Show your statistics`);
});

bot.command('pomodoro', async (ctx) => {
  const userId = ctx.from.id;
  await handleTimer(ctx, userId, 25 * 60, 'work');
});

bot.command('break', async (ctx) => {
  const userId = ctx.from.id;
  await handleTimer(ctx, userId, 5 * 60, 'break');
});

bot.command('stats', async (ctx) => {
  const userId = ctx.from.id;
  const userRef = db.collection('users').doc(String(userId));
  const doc = await userRef.get();
  
  if (doc.exists) {
    const data = doc.data();
    ctx.reply(`Your stats:\n
      Total sessions: ${data.totalSessions}\n
      Total time: ${data.totalMinutes} minutes`);
  }
});

// Add more commands for settings/tasks
