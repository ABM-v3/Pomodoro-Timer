export const handleTimer = async (ctx, userId, duration, type) => {
  const timer = {
    endTime: Date.now() + duration * 1000,
    type,
    active: true
  };

  ctx.session.activeTimers.push(timer);
  
  const updateTimer = async () => {
    const remaining = Math.round((timer.endTime - Date.now()) / 1000);
    
    if (remaining <= 0) {
      timer.active = false;
      await ctx.reply(`Time's up! ${type === 'work' ? 'Take a break!' : 'Back to work!'}`);
      await updateUserStats(userId, duration / 60);
      return;
    }

    setTimeout(updateTimer, 1000);
  };

  setTimeout(updateTimer, 1000);
};

async function updateUserStats(userId, minutes) {
  const userRef = db.collection('users').doc(String(userId));
  await userRef.update({
    totalSessions: firebase.firestore.FieldValue.increment(1),
    totalMinutes: firebase.firestore.FieldValue.increment(minutes)
  });
}
