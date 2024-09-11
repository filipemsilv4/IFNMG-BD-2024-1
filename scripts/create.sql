CREATE TABLE
    Pessoa (
        CPF VARCHAR2 (11),
        tipopessoa VARCHAR2 (20),
        datanascimento DATE,
        nome VARCHAR2 (50),
        CEP VARCHAR2 (8),
        bairro VARCHAR2 (30),
        numero NUMBER,
        rua VARCHAR2 (25)
    );

CREATE TABLE
    TelefonePessoa (CPFpessoa VARCHAR2 (11), telefone VARCHAR2 (11));

CREATE TABLE
    Integrante (CPFpessoa VARCHAR2 (11));

CREATE TABLE
    Espectador (CPFpessoa VARCHAR2 (11), Codigo NUMBER);

CREATE TABLE
    Funcionario (
        CPFpessoa VARCHAR2 (11),
        numeroregistro NUMBER,
        tipofuncionario CHAR(3),
        cargo VARCHAR(10)
    );

CREATE TABLE
    TurnoFuncionario (
        CPFfuncionario VARCHAR2 (11),
        horainicio VARCHAR2 (10),
        data DATE,
        horafim VARCHAR2 (10)
    );

CREATE TABLE
    Webmaster (CPFfuncionario VARCHAR2 (11), email VARCHAR2 (50));

CREATE TABLE
    ProfissionalSeg (
        CPFfuncionario VARCHAR2 (11),
        nrocredencial NUMBER,
        localizacao VARCHAR2 (50),
        CNPJseguranca VARCHAR2 (14)
    );

CREATE TABLE
    Medico (
        CPFfuncionario VARCHAR2 (11),
        crm NUMBER,
        CNPJambulatorio VARCHAR2 (14)
    );

CREATE TABLE
    Ambulatorio (
        CNPJservico VARCHAR2 (14),
        capacidade NUMBER,
        nome VARCHAR2 (50)
    );

CREATE TABLE
    Seguranca (CNPJseguranca VARCHAR2 (14), nome VARCHAR2 (50));

CREATE TABLE
    TelefoneServico (CNPJservico VARCHAR2 (14), telefone VARCHAR2 (11));

CREATE TABLE
    Servico (CNPJ VARCHAR2 (14), tiposervico VARCHAR2 (50));

CREATE TABLE
    Ocorrencia (
        CPFprofissionalseg VARCHAR2 (11),
        numero NUMBER,
        dataocorrencia DATE,
        descricao VARCHAR2 (50),
        longitude NUMBER,
        latitude NUMBER
    );

CREATE TABLE
    OcorrenciaPessoa (CPFpessoa VARCHAR2 (11), numeroocorrencia NUMBER);

CREATE TABLE
    Post (
        id NUMBER,
        texto VARCHAR2 (250),
        datacriacao DATE,
        urlblog VARCHAR2 (100),
        CPFwebmaster VARCHAR2 (11)
    );

CREATE TABLE
    Comentario (
        id NUMBER,
        autor VARCHAR2 (50),
        email VARCHAR2 (250),
        datacomentario DATE,
        texto VARCHAR2 (250),
        idpost NUMBER,
        idresposta NUMBER
    );

CREATE TABLE
    Blog (
        url VARCHAR2 (250),
        datacriacao DATE,
        nome VARCHAR2 (20),
        datalineup DATE
    );

CREATE TABLE
    LineUp (datalineup DATE, capacidade NUMBER);

CREATE TABLE
    Show (
        nomelocal VARCHAR2 (50),
        datalineup DATE,
        horainicio VARCHAR2 (10)
    );

CREATE TABLE
    Local (nome VARCHAR2 (50));

CREATE TABLE
    Banda (
        nome VARCHAR2 (50),
        historia VARCHAR2 (250),
        site VARCHAR2 (100),
        ordemapresentacao NUMBER,
        nomelocalshow VARCHAR2 (250),
        datalineupshow DATE,
        horainicioshow VARCHAR2 (10)
    );

CREATE TABLE
    IntegranteBanda (
        nomebanda VARCHAR2 (50),
        CPFintegrante VARCHAR2 (11),
        historia VARCHAR2 (200),
        datainicio DATE,
        funcao VARCHAR2 (50)
    );

CREATE TABLE
    Ingresso (
        numero NUMBER,
        valor NUMBER,
        datalineupentrada DATE,
        horaentrada VARCHAR2 (10),
        CPFespectador VARCHAR2 (11),
        pertencedatalineup DATE
    );

CREATE TABLE
    Restaurante (
        CNPJ VARCHAR2 (14),
        nome VARCHAR2 (50),
        especialidade VARCHAR2 (10),
        CEP VARCHAR2 (8),
        bairro VARCHAR2 (50),
        numero NUMBER,
        rua VARCHAR2 (20),
        latitude NUMBER,
        longitude NUMBER
    );

CREATE TABLE
    Horariofunrest (
        CNPJrestaurante VARCHAR2 (14),
        horainicio VARCHAR2 (10),
        horafim VARCHAR2 (10),
        diasemana VARCHAR2 (15)
    );

CREATE TABLE
    Atendimento (
        CPFpessoa VARCHAR2 (11),
        CPFmedico VARCHAR2 (11),
        dataatendimento DATE,
        descricao VARCHAR2 (250)
    );

CREATE TABLE
    Hospedagem (
        CNPJ VARCHAR2 (14),
        nome VARCHAR2 (50),
        capacidade NUMBER,
        tipohospedagem VARCHAR2 (20),
        latitude NUMBER,
        longitude NUMBER,
        rua VARCHAR2 (20),
        numero NUMBER,
        bairro VARCHAR2 (20),
        CEP VARCHAR2 (8)
    );