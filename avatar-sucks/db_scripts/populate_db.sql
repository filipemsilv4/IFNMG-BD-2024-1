-- Insert into Regiao
INSERT INTO Regiao (nome, tipo) VALUES ('Floresta Tropical', 'Terrestre');
INSERT INTO Regiao (nome, tipo) VALUES ('Planície Rochosa', 'Terrestre');
INSERT INTO Regiao (nome, tipo) VALUES ('Vale da Névoa', 'Terrestre');
INSERT INTO Regiao (nome, tipo) VALUES ('Montanhas Flutuantes', 'Aérea');
INSERT INTO Regiao (nome, tipo) VALUES ('Mar Bioluminescente', 'Aquática');

-- Insert into Empresa
INSERT INTO Empresa (registro, nome) VALUES ('RDA-001', 'Dunder Mifflin');
INSERT INTO Empresa (registro, nome) VALUES ('PCC-002', 'Sabre Corporation');
INSERT INTO Empresa (registro, nome) VALUES ('PPR-001', 'Athlead');
INSERT INTO Empresa (registro, nome) VALUES ('PPR-002', 'WUPHF.com');
INSERT INTO Empresa (registro, nome) VALUES ('PCC-003', 'Michael Scott Paper Company');
INSERT INTO Empresa (registro, nome) VALUES ('PCC-004', 'Dunder Mifflin Sabre');
INSERT INTO Empresa (registro, nome) VALUES ('PCC-005', 'Dunder Mifflin Infinity');
INSERT INTO Empresa (registro, nome) VALUES ('PCC-006', 'Dunder Mifflin Utica');
INSERT INTO Empresa (registro, nome) VALUES ('PCC-007', 'Dunder Mifflin Stamford');
INSERT INTO Empresa (registro, nome) VALUES ('PCC-008', 'Dunder Mifflin Scranton');


-- Insert into Humano
INSERT INTO Humano (nome, tipo) VALUES ('Michael Scott', 'Cientista');
INSERT INTO Humano (nome, tipo) VALUES ('Dwight Schrute', 'Cientista');
INSERT INTO Humano (nome, tipo) VALUES ('Jim Halpert', 'Cientista');
INSERT INTO Humano (nome, tipo) VALUES ('Pam Beesly', 'Cientista');
INSERT INTO Humano (nome, tipo) VALUES ('Ryan Howard', 'Cientista');
INSERT INTO Humano (nome, tipo) VALUES ('Andy Bernard', 'Cientista');
INSERT INTO Humano (nome, tipo) VALUES ('Robert California', 'Cientista');
INSERT INTO Humano (nome, tipo) VALUES ('Kevin Malone', 'Cientista');
INSERT INTO Humano (nome, tipo) VALUES ('Angela Martin', 'Cientista');
INSERT INTO Humano (nome, tipo) VALUES ('Oscar Martinez', 'Cientista');
INSERT INTO Humano (nome, tipo) VALUES ('Meredith Palmer', 'Cientista');
INSERT INTO Humano (nome, tipo) VALUES ('Creed Bratton', 'Cientista');
INSERT INTO Humano (nome, tipo) VALUES ('Kelly Kapoor', 'Militar');
INSERT INTO Humano (nome, tipo) VALUES ('Holly Flax', 'Militar');
INSERT INTO Humano (nome, tipo) VALUES ('Stanley Hudson', 'Militar');
INSERT INTO Humano (nome, tipo) VALUES ('Darryl Philbin', 'Militar');
INSERT INTO Humano (nome, tipo) VALUES ('Toby Flenderson', 'Minerador');
INSERT INTO Humano (nome, tipo) VALUES ('Jan Levinson', 'Minerador');
INSERT INTO Humano (nome, tipo) VALUES ('David Wallace', 'Minerador');
INSERT INTO Humano (nome, tipo) VALUES ('Gabe Lewis', 'Minerador');

-- Insert into Criatura
INSERT INTO Criatura (nome, tipo) VALUES ('Na_vi', 'Humanóide');
INSERT INTO Criatura (nome, tipo) VALUES ('Direhorse', 'Equino');
INSERT INTO Criatura (nome, tipo) VALUES ('Leonopteryx', 'Predador Alado');
INSERT INTO Criatura (nome, tipo) VALUES ('Thanator', 'Predador Terrestre');
INSERT INTO Criatura (nome, tipo) VALUES ('Banshee', 'Ave de Rapina');

-- Insert into Pesquisa
INSERT INTO Pesquisa (nome) VALUES ('Integração Avatar-Na_vi');
INSERT INTO Pesquisa (nome) VALUES ('Extração de Unobtanium');
INSERT INTO Pesquisa (nome) VALUES ('Estudo da Flora de Pandora');
INSERT INTO Pesquisa (nome) VALUES ('Comunicação com Eywa');
INSERT INTO Pesquisa (nome) VALUES ('Desenvolvimento de Armas Biológicas');

-- Insert into Equipamento
INSERT INTO Equipamento (nome, utilidade, consumo_energia) VALUES ('Link Unit', 'Conexão Neural', 100);
INSERT INTO Equipamento (nome, utilidade, consumo_energia) VALUES ('AMP Suit', 'Exoesqueleto Militar', 500);
INSERT INTO Equipamento (nome, utilidade, consumo_energia) VALUES ('Scanner Biológico', 'Análise de DNA', 200);
INSERT INTO Equipamento (nome, utilidade, consumo_energia) VALUES ('Sismógrafo', 'Detecção de Unobtanium', 300);
INSERT INTO Equipamento (nome, utilidade, consumo_energia) VALUES ('Rifle de Plasma', 'Arma de Longo Alcance', 700);

-- Insert into Jazida
INSERT INTO Jazida (base, altura, latitude, longitude, ativa, qtd_recursos, id_regiao) VALUES (1000, 500, -22.5, 140.2, 1, 1000000, 1);
INSERT INTO Jazida (base, altura, latitude, longitude, ativa, qtd_recursos, id_regiao) VALUES (500, 250, -15.7, 135.9, 1, 500000, 2);
INSERT INTO Jazida (base, altura, latitude, longitude, ativa, qtd_recursos, id_regiao) VALUES (2000, 1000, -10.3, 130.5, 0, 0, 3);
INSERT INTO Jazida (base, altura, latitude, longitude, ativa, qtd_recursos, id_regiao) VALUES (750, 375, -5.8, 125.1, 1, 750000, 4);
INSERT INTO Jazida (base, altura, latitude, longitude, ativa, qtd_recursos, id_regiao) VALUES (1500, 750, 0.2, 120.7, 1, 1500000, 5);

-- Insert into Colonia
INSERT INTO Colonia (nome, apelido, pressurizada, id_jazida, registro_empresa) VALUES ('Hell''s Gate', 'Portão do Inferno', 1, 1, 'RDA-001');
INSERT INTO Colonia (nome, apelido, pressurizada, id_jazida, registro_empresa) VALUES ('Bridgehead City', 'Cidade Ponte', 1, 2, 'RDA-001');
INSERT INTO Colonia (nome, apelido, pressurizada, id_jazida, registro_empresa) VALUES ('Grace''s Hope', 'Esperança de Grace', 0, 4, 'PCC-002');

-- Insert into Container
INSERT INTO Container (nome, sigla, tipo, tamanho, id_colonia) VALUES ('Laboratório Alpha', 'LAB-A', 'Pesquisa', 'Grande', 1);
INSERT INTO Container (nome, sigla, tipo, tamanho, id_colonia) VALUES ('Quartel Militar', 'QMT-01', 'Militar', 'Médio', 1);
INSERT INTO Container (nome, sigla, tipo, tamanho, id_colonia) VALUES ('Residência Beta', 'RES-B', 'Habitacional', 'Pequeno', 1);
INSERT INTO Container (nome, sigla, tipo, tamanho, id_colonia) VALUES ('Depósito de Unobtanium', 'DEP-U', 'Armazenamento', 'Grande', 2);
INSERT INTO Container (nome, sigla, tipo, tamanho, id_colonia) VALUES ('Laboratório Biológico', 'LAB-BIO', 'Pesquisa', 'Médio', 3);

-- Insert into Laboratorio
INSERT INTO Laboratorio (finalidade, id_container) VALUES ('Pesquisa de Avatar', 1);
INSERT INTO Laboratorio (finalidade, id_container) VALUES ('Análise de Unobtanium', 5);

-- Insert into Residencia
INSERT INTO Residencia (qtd_camas, qtd_banheiros, id_container) VALUES (2, 1, 3);

-- Insert into Deposito
INSERT INTO Deposito (tipo, id_container) VALUES ('Minerais', 4);

-- Insert into Maquinario
INSERT INTO Maquinario (tipo, modelo, id_jazida) VALUES ('Escavadeira', 'RDA Excavator', 1);
INSERT INTO Maquinario (tipo, modelo, id_jazida) VALUES ('Caminhão', 'RDA Hauler', 1);
INSERT INTO Maquinario (tipo, modelo, id_jazida) VALUES ('Escavadeira', 'PCC Excavator', 2);

-- Insert into Escavadeira
INSERT INTO Escavadeira (peso_operacional, potencia_motor, capacidade_pa, id_maquinario) VALUES (120000, 1500, 50, 1);
INSERT INTO Escavadeira (peso_operacional, potencia_motor, capacidade_pa, id_maquinario) VALUES (80000, 1000, 30, 3);

-- Insert into Caminhao
INSERT INTO Caminhao (peso_operacional, potencia_motor, capacidade_cacamba, id_maquinario) VALUES (60000, 800, 100, 2);

-- Insert into Cientista
INSERT INTO Cientista (especialidade, id_humano) VALUES ('Biologia', 1);
INSERT INTO Cientista (especialidade, id_humano) VALUES ('Física', 2);
INSERT INTO Cientista (especialidade, id_humano) VALUES ('Química', 3);
INSERT INTO Cientista (especialidade, id_humano) VALUES ('Matemática', 4);
INSERT INTO Cientista (especialidade, id_humano) VALUES ('Engenharia', 5);
INSERT INTO Cientista (especialidade, id_humano) VALUES ('Medicina', 6);
INSERT INTO Cientista (especialidade, id_humano) VALUES ('Psicologia', 7);
INSERT INTO Cientista (especialidade, id_humano) VALUES ('Economia', 8);
INSERT INTO Cientista (especialidade, id_humano) VALUES ('Sociologia', 9);
INSERT INTO Cientista (especialidade, id_humano) VALUES ('Filosofia', 10);
INSERT INTO Cientista (especialidade, id_humano) VALUES ('História', 11);
INSERT INTO Cientista (especialidade, id_humano) VALUES ('Geografia', 12);

-- Insert into Militar
INSERT INTO Militar (especialidade, patente, id_humano) VALUES ('Combate', 'Coronel', 13);
INSERT INTO Militar (especialidade, patente, id_humano) VALUES ('Logística', 'Major', 14);
INSERT INTO Militar (especialidade, patente, id_humano) VALUES ('Inteligência', 'Capitão', 15);
INSERT INTO Militar (especialidade, patente, id_humano) VALUES ('Medicina', 'Tenente', 16);

-- Insert into Minerador
INSERT INTO Minerador (funcao, id_humano) VALUES ('Operador de Escavadeira', 17);
INSERT INTO Minerador (funcao, id_humano) VALUES ('Operador de Caminhão', 18);
INSERT INTO Minerador (funcao, id_humano) VALUES ('Supervisor de Jazida', 19);
INSERT INTO Minerador (funcao, id_humano) VALUES ('Engenheiro de Minas', 20);

-- Insert into Resultado
INSERT INTO Resultado (descricao, id_pesquisa) VALUES ('Avatar Jake Sully criado com sucesso', 1);
INSERT INTO Resultado (descricao, id_pesquisa) VALUES ('Nova técnica de extração de Unobtanium', 2);

-- Insert into Avatar
INSERT INTO Avatar (material_genetico, id_humano, id_resultado) VALUES ('AGGAT', 1, 1);

-- Insert into Arvore
INSERT INTO Arvore (tipo, idade, altura, id_regiao) VALUES ('Hometree', 10000, 500, 1);
INSERT INTO Arvore (tipo, idade, altura, id_regiao) VALUES ('Helicoradian', 5000, 250, 2);
INSERT INTO Arvore (tipo, idade, altura, id_regiao) VALUES ('Willowtree', 7500, 375, 3);

-- Insert into Arvore_Vida
INSERT INTO Arvore_Vida (produz_sementes, id_arvore) VALUES (1, 1);

-- Insert into Arvore_Lar
INSERT INTO Arvore_Lar (capacidade, habitantes, idade, id_arvore) VALUES (500, 300, 8000, 1);

-- Insert into Arvore_Alma
INSERT INTO Arvore_Alma (eywa, id_arvore) VALUES (1, 1);

-- Insert into Cla
INSERT INTO Cla (nome, id_arvore_lar) VALUES ('Omaticaya', 1);

-- Insert into Na_vi
INSERT INTO Na_vi (altura, humor, id_criatura, id_jazida, id_cla, status_no_cla, funcao_no_cla) VALUES (3.0, 'Feliz', 1, 1, 1, 'Guerreiro', 'Caçador');
INSERT INTO Na_vi (altura, humor, id_criatura, id_jazida, id_cla, status_no_cla, funcao_no_cla) VALUES (2.8, 'Curioso', 1, 1, 1, 'Tsahik', 'Curandeira');

-- Insert into Liderança_Cla
INSERT INTO Liderança_Cla (nome, cargo, id_cla) VALUES ('Tsu''tey', 'Líder', 1);
INSERT INTO Liderança_Cla (nome, cargo, id_cla) VALUES ('Mo''at', 'Tsahik', 1);

-- Insert into Planície
INSERT INTO Planície (tem_rio, tem_lago, flora, id_regiao) VALUES (1, 0, 'Herbácea', 2);

-- Insert into Vale
INSERT INTO Vale (possui_agua, profundidade_max, id_regiao) VALUES (1, 1000, 3);

-- Insert into Montanha
INSERT INTO Montanha (altura, movimenta, id_regiao) VALUES (3000, 0, 4);

-- Insert into Direhorse
INSERT INTO Direhorse (comprimento_antena, id_criatura, id_planicie) VALUES (1.5, 2, 1);

-- Insert into Leonopteryx
INSERT INTO Leonopteryx (cor1, cor2, envergadura_asas, id_criatura, id_vale) VALUES ('Azul', 'Vermelho', 30, 3, 1);

-- Insert into Thanator
INSERT INTO Thanator (forca, velocidade_max, id_criatura, id_vale) VALUES (1000, 80, 4, 1);

-- Insert into Banshee
INSERT INTO Banshee (altura_max_voo, cor_predominante, id_criatura, id_montanha) VALUES (2000, 'Verde', 5, 1);

-- Insert into Emprega_Cientista
INSERT INTO Emprega_Cientista (id_laboratorio, id_cientista) VALUES (1, 1);
INSERT INTO Emprega_Cientista (id_laboratorio, id_cientista) VALUES (1, 2);
INSERT INTO Emprega_Cientista (id_laboratorio, id_cientista) VALUES (1, 3);
INSERT INTO Emprega_Cientista (id_laboratorio, id_cientista) VALUES (1, 4);
INSERT INTO Emprega_Cientista (id_laboratorio, id_cientista) VALUES (1, 5);
INSERT INTO Emprega_Cientista (id_laboratorio, id_cientista) VALUES (1, 6);
INSERT INTO Emprega_Cientista (id_laboratorio, id_cientista) VALUES (1, 7);
INSERT INTO Emprega_Cientista (id_laboratorio, id_cientista) VALUES (1, 8);
INSERT INTO Emprega_Cientista (id_laboratorio, id_cientista) VALUES (1, 9);
INSERT INTO Emprega_Cientista (id_laboratorio, id_cientista) VALUES (1, 10);
INSERT INTO Emprega_Cientista (id_laboratorio, id_cientista) VALUES (1, 11);
INSERT INTO Emprega_Cientista (id_laboratorio, id_cientista) VALUES (1, 12);

-- Insert into Desenvolve
INSERT INTO Desenvolve (id_laboratorio, id_cientista, id_pesquisa) VALUES (1, 1, 1);

-- Insert into Utiliza
INSERT INTO Utiliza (id_pesquisa, id_equipamento) VALUES (1, 1);

-- Insert into Conecta_com
INSERT INTO Conecta_com (id_criatura1, id_criatura2, relacao) VALUES (1, 2, 'Simbiose');

-- Insert into Se_relaciona
INSERT INTO Se_relaciona (id_cla, id_arvore) VALUES (1, 1);

-- Insert into É_Dominado_Por
INSERT INTO É_Dominado_Por (id_banshee, id_na_vi) VALUES (1, 1);