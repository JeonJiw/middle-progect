const { Likes, Posts } = require('../models');



class LikeRepository {
    findAllLike =  async () => {
        const posts = await Posts.findAll();
        const likes = await Likes.findAll();
    
        return posts, likes;
      };


updateLike = async (postId, userId) => {
  
  findPostById = async (postId) => {
    const post = await Posts.findByPk(postId);
    return post;
  };

  createLike = async () => {
    const updateLikeData = await Likes.create(
      { postId, userId }
    );
    return updateLikeData;
  };

  deleteLike = async () => {
    const updateLikeData = await Likes.destroy(
        { postId, userId }
      );
      return updateLikeData;
  }

};

/* 
      createLike = async (postId,userId) => {
        const updateLikeData = await Likes.create(
          { postId, userId }
        );
        return updateLikeData;
      };

      deleteLike = async (postId, userId) => {
        const updateLikeData = await Likes.destroy(
            { postId, userId }
          );
          return updateLikeData;
      }
 */
    };
    

    module.exports = LikeRepository;