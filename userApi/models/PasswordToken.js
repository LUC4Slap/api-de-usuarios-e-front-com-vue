const knex = require('../database/connection');
const User = require('./User');
class PasswordToken {

  async create(email) {
    console.log("create");
    let user = await User.findByEmail(email);
    if(user != undefined) {
      try {
        let token = Date.now()
        await knex.insert({
          user_id: user.id,
          used: 0,
          token
        }).table("passwordtokens")
        return { status: true, message: "Token gerado no banco de dados", token }
      } catch (error) {
        console.log('função create model PasswodToken ', error);
        return { status: false, error: error }
      }
    }else {
      return { status: false, error: "E-mail informado não existe!" }
    }
  }

  async validadte(token) {
    try {
      let result = await knex.select("*").where({token: token}).table("passwordtokens");
      if(result.length > 0) {
        let tk = result[0]
        if(tk.used) {
          return { status: false, error: "Token invalido!" }
        } else {
          return { status: true, token: tk }
        }
      } else {
        return { status: false, error: "Token invalido!" }
      }
    } catch (error) {
      console.log('função validate ', error);
      return { status: false, error: "Token invalido!" }
    }
  }

  async setUsed(token) {
    try {
      await knex.update({used: 1}).where({token: token}).table("passwordtokens");
      return { status: true, message: "Registro alterado!" }
    } catch (error) {
      console.log('função setUsed ', error);
      return { status: false, error: error}
    }
  }

}

module.exports = new PasswordToken();