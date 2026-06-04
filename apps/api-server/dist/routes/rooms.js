import { Router } from 'express';
// @ts-ignore
import { RoomService } from '../services/roomService.js';
const router = Router();
router.post('/', async (req, res) => {
    try {
        const { name, language, ownerId } = req.body;
        const room = await RoomService.createRoom(name, ownerId, language);
        res.json({ room });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const room = await RoomService.getRoom(req.params.id);
        if (!room)
            return res.status(404).json({ error: 'Room not found' });
        res.json({ room });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
router.post('/:id/join', async (req, res) => {
    try {
        await RoomService.joinRoom(req.params.id, req.body.userId);
        res.json({ success: true });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
export default router;
