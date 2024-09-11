-- Pessoa
ALTER TABLE Pessoa
    ADD CONSTRAINT Pessoa_CPF_PK PRIMARY KEY (CPF);

-- TelefonePessoa
ALTER TABLE TelefonePessoa
    ADD CONSTRAINT TelefonePessoa_CPFpessoa_FK FOREIGN KEY (CPFpessoa) REFERENCES Pessoa (CPF);

-- Integrante
ALTER TABLE Integrante
    ADD CONSTRAINT Integrante_CPFpessoa_FK FOREIGN KEY (CPFpessoa) REFERENCES Pessoa (CPF);

-- Espectador
ALTER TABLE Espectador
    ADD CONSTRAINT Espectador_CPFpessoaPK PRIMARY KEY (CPFpessoa);

ALTER TABLE Espectador
    ADD CONSTRAINT Espectador_CPFpessoa_FK FOREIGN KEY (CPFpessoa) REFERENCES Pessoa (CPF);

ALTER TABLE Espectador
    ADD CONSTRAINT Espectador_CodigoUQ UNIQUE (Codigo);

-- Funcionario
ALTER TABLE Funcionario
    ADD CONSTRAINT Funcionario_CPFpessoa PRIMARY KEY (CPFpessoa);

ALTER TABLE Funcionario
    ADD CONSTRAINT Funcionario_CPFpessoa_FK FOREIGN KEY (CPFpessoa) REFERENCES Pessoa (CPF);

ALTER TABLE Funcionario
    ADD CONSTRAINT Funcionario_numeroregistro_UQ UNIQUE (numeroregistro);

-- TurnoFuncionario
ALTER TABLE TurnoFuncionario
    ADD CONSTRAINT TurnoFuncionario_CPFfuncionario_horainicio_data_PK PRIMARY KEY (CPFfuncionario, horainicio, data);

ALTER TABLE TurnoFuncionario
    ADD CONSTRAINT TurnoFuncionario_CPFfuncionario_FK FOREIGN KEY (CPFfuncionario) REFERENCES Funcionario (CPFpessoa);

-- Webmaster
ALTER TABLE Webmaster
    ADD CONSTRAINT Webmaster_CPFfuncionario_PK PRIMARY KEY (CPFfuncionario);

ALTER TABLE Webmaster
    ADD CONSTRAINT Webmaster_CPFfuncionario_FK FOREIGN KEY (CPFfuncionario) REFERENCES Funcionario (CPFpessoa);

ALTER TABLE Webmaster
    ADD CONSTRAINT Webmaster_email_UQ UNIQUE (email);

-- ProfissionalSeg
ALTER TABLE ProfissionalSeg
    ADD CONSTRAINT ProfissionalSeg_CPFfuncionario_PK PRIMARY KEY (CPFfuncionario);

ALTER TABLE ProfissionalSeg
    ADD CONSTRAINT ProfissionalSeg_CPFfuncionario_FK FOREIGN KEY (CPFfuncionario) REFERENCES Funcionario (CPFpessoa);

ALTER TABLE ProfissionalSeg
    ADD CONSTRAINT ProfissionalSeg_nrocredencial_UQ UNIQUE (nrocredencial);

-- Medico
ALTER TABLE Medico
    ADD CONSTRAINT Medico_CPFfuncionario_PK PRIMARY KEY (CPFfuncionario);

ALTER TABLE Medico
    ADD CONSTRAINT Medico_CPFfuncionario_FK FOREIGN KEY (CPFfuncionario) REFERENCES Funcionario (CPFpessoa);

ALTER TABLE Medico
    ADD CONSTRAINT Medico_crm_UQ UNIQUE (crm);

-- Ambulatorio
ALTER TABLE Ambulatorio
    ADD CONSTRAINT Ambulatorio_CNPJservico_PK PRIMARY KEY (CNPJservico);

ALTER TABLE Ambulatorio
    ADD CONSTRAINT Ambulatorio_CNPJservico_FK FOREIGN KEY (CNPJservico) REFERENCES Servico (CNPJ);

-- Seguranca
ALTER TABLE Seguranca
    ADD CONSTRAINT Seguranca_CNPJseguranca_PK PRIMARY KEY (CNPJseguranca);

ALTER TABLE Seguranca
    ADD CONSTRAINT Seguranca_CNPJseguranca_FK FOREIGN KEY (CNPJseguranca) REFERENCES Servico (CNPJ);

-- TelefoneServico
ALTER TABLE TelefoneServico
    ADD CONSTRAINT TelefoneServico_CNPJservico_telefone_PK PRIMARY KEY (CNPJservico, telefone);

ALTER TABLE TelefoneServico
    ADD CONSTRAINT TelefoneServico_CNPJservico_FK FOREIGN KEY (CNPJservico) REFERENCES Servico (CNPJ);

-- Servico
ALTER TABLE Servico
    ADD CONSTRAINT Servico_CNPJ_PK PRIMARY KEY (CNPJ);

-- Ocorrencia
ALTER TABLE Ocorrencia
    ADD CONSTRAINT Ocorrencia_numero_PK PRIMARY KEY (numero);

ALTER TABLE Ocorrencia
    ADD CONSTRAINT Ocorrencia_CPFprofissionalseg_FK FOREIGN KEY (CPFprofissionalseg) REFERENCES ProfissionalSeg (CPFfuncionario);

-- OcorrenciaPessoa
ALTER TABLE OcorrenciaPessoa
    ADD CONSTRAINT OcorrenciaPessoa_CPFpessoa_numeroocorrencia_PK PRIMARY KEY (CPFpessoa, numeroocorrencia);

ALTER TABLE OcorrenciaPessoa
    ADD CONSTRAINT OcorrenciaPessoa_CPFpessoa_FK FOREIGN KEY (CPFpessoa) REFERENCES Pessoa (CPF);

-- Post
ALTER TABLE Post
    ADD CONSTRAINT Post_id_PK PRIMARY KEY (id);

ALTER TABLE Post
    ADD CONSTRAINT Post_urlblog_FK FOREIGN KEY (urlblog) REFERENCES Blog (url);

ALTER TABLE Post
    ADD CONSTRAINT Post_CPFwebmaster_FK FOREIGN KEY (CPFwebmaster) REFERENCES Webmaster (CPFfuncionario);

-- Comentario
ALTER TABLE Comentario
    ADD CONSTRAINT Comentario_id_PK PRIMARY KEY (id);

ALTER TABLE Comentario
    ADD CONSTRAINT Comentario_idpost_FK FOREIGN KEY (idpost) REFERENCES Post (id);

ALTER TABLE Comentario
    ADD CONSTRAINT Comentario_idresposta_FK FOREIGN KEY (idresposta) REFERENCES Comentario (id);

-- Blog
ALTER TABLE Blog
    ADD CONSTRAINT Blog_url_PK PRIMARY KEY (url);

ALTER TABLE Blog
    ADD CONSTRAINT Blog_datalineup FOREIGN KEY (datalineup) REFERENCES LineUp (datalineup);

ALTER TABLE Blog
    MODIFY datalineup DATE NOT NULL;

-- LineUp
ALTER TABLE LineUp
    ADD CONSTRAINT LineUp_data_PK PRIMARY KEY (datalineup);

-- Show
ALTER TABLE Show
    ADD CONSTRAINT Show_nomelocal_datalineup_PK PRIMARY KEY (nomelocal, datalineup);

ALTER TABLE Show
    ADD CONSTRAINT Show_nomelocal_FK FOREIGN KEY (nomelocal) REFERENCES Local (nome);

ALTER TABLE Show
    ADD CONSTRAINT Show_datalineup_FK FOREIGN KEY (datalineup) REFERENCES LineUp (datalineup);

-- Local
ALTER TABLE Local
    ADD CONSTRAINT Local_nome_PK PRIMARY KEY (nome);

-- Banda
ALTER TABLE Banda
    ADD CONSTRAINT Banda_nome_PK PRIMARY KEY (nome);

ALTER TABLE Banda
    ADD CONSTRAINT Banda_nomelocalshow_FK FOREIGN KEY (nomelocalshow) REFERENCES Show (nomelocal);

ALTER TABLE Banda
    ADD CONSTRAINT Banda_datalineupshow_FK FOREIGN KEY (datalineupshow) REFERENCES Show (datalineup);

ALTER TABLE Banda
    ADD CONSTRAINT Banda_horainicioshow_FK FOREIGN KEY (horainicioshow) REFERENCES Show (horainicio);

-- IntegranteBanda
ALTER TABLE IntegranteBanda
    ADD CONSTRAINT IntegranteBanda_nomebanda_CPFintegrante_PK PRIMARY KEY (nomebanda, CPFintegrante);

ALTER TABLE IntegranteBanda
    ADD CONSTRAINT IntegranteBanda_nomebanda_FK FOREIGN KEY (nomebanda) REFERENCES Banda (nome);

ALTER TABLE IntegranteBanda
    ADD CONSTRAINT IntegranteBanda_CPFintegrante_FK FOREIGN KEY (CPFintegrante) REFERENCES Integrante (CPFpessoa);

-- Ingresso
ALTER TABLE Ingresso
    ADD CONSTRAINT Ingresso_numero_PK PRIMARY KEY (numero);

ALTER TABLE Ingresso
    ADD CONSTRAINT Ingresso_datalineupentrada_FK FOREIGN KEY (datalineupentrada) REFERENCES LineUp (datalineup);

ALTER TABLE Ingresso
    ADD CONSTRAINT Ingresso_CPFespectador_FK FOREIGN KEY (CPFespectador) REFERENCES Espectador (CPFpessoa);

ALTER TABLE Ingresso
    MODIFY CPFespectador VARCHAR2 (11) NOT NULL;

ALTER TABLE Ingresso
    ADD CONSTRAINT Ingresso_pertencedatalineup_FK FOREIGN KEY (pertencedatalineup) REFERENCES LineUp (datalineup);

-- Restaurante
ALTER TABLE Restaurante
    ADD CONSTRAINT CNPJ_PK PRIMARY KEY (CNPJ);

-- HorarioFunRest
ALTER TABLE HorarioFunRest
    ADD CONSTRAINT HorarioFunRest_CNPJrestaurante_PK PRIMARY KEY (CNPJrestaurante);

ALTER TABLE HorarioFunRest
    ADD CONSTRAINT HorarioFunRest_CNPJrestaurante_FK FOREIGN KEY (CNPJrestaurante) REFERENCES Restaurante (CNPJ);

-- Atendimento
ALTER TABLE Atendimento
    ADD CONSTRAINT Atendimento_CPFpessoa_CPFmedico_data_PK PRIMARY KEY (CPFpessoa, CPFmedico, dataatendimento);

ALTER TABLE Atendimento
    ADD CONSTRAINT Atendimento_CPFpessoa_FK FOREIGN KEY (CPFpessoa) REFERENCES Pessoa (CPF);

ALTER TABLE Atendimento
    ADD CONSTRAINT Atendimento_CPFmedico_FK FOREIGN KEY (CPFmedico) REFERENCES Medico (CPFfuncionario);

-- Hospedagem
ALTER TABLE Hospedagem
    ADD CONSTRAINT Hospedagem_CNPJ_PK PRIMARY KEY (CNPJ);