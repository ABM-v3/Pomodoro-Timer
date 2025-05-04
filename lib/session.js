import { db } from './firebase';

export const session = () => async (ctx, next) => {
  const userId = ctx.from?.id;
  if (!userId) return next();
  
  const userRef = db.collection('users').doc(String(userId));
  const doc = await userRef.get();
  
  ctx.session = {
    settings: {
      workDuration: 25,
      breakDuration: 5,
      ...(doc.exists ? doc.data().settings : {})
    },
    activeTimers: doc.exists ? doc.data().activeTimers : []
  };

  await next();
  
  // Update session after processing
  await userRef.set({
    settings: ctx.session.settings,
    activeTimers: ctx.session.activeTimers
  }, { merge: true });
};
