const LikeRepository = require('../repositories/likes.repository');


class LikeService {
  likeRepository = new LikeRepository();

  findAllLike = async (userId) => {
    const allLike = await this.likeRepository.findAllLike();
    const allPost = await this.likeRepository.findAllLike();
try{
    let userLikes = allLike.findAll({
      where : { userId },
    });
    //로그인한 userId가 좋아요를 누른 postId들이 있는 요소들의 배열

    function getLikePostIdByLikes(likes) {
      let likePostIdArray = [];
      for (const like of likes) {
        likePostIdArray.push(like.postId);
      }
      return likePostIdArray;
    }z

    let likePostIdArray = getLikePostIdByLikes(userLikes);
    //로그인한 유저가 좋아요 한 postId만을 모아놓은 배열


    function getPostsByPostIdArray(postIdArray, posts) { 
      return posts.filter((post) => {
        return postIdArray.includes(post.postId);
      });
    }


    let posts = getPostsByPostIdArray(likePostIdArray, posts);
    //로그인한 유저가 좋아요 한 postId의 모든 정보를 가져온 것
    
    posts = allLike.map((post) => { //각 게시글 하나씩 가져와서 likes를 붙인다
      return {
        postId: post.postId,
        nickname: post.nickname,
        title: post.title,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        likes:likes.fileter((like) => like.postId === postId).length,
      };
    })
    posts.sort((a, b) => b.createdAt - a.createdAt);
    posts.sort((a, b) => b.likes - a.likes);

    return res.status(200).json({
      data: posts,
   }) 
} catch (error) {
  console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
  return res.status(400).json({
    errorMessage: '좋아요 게시글 조회에 실패하였습니다.',
  });
}
};

updateLike = async(postId, userId) => {
  const isExist = await this.likeRepository.findPostById(postId);

  if(!isExist){ 
    return res.status(404).json({
      errorMessage: '게시글이 존재하지 않습니다.',
    });
  }

  await this.LikeRepository.updateLike(postId, userId);
  const updateLikeData = await this.LikeRepository.findPostById(postId);

  createLike = async (postId, userId) => {
    const updateLikeData = await this.likeRepository.createLike(postId, userId);

    return {
      postId:updateLikeData.postId,
      userId:updateLikeData.userId
    };
  };

  deleteLike = async (postId, userId) => {
    const updateLikeData = await this.likeRepository.deleteLike(postId, userId);

      return res
        .status(200)
        .json({ message: '게시글의 좋아요를 취소하였습니다.' },
        {
          postId: updateLikeData.postId,
          userId: updateLikeData.userId
        });
  }
};
}


module.exports = LikeService;