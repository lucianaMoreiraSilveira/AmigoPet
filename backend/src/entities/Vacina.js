class Vacina {
  constructor({
    nome_pet,
    imagem_pet,
    data_nascimento,
    especie,
    sexo,
    porte,
    estado,
    cidade,
    nome_tutor,
    telefone,
    vacinas,
    tratamento,
    tipo_tratamento,
    sociavel,
    tipo_ambiente,
    observacoes,
    usuario_id
  }) {
    this.nome_pet = nome_pet;
    this.imagem_pet = imagem_pet;
    this.data_nascimento = data_nascimento;
    this.especie = especie;
    this.sexo = sexo;
    this.porte = porte;
    this.estado = estado;
    this.cidade = cidade;
    this.nome_tutor = nome_tutor;
    this.telefone = telefone;
    this.vacinas = vacinas || [];
    this.tratamento = tratamento;
    this.tipo_tratamento = tipo_tratamento;
    this.sociavel = sociavel;
    this.tipo_ambiente = tipo_ambiente;
    this.observacoes = observacoes;
    this.usuario_id = usuario_id;
  }
}

module.exports = Vacina;
