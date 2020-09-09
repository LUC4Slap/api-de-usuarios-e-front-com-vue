const jwt = require('jsonwebtoken');
let secret = "kjshdfkjhsdfiuwehridscnkjdhfsiowieru,cxmnv"
module.exports = function(req, res, next) {
  const authToken = req.headers['authorization'];
  if(authToken != undefined){
    const bearer = authToken.split(' ')
    let token = bearer[1];
    try {
      let decoded = jwt.verify(token, secret);
      console.log(decoded);
      if(decoded.role == 1) {
        next();
      } else {
        res.status(406).json({message: "Voce não tem permissão"})
      }
    } catch (error) {
      console.log('Middleware ', error);
      res.status(404).json({error: "Token invalido"});
    }
  }else {
    res.status(403).json({error: "Você não esta autenticado!"})
  }
}