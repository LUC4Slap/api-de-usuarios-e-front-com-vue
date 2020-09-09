const knex = require('../database/connection');
const bcrypt = require('bcrypt');
const PasswordToken = require('./PasswordToken')
class User {
  async findAll() {
    try {
      let users = await knex
        .select(['id', 'name', 'email', 'role'])
        .table('users');
      return users;
    } catch (error) {
      console.log('Função findAll', error);
      return [];
    }
  }

  async findByEmail(email) {
    try {
      let user = await knex
        .select(['id', 'name','password', 'email', 'role'])
        .where({ email: email })
        .table('users');
      if (user.length > 0) {
        return user[0];
      } else {
        return undefined;
      }
    } catch (error) {
      console.log('função fingByEmail ', error);
      return undefined;
    }
  }

  async findById(id) {
    try {
      let user = await knex
        .select(['id', 'name', 'email', 'role'])
        .where({ id: id })
        .table('users');
      if (user.length > 0) {
        return user[0];
      } else {
        return undefined;
      }
    } catch (err) {
      console.log('função findById', err);
      return undefined;
    }
  }

  async new(email, password, name) {
    try {
      let hash = await bcrypt.hash(password, 10);
      await knex
        .insert({ email, password: hash, name, role: 0 })
        .table('users');
    } catch (err) {
      console.log('função new', err);
    }
  }

  async findEmail(email) {
    try {
      let result = await knex.select('*').from('users').where({ email: email });
      if (result.length > 0) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log('Função findEmail', err);
      return false;
    }
  }

  async updadte(id, email, name, role) {
    let user = await this.findById(id);
    if (user != undefined) {
      let editUser = {};

      if (email != undefined) {
        if (email != user.email) {
          let result = await this.findEmail(email);
          if (result == false) {
            editUser.email = email;
          } else {
            return { status: false, err: 'E-mail ja esta cadastrador!' };
          }
        }
      }

      if (name != undefined) {
        editUser.name = name;
      }

      if (role != undefined) {
        editUser.role = role;
      }
      try {
        await knex.update(editUser).where({ id: id }).table('users');
        return { status: true };
      } catch (err) {
        console.log('função update ', err);
        return { status: false, err: err };
      }
    } else {
      return { status: false, err: 'Usuário não existe' };
    }
  }

  async delete(id) {
    let user = await this.findById(id);
    if (user != undefined) {
      try {
        await knex.delete().where({ id: id }).table('users');
        return { status: true, message: 'Usuário escluido com sucesso' };
      } catch (error) {
        console.log('função delete', error);
        return { status: false, err: error };
      }
    } else {
      return { status: false, err: 'Usuário não existe!' };
    }
  }

  async changePassword(newPassword, id, token) {
    try {
      let hash = await bcrypt.hash(newPassword, 10);
      await knex.update({ password: hash }).where({id: id}).table('users');
      await PasswordToken.setUsed(token);
    } catch (error) {
      console.log('função changePassword ', error);
      return { status: false, error: error}
    }
    // await knex.update({used: 1}).where({user_id: id}).table("passwordtokens");
  }
}

module.exports = new User();
