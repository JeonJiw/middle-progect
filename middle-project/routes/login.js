const express = require('express');
const Joi = require('joi');
const { Users, sequelize, Sequelize } = require('../models');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const authLoginUserMiddleware = require('../middlewares/authLoginUserMiddleware');

const router = express.Router();
require('dotenv').config();

const loginSchema = Joi.object({ //회원가입 로그인 기능 구현할 때 사용한 기능인데 아직 뭔지 잘 모르겠음..
  nickname: Joi.string().required(),
  password: Joi.string().required(),
});

router.post('/', authLoginUserMiddleware, async (req, res) => {
  try {
    const { nickname, password } = await loginSchema.validateAsync(req.body); //validateAsync 알아보기
    const user = await Users.findOne({ //sequelize에서 사용하는 method 정리해보기
      where: {
        [Op.and]: [{ nickname }, { password }],
      },
    });

    if (!user) {
      return res.status(412).send({
        errorMessage: '닉네임 또는 패스워드를 확인해주세요.',
      });
    }

    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 60); // 만료 시간 관련한 것인듯? get/set에 대해서 잘 알아보기

    const token = jwt.sign({ userId: user.userId }, process.env.SECRET_KEY); //sign 토큰 만들기

    res.cookie(process.env.COOKIE_NAME, `Bearer ${token}`, {//환경변수사용법? 쿠키나 시크릿키 등?
      expires: expires,
    });
    return res.status(200).json({ token });
  } catch (error) {
    console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
    return res.status(400).send({
      errorMessage: '로그인에 실패하였습니다.',
    });
  }
});

module.exports = router;
