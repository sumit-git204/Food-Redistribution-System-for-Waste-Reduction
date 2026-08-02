import express from 'express';
import multer from 'multer';
import { 
  getInventory, 
  createInventoryItem, 
  updateInventoryItem, 
  deleteInventoryItem, 
  getExpiryAlerts, 
  lookupBarcode, 
  quickStockUpdate,
  bulkUploadCSV,
  posSyncWebhook
} from '../controllers/inventoryController.js';
import { protect } from '../middleware/auth.js';

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.use(protect);

router.get('/', getInventory);
router.post('/', createInventoryItem);
router.get('/expiry-alerts', getExpiryAlerts);
router.get('/barcode/:code', lookupBarcode);
router.post('/upload-csv', upload.single('file'), bulkUploadCSV);
router.post('/pos-sync', posSyncWebhook);
router.patch('/:id/stock', quickStockUpdate);
router.put('/:id', updateInventoryItem);
router.delete('/:id', deleteInventoryItem);

export default router;
