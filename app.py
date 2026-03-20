import os # para acessar variáveis de ambiente do sistema
import psycopg2 # lib que faz a conexão com um banco de dados PostgreSQL
from flask import Flask, jsonify, request
from flask_cors import CORS # cross origin resource sharing, libera acesso da api

from flask import render_template #
@app.route('/')
def index():
    return render_template('index.html')

#inicializa o app flask
app = Flask(__name__)
CORS(app) # habilita o cors em todas as rotas

# busca DATABASE_URL no ambiente dod sistema
# render configura a variável automaticamente
DATABASE_URL = os.environ.get('DATABASE_URL') #database

# conecta ao banco de dados
def get_db_connection():
    try:
        conexao = psycopg2.connect(DATABASE_URL) #psycopg2.connect() cria uma conexão tcp com o servidor postgresql e mantém uma sessão aberta até que close() seja chamado
        return conexao
    except Exception as e:
        print(f"Erro ao conectar ao banco: {e}")
        return None

def formatar_obra(colunas, obra_tupla): #transforma uma tupla em um dicionário
    return dict(zip(colunas, obra_tupla))


#busca os filmes e retorna como json
@app.route('/api/filmes')  # define a rota http get /api/filmes
def get_filmes():

    # pega os parâmetros da URL
    
    filtro_classif_unica = request.args.get('classificacao') # por clasificação indicativa ex: ?classificacao=10
    filtro_nome = request.args.get('nome') # por título ex: ?nome=Coraline
    filtro_classif_max = request.args.get('classificacao_max') # filmes até certa classificação máxima
    # se esses filtros não forem usados, o retorno será None
    
    conexao = get_db_connection() # tenta conectar ao banco
    if conexao is None:
        return jsonify({"erro": "Não foi possível conectar ao banco."}), 500
    
    cur = conexao.cursor() # cria um cursor: obj que envia comandos sql e recupera dados
        
    #consulta sendo construída dinamicamente
    
    query = "SELECT filmes.id, filmes.nome, filmes.ano, filmes.classificacao, filmes.descritores, filmes.capa_link, imagem_classificacao.imagem_url AS icone_classif FROM filmes LEFT JOIN imagem_classificacao ON filmes.classificacao = imagem_classificacao.valor"
    
    parametros = [] # onde serão colocados os valores
    condicoes = [] # lista para as condições 
    
    if filtro_nome:# se for diferente de None e de uma string vazia
        condicoes.append("nome ILIKE %s")
        parametros.append(f"%{filtro_nome}%")    
    
    if filtro_classif_unica:  
        condicoes.append("classificacao = %s") # %s é um espaço em branco para o psycopg2 
        parametros.append(filtro_classif_unica)
    
    if filtro_classif_max:
        condicoes.append("CAST(classificacao AS INTEGER) <= %s")
        parametros.append(filtro_classif_max)
        
    if condicoes: # se algum filtro foi aplicado
        query = query + (" WHERE ") + (" AND ".join(condicoes) ) #.join recebe lista de strings e junta elas com "AND" como separação

    query = query + ";" # fim da consulta
    
    cur.execute(query, tuple(parametros)) # excuta a query, precisa ser tuple() ou uma lista [ ]
        
    #pega os nomes das colunas
    colunas = []                         #quando é feito um cur.execute(), o cursor armazena os dados e informações sobre eles
    for col_descricao in cur.description: # cur.description retorna uma lista de tuplas, em que cada tupla descreve uma coluna
        colunas.append(col_descricao[0]) #o item de índice 0 é o nome da coluna
    
    
    # transforma os resultados em uma lista de dicionários
    obras = [] # lista de resultados
    for linha in cur.fetchall(): #nas linhas que vieram do banco, cur.fetchall() pega os resultados da consulta cur.execute()
        obras.append(formatar_obra(colunas, linha))
        #banco retorna lista de tuplas, func formatar tranforma a lista de tuplas em uma lista de dicionários, insere o dicionário na lista de resultados

    cur.close() #fecha a conexão
    conexao.close()
    
    return jsonify(obras) #retorna os dados como json





#busca os dados específicos da obra e retorna como json
@app.route('/api/filmes/<int:id_da_obra>')
def get_filme_detalhes(id_da_obra):
    
    conexao = get_db_connection() # tenta conectar ao banco
    if conexao is None:
        return jsonify({"erro": "Não foi possível conectar ao banco."}), 500

    cur = conexao.cursor() # cria um cursor: obj que envia comandos sql e recupera dados
    
    # faz a consulta
    parametros = []
    query = "SELECT filmes.id, filmes.nome, filmes.ano, filmes.classificacao, filmes.descritores, filmes.sinopse, filmes.capa_link, imagem_classificacao.imagem_url AS icone_classif FROM filmes LEFT JOIN imagem_classificacao ON filmes.classificacao = imagem_classificacao.valor WHERE filmes.id = %s;" # excuta uma query
    parametros.append(id_da_obra)
    
    try:
        cur.execute(query, tuple(parametros)) # excuta a query, precisa ser tuple() ou uma lista [ ]
    except Exception as e:
        print(f"Erro ao executar: {e}")
        cur.close()
        conexao.close()
        return jsonify({"erro": "Erro ao consultar o banco."}), 500
        
    obra = cur.fetchone()

    if obra is None: # verifica se id foi encontrado
        cur.close() 
        conexao.close()
        return jsonify({"erro": "Obra não encontrada"}), 404
        
    #pega os nomes das colunas
    colunas = []                         #quando é feito um cur.execute(), o cursor armazena os dados e informações sobre eles
    for col_descricao in cur.description: # cur.description retorna uma lista de tuplas, em que cada tupla descreve uma coluna
        colunas.append(col_descricao[0]) #o item de índice 0 é o nome da coluna
    
    # transforma o resultado em um dicionário
    obra_formatada = formatar_obra(colunas, obra)
    
    #parte das votações de classificação indicativa da comunidade
    parametros = []
    query_votos = "SELECT classif_escolhida, COUNT(*) FROM classif_votos WHERE obra_id = %s GROUP BY classif_escolhida;"
    parametros.append(id_da_obra)
    cur.execute(query_votos, tuple(parametros))
    
    votos = cur.fetchall() #lista de tuplas
    
   
    estatisticas = {}

    for col in votos:  #transforma em dicionario simples (chave, valor)
        classificacao = col[0] # classif_escolhida
        total_votos = col[1] #  COUNT(*)
        estatisticas[classificacao] = total_votos #total de votos para aquela opção de classificação
    
    # Coloca dentro do JSON do filme (im dicionario dentro do outro)
    obra_formatada['classif_votos'] = estatisticas
       
    cur.close() #fecha a conexão
    conexao.close()
    
    return jsonify(obra_formatada) #retorna os dados como json



#votos de classificação da comunidade
@app.route('/api/votar', methods=['POST'])  # define a rota http get /api/votar, e especifica que a requisição é do tipo post
def post_voto():
    informacoes = request.get_json() #faz o parsing do request json e retorna um dictionario python
    obra_id = informacoes.get('obra_id')
    cla_esc = informacoes.get('classif_escolhida')

    if obra_id is None or cla_esc is None:
        return jsonify({"erro": "Não foi possível votar!"}), 404


    conexao = get_db_connection() # tenta conectar ao banco
    if conexao is None:
        return jsonify({"erro": "Não foi possível conectar ao banco."}), 500

    cur = conexao.cursor() # cria um cursor: obj que envia comandos sql e recupera dados

    
    try:
        parametros = [] # onde serão colocados os valores
                
        parametros.append(obra_id)
        parametros.append(cla_esc)
        query = "INSERT INTO classif_votos (obra_id, classif_escolhida) VALUES (%s, %s);"
        cur.execute(query, tuple(parametros))

        conexao.commit()
        cur.close()
        conexao.close()

        return jsonify({"mensagem": "Votação concluida!"}), 201

    except Exception as e:
        return jsonify({"erro: Não foi possível votar! Erro: ": str(e) }), 500



