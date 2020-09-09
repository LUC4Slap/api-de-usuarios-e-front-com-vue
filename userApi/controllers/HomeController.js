class HomeController{
    async index(req, res){
        res.json({message: "API de Gerenciamento de usuarios."});
    }
    async validateToken(req, res) {
        res.status(200).json({message: "OK"});
    }
}

module.exports = new HomeController();