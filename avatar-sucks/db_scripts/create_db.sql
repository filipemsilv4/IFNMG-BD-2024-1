-- Create tables without foreign keys first

CREATE TABLE Regiao (
    id_regiao NUMBER GENERATED ALWAYS AS IDENTITY,
    nome VARCHAR2(100) NOT NULL,
    tipo VARCHAR2(50) NOT NULL,
    CONSTRAINT pk_regiao PRIMARY KEY (id_regiao)
);

CREATE TABLE Empresa (
    registro VARCHAR2(20),
    nome VARCHAR2(100) NOT NULL,
    CONSTRAINT pk_empresa PRIMARY KEY (registro)
);

CREATE TABLE Criatura (
    id_criatura NUMBER GENERATED ALWAYS AS IDENTITY,
    nome VARCHAR2(100) NOT NULL,
    tipo VARCHAR2(50) NOT NULL,
    CONSTRAINT pk_criatura PRIMARY KEY (id_criatura)
);

CREATE TABLE Pesquisa (
    id_pesquisa NUMBER GENERATED ALWAYS AS IDENTITY,
    nome VARCHAR2(100) NOT NULL,
    CONSTRAINT pk_pesquisa PRIMARY KEY (id_pesquisa)
);

CREATE TABLE Equipamento (
    id_equipamento NUMBER GENERATED ALWAYS AS IDENTITY,
    nome VARCHAR2(100) NOT NULL,
    utilidade VARCHAR2(200),
    consumo_energia NUMBER,
    CONSTRAINT pk_equipamento PRIMARY KEY (id_equipamento)
);

-- Create tables with foreign keys

CREATE TABLE Jazida (
    id_jazida NUMBER GENERATED ALWAYS AS IDENTITY,
    base NUMBER NOT NULL,
    altura NUMBER NOT NULL,
    latitude NUMBER NOT NULL,
    longitude NUMBER NOT NULL,
    ativa NUMBER(1) CHECK (ativa IN (0, 1)),
    qtd_recursos NUMBER,
    id_regiao NUMBER NOT NULL,
    CONSTRAINT pk_jazida PRIMARY KEY (id_jazida),
    CONSTRAINT fk_jazida_regiao FOREIGN KEY (id_regiao) REFERENCES Regiao(id_regiao) ON DELETE CASCADE
);

CREATE TABLE Colonia (
    id_colonia NUMBER GENERATED ALWAYS AS IDENTITY,
    nome VARCHAR2(100) NOT NULL,
    apelido VARCHAR2(100) NOT NULL,
    pressurizada NUMBER(1) CHECK (pressurizada IN (0, 1)),
    id_jazida NUMBER NOT NULL,
    registro_empresa VARCHAR2(20),
    CONSTRAINT pk_colonia PRIMARY KEY (id_colonia),
    CONSTRAINT fk_colonia_jazida FOREIGN KEY (id_jazida) REFERENCES Jazida(id_jazida) ON DELETE CASCADE,
    CONSTRAINT fk_colonia_empresa FOREIGN KEY (registro_empresa) REFERENCES Empresa(registro) ON DELETE CASCADE
);

CREATE TABLE Humano (
    id_humano NUMBER GENERATED ALWAYS AS IDENTITY,
    nome VARCHAR2(100) NOT NULL,
    tipo VARCHAR2(50) NOT NULL,
    id_colonia NUMBER,
    CONSTRAINT pk_humano PRIMARY KEY (id_humano),
    CONSTRAINT fk_humano_colonia FOREIGN KEY (id_colonia) REFERENCES Colonia(id_colonia) ON DELETE CASCADE
);

CREATE TABLE Container (
    id_container NUMBER GENERATED ALWAYS AS IDENTITY,
    nome VARCHAR2(100) NOT NULL,
    sigla VARCHAR2(20) NOT NULL,
    tipo VARCHAR2(50) NOT NULL,
    tamanho VARCHAR2(50),
    id_colonia NUMBER,
    CONSTRAINT pk_container PRIMARY KEY (id_container),
    CONSTRAINT fk_container_colonia FOREIGN KEY (id_colonia) REFERENCES Colonia(id_colonia) ON DELETE CASCADE
);

CREATE TABLE Laboratorio (
    id_laboratorio NUMBER GENERATED ALWAYS AS IDENTITY,
    finalidade VARCHAR2(200),
    id_container NUMBER NOT NULL,
    CONSTRAINT pk_laboratorio PRIMARY KEY (id_laboratorio),
    CONSTRAINT fk_laboratorio_container FOREIGN KEY (id_container) REFERENCES Container(id_container) ON DELETE CASCADE
);

CREATE TABLE Residencia (
    id_residencia NUMBER GENERATED ALWAYS AS IDENTITY,
    qtd_camas NUMBER,
    qtd_banheiros NUMBER,
    id_container NUMBER NOT NULL,
    CONSTRAINT pk_residencia PRIMARY KEY (id_residencia),
    CONSTRAINT fk_residencia_container FOREIGN KEY (id_container) REFERENCES Container(id_container) ON DELETE CASCADE
);

CREATE TABLE Deposito (
    id_deposito NUMBER GENERATED ALWAYS AS IDENTITY,
    tipo VARCHAR2(50),
    id_container NUMBER NOT NULL,
    CONSTRAINT pk_deposito PRIMARY KEY (id_deposito),
    CONSTRAINT fk_deposito_container FOREIGN KEY (id_container) REFERENCES Container(id_container) ON DELETE CASCADE
);

CREATE TABLE Maquinario (
    id_maquinario NUMBER GENERATED ALWAYS AS IDENTITY,
    tipo VARCHAR2(50) NOT NULL,
    modelo VARCHAR2(50) NOT NULL,
    id_jazida NUMBER,
    CONSTRAINT pk_maquinario PRIMARY KEY (id_maquinario),
    CONSTRAINT fk_maquinario_jazida FOREIGN KEY (id_jazida) REFERENCES Jazida(id_jazida) ON DELETE CASCADE
);

CREATE TABLE Escavadeira (
    id_escavadeira NUMBER GENERATED ALWAYS AS IDENTITY,
    peso_operacional NUMBER,
    potencia_motor NUMBER,
    capacidade_pa NUMBER,
    id_maquinario NUMBER NOT NULL,
    CONSTRAINT pk_escavadeira PRIMARY KEY (id_escavadeira),
    CONSTRAINT fk_escavadeira_maquinario FOREIGN KEY (id_maquinario) REFERENCES Maquinario(id_maquinario) ON DELETE CASCADE
);

CREATE TABLE Caminhao (
    id_caminhao NUMBER GENERATED ALWAYS AS IDENTITY,
    peso_operacional NUMBER,
    potencia_motor NUMBER,
    capacidade_cacamba NUMBER,
    id_maquinario NUMBER NOT NULL,
    CONSTRAINT pk_caminhao PRIMARY KEY (id_caminhao),
    CONSTRAINT fk_caminhao_maquinario FOREIGN KEY (id_maquinario) REFERENCES Maquinario(id_maquinario) ON DELETE CASCADE
);

CREATE TABLE Cientista (
    id_cientista NUMBER GENERATED ALWAYS AS IDENTITY,
    especialidade VARCHAR2(100),
    id_humano NUMBER NOT NULL,
    CONSTRAINT pk_cientista PRIMARY KEY (id_cientista),
    CONSTRAINT fk_cientista_humano FOREIGN KEY (id_humano) REFERENCES Humano(id_humano) ON DELETE CASCADE
);

CREATE TABLE Militar (
    id_militar NUMBER GENERATED ALWAYS AS IDENTITY,
    especialidade VARCHAR2(100),
    patente VARCHAR2(50),
    id_humano NUMBER NOT NULL,
    CONSTRAINT pk_militar PRIMARY KEY (id_militar),
    CONSTRAINT fk_militar_humano FOREIGN KEY (id_humano) REFERENCES Humano(id_humano) ON DELETE CASCADE
);

CREATE TABLE Minerador (
    id_minerador NUMBER GENERATED ALWAYS AS IDENTITY,
    funcao VARCHAR2(100),
    id_humano NUMBER NOT NULL,
    CONSTRAINT pk_minerador PRIMARY KEY (id_minerador),
    CONSTRAINT fk_minerador_humano FOREIGN KEY (id_humano) REFERENCES Humano(id_humano) ON DELETE CASCADE
);

CREATE TABLE Resultado (
    id_resultado NUMBER GENERATED ALWAYS AS IDENTITY,
    descricao VARCHAR2(200),
    id_pesquisa NUMBER NOT NULL,
    CONSTRAINT pk_resultado PRIMARY KEY (id_resultado),
    CONSTRAINT fk_resultado_pesquisa FOREIGN KEY (id_pesquisa) REFERENCES Pesquisa(id_pesquisa) ON DELETE CASCADE
);

CREATE TABLE Avatar (
    id_avatar NUMBER GENERATED ALWAYS AS IDENTITY,
    material_genetico VARCHAR2(100),
    id_humano NUMBER NOT NULL,
    id_resultado NUMBER NOT NULL,
    CONSTRAINT pk_avatar PRIMARY KEY (id_avatar),
    CONSTRAINT fk_avatar_humano FOREIGN KEY (id_humano) REFERENCES Humano(id_humano) ON DELETE CASCADE,
    CONSTRAINT fk_avatar_resultado FOREIGN KEY (id_resultado) REFERENCES Resultado(id_resultado) ON DELETE CASCADE
);

CREATE TABLE Arvore (
    id_arvore NUMBER GENERATED ALWAYS AS IDENTITY,
    tipo VARCHAR2(50) NOT NULL,
    idade NUMBER,
    altura NUMBER,
    id_regiao NUMBER NOT NULL,
    CONSTRAINT pk_arvore PRIMARY KEY (id_arvore),
    CONSTRAINT fk_arvore_regiao FOREIGN KEY (id_regiao) REFERENCES Regiao(id_regiao) ON DELETE CASCADE
);

CREATE TABLE Arvore_Vida (
    id_arvore_vida NUMBER GENERATED ALWAYS AS IDENTITY,
    produz_sementes NUMBER(1) CHECK (produz_sementes IN (0, 1)),
    id_arvore NUMBER NOT NULL,
    CONSTRAINT pk_arvore_vida PRIMARY KEY (id_arvore_vida),
    CONSTRAINT fk_arvore_vida_arvore FOREIGN KEY (id_arvore) REFERENCES Arvore(id_arvore) ON DELETE CASCADE
);

CREATE TABLE Arvore_Lar (
    id_arvore_lar NUMBER GENERATED ALWAYS AS IDENTITY,
    capacidade NUMBER,
    habitantes NUMBER,
    id_arvore NUMBER NOT NULL,
    CONSTRAINT pk_arvore_lar PRIMARY KEY (id_arvore_lar),
    CONSTRAINT fk_arvore_lar_arvore FOREIGN KEY (id_arvore) REFERENCES Arvore(id_arvore) ON DELETE CASCADE
);

CREATE TABLE Arvore_Alma (
    id_arvore_alma NUMBER GENERATED ALWAYS AS IDENTITY,
    eywa NUMBER(1) CHECK (eywa IN (0, 1)),
    id_arvore NUMBER NOT NULL,
    CONSTRAINT pk_arvore_alma PRIMARY KEY (id_arvore_alma),
    CONSTRAINT fk_arvore_alma_arvore FOREIGN KEY (id_arvore) REFERENCES Arvore(id_arvore) ON DELETE CASCADE
);

CREATE TABLE Cla (
    id_cla NUMBER GENERATED ALWAYS AS IDENTITY,
    nome VARCHAR2(100) NOT NULL,
    id_arvore_lar NUMBER,
    CONSTRAINT pk_cla PRIMARY KEY (id_cla),
    CONSTRAINT fk_cla_arvore_lar FOREIGN KEY (id_arvore_lar) REFERENCES Arvore_Lar(id_arvore_lar) ON DELETE CASCADE
);

CREATE TABLE Na_vi (
    id_na_vi NUMBER GENERATED ALWAYS AS IDENTITY,
    altura NUMBER,
    humor VARCHAR2(50),
    id_criatura NUMBER NOT NULL,
    id_jazida NUMBER NOT NULL,
    id_cla NUMBER NOT NULL,
    status_no_cla VARCHAR2(50),
    funcao_no_cla VARCHAR2(50),
    CONSTRAINT pk_na_vi PRIMARY KEY (id_na_vi),
    CONSTRAINT fk_na_vi_criatura FOREIGN KEY (id_criatura) REFERENCES Criatura(id_criatura) ON DELETE CASCADE,
    CONSTRAINT fk_na_vi_jazida FOREIGN KEY (id_jazida) REFERENCES Jazida(id_jazida) ON DELETE CASCADE,
    CONSTRAINT fk_na_vi_cla FOREIGN KEY (id_cla) REFERENCES Cla(id_cla) ON DELETE CASCADE
);

CREATE TABLE Liderança_Cla (
    id_lideranca NUMBER GENERATED ALWAYS AS IDENTITY,
    nome VARCHAR2(100) NOT NULL,
    cargo VARCHAR2(50) NOT NULL,
    id_cla NUMBER NOT NULL,
    CONSTRAINT pk_lideranca_cla PRIMARY KEY (id_lideranca),
    CONSTRAINT fk_lideranca_cla FOREIGN KEY (id_cla) REFERENCES Cla(id_cla) ON DELETE CASCADE
);

CREATE TABLE Planície (
    id_planicie NUMBER GENERATED ALWAYS AS IDENTITY,
    tem_rio NUMBER(1) CHECK (tem_rio IN (0, 1)),
    tem_lago NUMBER(1) CHECK (tem_lago IN (0, 1)),
    flora VARCHAR2(200),
    id_regiao NUMBER NOT NULL,
    CONSTRAINT pk_planicie PRIMARY KEY (id_planicie),
    CONSTRAINT fk_planicie_regiao FOREIGN KEY (id_regiao) REFERENCES Regiao(id_regiao) ON DELETE CASCADE
);

CREATE TABLE Vale (
    id_vale NUMBER GENERATED ALWAYS AS IDENTITY,
    possui_agua NUMBER(1) CHECK (possui_agua IN (0, 1)),
    profundidade_max NUMBER,
    id_regiao NUMBER NOT NULL,
    CONSTRAINT pk_vale PRIMARY KEY (id_vale),
    CONSTRAINT fk_vale_regiao FOREIGN KEY (id_regiao) REFERENCES Regiao(id_regiao) ON DELETE CASCADE
);

CREATE TABLE Montanha (
    id_montanha NUMBER GENERATED ALWAYS AS IDENTITY,
    altura NUMBER,
    movimenta NUMBER(1) CHECK (movimenta IN (0, 1)),
    id_regiao NUMBER NOT NULL,
    CONSTRAINT pk_montanha PRIMARY KEY (id_montanha),
    CONSTRAINT fk_montanha_regiao FOREIGN KEY (id_regiao) REFERENCES Regiao(id_regiao) ON DELETE CASCADE
);

CREATE TABLE Direhorse (
    id_direhorse NUMBER GENERATED ALWAYS AS IDENTITY,
    comprimento_antena NUMBER,
    id_criatura NUMBER NOT NULL,
    id_planicie NUMBER NOT NULL,
    CONSTRAINT pk_direhorse PRIMARY KEY (id_direhorse),
    CONSTRAINT fk_direhorse_criatura FOREIGN KEY (id_criatura) REFERENCES Criatura(id_criatura) ON DELETE CASCADE,
    CONSTRAINT fk_direhorse_planicie FOREIGN KEY (id_planicie) REFERENCES Planície(id_planicie) ON DELETE CASCADE
);

CREATE TABLE Leonopteryx (
    id_leonopteryx NUMBER GENERATED ALWAYS AS IDENTITY,
    cor1 VARCHAR2(50),
    cor2 VARCHAR2(50),
    envergadura_asas NUMBER,
    id_criatura NUMBER NOT NULL,
    id_vale NUMBER NOT NULL,
    CONSTRAINT pk_leonopteryx PRIMARY KEY (id_leonopteryx),
    CONSTRAINT fk_leonopteryx_criatura FOREIGN KEY (id_criatura) REFERENCES Criatura(id_criatura) ON DELETE CASCADE,
    CONSTRAINT fk_leonopteryx_vale FOREIGN KEY (id_vale) REFERENCES Vale(id_vale) ON DELETE CASCADE
);

CREATE TABLE Thanator (
    id_thanator NUMBER GENERATED ALWAYS AS IDENTITY,
    forca NUMBER,
    velocidade_max NUMBER,
    id_criatura NUMBER NOT NULL,
    id_vale NUMBER NOT NULL,
    CONSTRAINT pk_thanator PRIMARY KEY (id_thanator),
    CONSTRAINT fk_thanator_criatura FOREIGN KEY (id_criatura) REFERENCES Criatura(id_criatura) ON DELETE CASCADE,
    CONSTRAINT fk_thanator_vale FOREIGN KEY (id_vale) REFERENCES Vale(id_vale) ON DELETE CASCADE
);

CREATE TABLE Banshee (
    id_banshee NUMBER GENERATED ALWAYS AS IDENTITY,
    altura_max_voo NUMBER,
    cor_predominante VARCHAR2(50),
    id_criatura NUMBER NOT NULL,
    id_montanha NUMBER NOT NULL,
    CONSTRAINT pk_banshee PRIMARY KEY (id_banshee),
    CONSTRAINT fk_banshee_criatura FOREIGN KEY (id_criatura) REFERENCES Criatura(id_criatura) ON DELETE CASCADE,
    CONSTRAINT fk_banshee_montanha FOREIGN KEY (id_montanha) REFERENCES Montanha(id_montanha) ON DELETE CASCADE
);

-- Create junction tables for many-to-many relationships

CREATE TABLE Emprega_Cientista (
    id_laboratorio NUMBER NOT NULL,
    id_cientista NUMBER NOT NULL,
    CONSTRAINT pk_emprega_cientista PRIMARY KEY (id_laboratorio, id_cientista),
    CONSTRAINT fk_emprega_laboratorio FOREIGN KEY (id_laboratorio) REFERENCES Laboratorio(id_laboratorio) ON DELETE CASCADE,
    CONSTRAINT fk_emprega_cientista FOREIGN KEY (id_cientista) REFERENCES Cientista(id_cientista) ON DELETE CASCADE
);

CREATE TABLE Desenvolve (
    id_laboratorio NUMBER NOT NULL,
    id_cientista NUMBER NOT NULL,
    id_pesquisa NUMBER NOT NULL,
    CONSTRAINT pk_desenvolve PRIMARY KEY (id_laboratorio, id_cientista, id_pesquisa),
    CONSTRAINT fk_desenvolve_emprega FOREIGN KEY (id_laboratorio, id_cientista) REFERENCES Emprega_Cientista(id_laboratorio, id_cientista) ON DELETE CASCADE,
    CONSTRAINT fk_desenvolve_pesquisa FOREIGN KEY (id_pesquisa) REFERENCES Pesquisa(id_pesquisa) ON DELETE CASCADE
);

CREATE TABLE Utiliza (
    id_pesquisa NUMBER NOT NULL,
    id_equipamento NUMBER NOT NULL,
    CONSTRAINT pk_utiliza PRIMARY KEY (id_pesquisa, id_equipamento),
    CONSTRAINT fk_utiliza_pesquisa FOREIGN KEY (id_pesquisa) REFERENCES Pesquisa(id_pesquisa) ON DELETE CASCADE,
    CONSTRAINT fk_utiliza_equipamento FOREIGN KEY (id_equipamento) REFERENCES Equipamento(id_equipamento) ON DELETE CASCADE
);

CREATE TABLE Conecta_com (
    id_criatura1 NUMBER NOT NULL,
    id_criatura2 NUMBER NOT NULL,
    relacao VARCHAR2(50),
    CONSTRAINT pk_conecta_com PRIMARY KEY (id_criatura1, id_criatura2),
    CONSTRAINT fk_conecta_com_criatura1 FOREIGN KEY (id_criatura1) REFERENCES Criatura(id_criatura) ON DELETE CASCADE,
    CONSTRAINT fk_conecta_com_criatura2 FOREIGN KEY (id_criatura2) REFERENCES Criatura(id_criatura) ON DELETE CASCADE
);

CREATE TABLE Se_relaciona (
    id_cla NUMBER NOT NULL,
    id_arvore NUMBER NOT NULL,
    CONSTRAINT pk_se_relaciona PRIMARY KEY (id_cla, id_arvore),
    CONSTRAINT fk_se_relaciona_cla FOREIGN KEY (id_cla) REFERENCES Cla(id_cla) ON DELETE CASCADE,
    CONSTRAINT fk_se_relaciona_arvore FOREIGN KEY (id_arvore) REFERENCES Arvore(id_arvore) ON DELETE CASCADE
);

CREATE TABLE É_Dominado_Por (
    id_banshee NUMBER NOT NULL,
    id_na_vi NUMBER NOT NULL,
    CONSTRAINT pk_e_dominado_por PRIMARY KEY (id_banshee, id_na_vi),
    CONSTRAINT fk_dominado_banshee FOREIGN KEY (id_banshee) REFERENCES Banshee(id_banshee) ON DELETE CASCADE,
    CONSTRAINT fk_dominado_na_vi FOREIGN KEY (id_na_vi) REFERENCES Na_vi(id_na_vi) ON DELETE CASCADE
);