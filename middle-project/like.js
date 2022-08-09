const express = require('express');
const { Likes, Posts, sequelize, Sequelize } = require('../models');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router
  .route('/like')
  // 좋아요 게시글 조회
  .get(authMiddleware, async (req, res) => {
    try {
      const { userId } = res.locals.user;

      let userLikes = await Likes.findAll({
        where: { userId },
      });

      let likePostIdArray = getLikePostIdByLikes(userLikes);
      //로그인한 유저가 좋아요 한 postId


/* function getLikePostIdByLikes(likes) { //likePostIdArray에 likes의 like(userID)와 postId를 넣어주는것
  let likePostIdArray = [];
  for (const like of likes) {
    likePostIdArray.push(like.postId);
  }

  return likePostIdArray;
} */
      const postsQuery = `
                SELECT p.postId, u.userId, u.nickname, p.title, p.createdAt, p.updatedAt
                FROM Posts AS p
                JOIN Users AS u
                ON p.userId = u.userId
                ORDER BY p.postId DESC`;
        //Posts에 있는 userId(글쓴이)와 Users에 있는 userId(글읽는사람)이 같은 걸


      let posts = await sequelize
        .query(postsQuery, {
          type: Sequelize.QueryTypes.SELECT,
        })
        .then((posts) => getPostsByPostIdArray(likePostIdArray, posts));
        // posts
/* 
function getPostsByPostIdArray(postIdArray, posts) { //posts의 post를 골라서 postIdArray에서 postId를 포함한 걸 보여준다
  return posts.filter((post) => {
    return postIdArray.includes(post.postId);
  });
} */
      const likes = await Likes.findAll();

      posts = posts.map((post) => {
        return {
          ...post,
          likes: likes.filter((like) => like.postId === post.postId).length,
        };//post.postId와 같은 postId를 가진 likes의 like(userId+postId)의 배열 즉, 같은 postId를 가진 usesrId의 배열
      });

      posts.sort((a, b) => b.createdAt - a.createdAt);
      posts.sort((a, b) => b.likes - a.likes);

      return res.status(200).json({
        data: posts,
      }); 
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      return res.status(400).json({
        errorMessage: '좋아요 게시글 조회에 실패하였습니다.',
      });
    }
  });

router
  .route('/:postId/like')
  // 좋아요 업데이트
  .put(authMiddleware, async (req, res) => {
    try {
      const { postId } = req.params;
      const { userId } = res.locals.user;

      const isExist = await Posts.findByPk(postId); //좋아요 버튼을 누르면 그 좋아요 버튼이 눌린 postId를 Posts에서 찾는다

      if (!isExist) { //만약에 그 postId가 없다면 
        return res.status(404).json({
          errorMessage: '게시글이 존재하지 않습니다.',
        });
      }

      let isLike = await Likes.findOne({ //likes에서 좋아요 버튼이 눌린 postId와 좋아요 버튼을 누른 userId를 찾는다
        where: { postId, userId },
      });

      if (!isLike) { // 좋아요 누른 userId와 postId가 Likes에 없다면 좋아요가 없었던 거니까
        await Likes.create({ postId, userId });

        return res
          .status(200)
          .json({ message: '게시글의 좋아요를 등록하였습니다.' });
      } else {//좋아요 누른 userId와 postId가 Likes에 있다면 좋아요를 했던 거니까
        await Likes.destroy({ //그 데이터를 지운다
          where: { postId, userId },
        });

        return res
          .status(200)
          .json({ message: '게시글의 좋아요를 취소하였습니다.' });
      }
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      return res.status(400).json({
        errorMessage: '게시글 좋아요에 실패하였습니다.',
      });
    }
  });

function getLikePostIdByLikes(likes) { //likePostIdArray에 likes의 like(userID)와 postId를 넣어주는것
  let likePostIdArray = [];
  for (const like of likes) {
    likePostIdArray.push(like.postId);
  }

  return likePostIdArray;
}

function getPostsByPostIdArray(postIdArray, posts) { //posts의 post를 골라서 postIdArray에서 postId를 포함한 걸 보여준다
  return posts.filter((post) => {
    return postIdArray.includes(post.postId);
  });
}

module.exports = router;

