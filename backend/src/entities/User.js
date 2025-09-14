class User {
  constructor(name, email, whatsapp, password, entrou_com_facebook, entrou_com_google, quer_divulgar, quer_adotar, criado_em) {
    this.id = 0;
    this.nome = name;
    this.email = email;
    this.whatsapp = whatsapp;
    this.password = password;
    this.entrou_com_facebook = entrou_com_facebook;
    this.entrou_com_google = entrou_com_google;
    this.quer_divulgar = quer_divulgar;
    this.quer_adotar = quer_adotar
    this.criado_em = criado_em;
     this.role = "user";
  }
}


module.exports = User;










