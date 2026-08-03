import cron from 'node-cron';
import InventoryItem from '../models/InventoryItem.js';

export const runExpiryScan = async () => {
  try {
    const now = new Date();
    console.log(`[Expiry Scheduler] Starting daily scan at ${now.toISOString()}`);

    const items = await InventoryItem.find({ status: { $ne: 'donated' } });
    let updatedCount = 0;

    for (const item of items) {
      const daysLeft = Math.ceil((new Date(item.expiryDate) - now) / (1000 * 60 * 60 * 24));
      let newStatus = item.status;

      if (daysLeft <= 0) {
        newStatus = 'expired';
      } else if (daysLeft <= item.daysToExpiryThreshold) {
        newStatus = 'near_expiry';
      } else {
        newStatus = 'fresh';
      }

      if (newStatus !== item.status) {
        item.status = newStatus;
        await item.save();
        updatedCount++;
      }
    }

    console.log(`[Expiry Scheduler] Scan completed. Updated ${updatedCount} items.`);
    return updatedCount;
  } catch (error) {
    console.error('[Expiry Scheduler Error]', error.message);
  }
};

export const initExpiryCron = () => {
  // Run daily at midnight: '0 0 * * *'
  cron.schedule('0 0 * * *', async () => {
    await runExpiryScan();
  });
  console.log('[Expiry Scheduler] Cron job initialized (runs daily at midnight).');
};
