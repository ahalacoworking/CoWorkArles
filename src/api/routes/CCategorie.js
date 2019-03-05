var jwtUtils = require('../utils/utils.Auth');
var UtilsDroit = require('../utils/utils.Droit');
var models = require('../models');

module.exports ={
    createCat: function (req, res) {
        //valeurs
        var libelle = req.body.libelle;
        var accreditation = req.body.accreditation;
        var droits = JSON.parse(req.body.droits); //tableau de droit

        //gestion des erreurs
        if (libelle == null){
            return res.status(400).json({'error': 'libelle manquant'});
        }
        if (accreditation == null){
            return res.status(400).json({'error': 'accreditation manquant'});
        }

        models.Categorie.findOne({
            attributes: ['libelle'],
            where: { libelle: libelle}
        }).then(function(CatFound) {
            if (!CatFound) {
                var newCategorie = models.Categorie.create({
                    libelle: libelle,
                    accreditation: accreditation
                }).then(function (newCategorie) {
                    var listNonAdd = [];
                    for(var i= 0; i < droits.length; i++)
                    {
                        console.log(UtilsDroit.addDroit(newCategorie.id, droits[i]));
                        /*if (!UtilsDroit.addDroit(newCategorie.id, droits[i])){
                            listNonAdd.push(droits[i]);
                        }*/
                    }
                    if (listNonAdd.length > 0){
                        return res.status(500).json({'error': 'impossible d\'ajouter les droits suivants : ' + listNonAdd});
                    }
                    return res.status(201).json({'id': newCategorie.id});
                }).catch(function (err) {
                    return res.status(500).json({'error': 'impossible d\'ajouter la categorie'});
                });
            }
            else
                return res.status(409).json({'error': 'la categorie existe déjà'});
        }).catch(function (err) {
            return res.status(500).json({'error': 'impossible de vérifier si la categorie existe déjà '+err});
        });
    },
    getAllDroit: function (req, res) {
      //valeurs
      var idCategorie = req.body.idCat;

      //gestion des erreurs
        if (idCategorie){
            return res.status(400).json({'error': 'idCategorie manquant'});
        }

        var recherche = UtilsDroit.getDroitByCat(idCategorie);

        if (recherche){
            if (recherche != null){
                return res.status(201).json(recherche);
            }else{
                return res.status(404).json({'error': 'aucun droit n\'a été trouvé pour cette categorie'});
            }
        }else{
            return res.status(500).json({'error': 'impossible d\'ajouter la categorie'});
        }
    },


}