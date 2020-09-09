const User = require('../models/User');
const PasswordToken = require('../models/PasswordToken');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

let secret = "kjshdfkjhsdfiuwehridscnkjdhfsiowieru,cxmnv"

class UserControlle {

  async index(req, res) {
    let users = await User.findAll();
    if (users.length == 0) {
      res.status(500).json({ err: "Erro na busca de usuarios"});
    }
    res.status(200).json(users);
  }

  async findUser(req, res) {
    let { id } = req.params
    let user = await User.findById(id)
    if (user == undefined) {
      res.status(404).json({err: "Usuario não existe"});
    }
    res.json(user)
  }

  async create(req, res) {
    console.log(req.body);
    let { name, email, password } = req.body;

    if (email === undefined || email === '' || email === ' ') {
      res.status(400).json({ err: 'E-mail é obrigatorio' });
      return;
    } else if (name === undefined || name === '' || name === ' ') {
      res.status(400).json({ err: 'Nome é obrigatorio' });
      return;
    } else if (password === undefined || password === '' || password === ' ') {
      res.status(400).json({ err: 'Password é obrigatorio' });
      return;
    }

    let result = await User.findEmail(email);

    if (result) {
      res.status(406).json({ err: 'E-mail já existe no banco de dados' });
      return;
    }

    await User.new(email, password, name);
    res.status(200).json(req.body);
  }

  async edit(req, res){
    let { id, email, name, role } = req.body
    let result = await User.updadte(id, email, name, role);
    if(result != undefined) {
      if(result.status) {
        res.json({message: "Atualizado"});
      }else {
        res.status(500).json(result);
      }
    }else {
      res.status(500).json(result);
    }
  }

  async remove(req, res) {
    let { id } = req.params
    let result = await User.delete(id);
    if(result.status){
      res.json(result)
    }else {
      res.status(406).json({message: result.err})
    }
  }

  async recoverPassword(req, res) {
    let { email } = req.body
    let result = await PasswordToken.create(email);
    if(result.status) {
      res.json(result)
    }else {
      res.status(406).json(result)
    }
  }

  async changePassword(req, res) {
    let { token, password } = req.body;
    let isTokenValid = await PasswordToken.validadte(token);
    if(isTokenValid.status) {
      await User.changePassword(password, isTokenValid.token.user_id, isTokenValid.token.token)
      res.json({message: "Senha atulizada"});
    }else {
      res.status(406).json({ error: "Token invalido"})
    }
  }

  async login(req, res) {
    let { email, password} = req.body
    let user = await User.findByEmail(email);
    if (user != undefined) {
      let result = await bcrypt.compare(password, user.password)
      if(result) {
        var token = jwt.sign({ email: user.email, role: user.role }, secret);
        res.status(200).json({token: token})
      }else {
        res.status(406).json({error: "E-mail ou senha invalido"});
      }
    }else {
      res.status(406).json({error: "E-mail ou senha invalido"});
    }
  }
}

module.exports = new UserControlle();
