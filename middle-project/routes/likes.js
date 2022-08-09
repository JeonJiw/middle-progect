const express = require('express');
const router = express.Router();


const LikesController = require('../controllers/likes.controller');
const likesController = new LikesController();
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/like', authMiddleware, likesController.getLikes); //좋아요 게시글 조회
router.put('/like', authMiddleware, likesController.updateLikes); //좋아요 업데이트

/* router.post('/:postId/like', authMiddleware, likesController.createLike); //좋아요 생성
router.delete('/:postId/like', authMiddleware, likesController.deleteLike); //좋아요 삭제 */

module.exports = router;
