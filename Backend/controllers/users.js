const pool = require("../config/database");
const bcrypt = require("bcrypt");
const { response } = require("express");

module.exports = {
  insertUser: async (req, res) => {
    const { prenom, nom, email, telephone, password, typeLigue } = req.body;
    let connexion;
    try {
      connexion = await pool.getConnection();
      let hashPassword = await bcrypt.hash(password, 12)
      const result = await connexion.query("CALL insertNewUser (?, ?, ?, ?, ?, ?)",
      [prenom, nom, email, telephone, hashPassword, typeLigue]
      );
      return res.status(200).json({ success: result });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    } finally {
      if (connexion) connexion.end();
    }
  },

  updateUser: async (req, res) => {
    const {id} = req.params;
    const { prenom, nom, email, telephone, password, typeLigue } = req.body;
    let connexion;
    try {
      connexion = await pool.getConnection();
      const result = await connexion.query("CALL updatetUser (?, ?, ?, ?, ?, ?, ?)",
      [id, prenom, nom, email, telephone, password, typeLigue]
      );
      return res.status(200).json({ success: result });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    } finally {
      if (connexion) connexion.end();
    }
  },

  identificationUser: async(req, res) => {
    const { email, password}  = req.body;
    let connexion;
    try {
      connexion = await pool.getConnection();
      const result = await connexion.query('CALL identificationUser (?, ?)', [email, password]);
      const DBpassword = result[0][0].PASSWORD_UTILISATEUR;

      const resultat = await bcrypt.compare(password, DBpassword)

      if (!result[0].length) {
        return res.status(401).json({ error: "Identifiant Invalide" });
       }

      if (!resultat){
      } else {
        const data = result [0][0]; // rajout
        req.session.uid = data.ID_UTILISATEUR; // rajout
        console.log(req.session);
        return res.status(200).json("vous êtes identifié")
      }
    
  } catch (error) {
    return res.status(400).json({ error: error.message });
  } finally {
    if (connexion) connexion.end();
  }
},

// rajout
checkLoginStatus: async (req, res) => {
  const { uid } = req.session;
  if (uid) {
    return res.status(200).json({ success: { uid } });
  }
  return res.status(403).send();
},

checkSession: async (req, res, next) => {
  const {uid } = req.session;
  if (uid) {
    return next();
  }
  return res.status(403).send();
},

logout: (req, res) => {
  if (req?.session?.uid) {
    req.session.destroy();
    console.log(req.session);
    return res.status(200).send()
  }
  return res.status(401).send()
},
};