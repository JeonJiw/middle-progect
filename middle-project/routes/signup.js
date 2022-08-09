const express = require('express');
const Joi = require('joi'); // 무엇인지 확인해보기
const { Users, sequelize, Sequelize } = require('../models');
const authLoginUserMiddleware = require('../middlewares/authLoginUserMiddleware'); //로그인이 이미 된 유저들이 회원가입 페이지로 이동하면 작동할 미들웨어

const router = express.Router();

const re_nickname = /^[a-zA-Z0-9]{3,10}$/;
const re_password = /^[a-zA-Z0-9]{4,30}$/;

const userSchema = Joi.object({
  nickname: Joi.string().pattern(re_nickname).required(),
  password: Joi.string().pattern(re_password).required(),
  confirm: Joi.string(),
});

router.post('/', authLoginUserMiddleware, async (req, res) => {
  try {

    const { nickname, password, confirm } = await userSchema.validateAsync( //valicateAsync?? //joi
      req.body
    );

    if (password !== confirm) {
      return res.status(412).send({
        errorMessage: '패스워드가 일치하지 않습니다.',
      });
    }
    if (nickname.search(re_nickname) === -1) {
      return res.status(412).send({
        errorMessage: 'ID의 형식이 일치하지 않습니다.',
      });
    }
    if (password.search(re_password) === -1) {//search? 조건 부합을 체크하는 것인가?
      return res.status(412).send({
        errorMessage: '패스워드 형식이 일치하지 않습니다.',
      });
    }
    if (isRegexValidation(password, nickname)) {
      return res.status(412).send({
        errorMessage: '패스워드에 닉네임이 포함되어 있습니다.',
      });
    }
    const user = await Users.findAll({ //findAll 사용법
      attributes: ['userId'],
      where: { nickname },
    });

    if (user.length) {
      return res.status(412).send({
        errorMessage: '중복된 닉네임입니다.',
      });
    }
    //CreateAt 과 UpdateAt을 지정해주지 않아도 자동으로 값이 입력된다.
    await Users.create({ nickname, password });
    console.log(`${nickname} 님이 가입하셨습니다.`);

    return res.status(201).send({ message: '회원 가입에 성공하였습니다.' });
  } catch (error) {
    console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
    return res.status(400).send({
      errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
    });
  }
});

function isRegexValidation(target, regex) { //정규식관련한...무엇인가... targer, regex?
  return target.search(regex) !== -1;
}

module.exports = router;
