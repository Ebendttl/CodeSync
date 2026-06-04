import { Router } from 'express';
// @ts-ignore
import { SnapshotService } from '../services/snapshotService.js';

const router = Router();

router.get('/:roomId', async (req, res) => {
  try {
    const snaps = await SnapshotService.getSnapshots(req.params.roomId);
    res.json({ snapshots: snaps });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/:roomId', async (req, res) => {
  try {
    const { content, language, createdBy } = req.body;
    const snap = await SnapshotService.createSnapshot(req.params.roomId, content, language, createdBy);
    res.json({ snapshot: snap });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
