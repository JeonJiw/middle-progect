const LikeService = require('../services/likes.service');


class LikesController {
  likeService = new LikeService();

  // 보낼 데이터 : likes /likes는 
  getLikes =  async (req, res, next) => {
    const likes = await this.likeService.findAllLike();

    res.status(200).json({ data: likes });
  }; 


  updateLikes = async (req, res, next) => {

      const { postId } = req.params;
      const { userId } = res.locals.user;

      const isLike = await this.likeService.findOne({ 
        where: { postId, userId },
      });
      console.log(isLike)

    if(!isLike){
      createLike = async () => {
    
        const updateLikeData = await this.likeService.createLike(postId,userId);
  
        res.status(200).json({ data: updateLikeData });
      };
     
    }else{
      deleteLike = async () => {

        const updateLikeData = await this.likeService.deleteLike(postId, userId);
    
        res.status(200).json({ data: updateLikeData });
      };
    }
  }

  /* createLike = async (req, res, next) => {
    const { postId } = req.params;
    const { userId } = res.locals.user;

    const createLikeData = await this.likeService.createLike(
      postId,
      userId
    );

    res.status(200).json({ data: createLikeData });
  };
  //결국에 client로 보내는 데이터는 좋아요 등록 또는 실패인데...



  deleteLike = async (req, res, next) => {
    const { postId } = req.params;
    const { userId } = res.locals.user;

    const deleteLike = await this.likeService.deleteLike(postId, userId);

    res.status(200).json({ data: deleteLike });
  }; */
}
module.exports = LikesController;