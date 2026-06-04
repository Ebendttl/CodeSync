import { Router } from 'express';
// @ts-ignore
import { AuthService } from '../services/authService';
const router = Router();
router.post('/register', async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = await AuthService.register(email, username, password);
        res.json({ user });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const data = await AuthService.login(email, password);
        res.json(data);
    }
    catch (err) {
        res.status(401).json({ error: err.message });
    }
});
export default router;
