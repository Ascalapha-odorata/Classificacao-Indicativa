document.addEventListener('DOMContentLoaded', function() {
  const inputBusca = document.getElementById('txtPesquisa');
  const enterBusca = document.getElementById('btnPesquisa');
  const selectClassif = document.getElementById('filtroClassificacao');
  const checkClassifMax = document.getElementById('checkMax');
  const btnFavoritos = document.getElementById('btnFavoritos');
  const btnTodos = document.getElementById('btnTodos');
  const btnFavoritosView = document.getElementById('btnFavoritosView');
  const modalFavoritos = document.getElementById('modalFavoritos');
  const closeModal = document.querySelector('.close');
  const listaFavoritos = document.getElementById('listaFavoritos');
  const contadorFavoritos = document.getElementById('contadorFavoritos');
  const loading = document.getElementById('loading');
  const resultadoDiv = document.getElementById('resultado');
  
  let filmes = [];
  let modoExibicao = 'todos';

  // Inicialização
  atualizarContadorFavoritos();
  buscarFilmes();
  
  // Event Listeners
  enterBusca.addEventListener('click', buscarFilmes);
  inputBusca.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') buscarFilmes();
  });
  
  btnFavoritos.addEventListener('click', abrirModalFavoritos);
  closeModal.addEventListener('click', fecharModalFavoritos);
  window.addEventListener('click', function(e) {
    if (e.target === modalFavoritos) fecharModalFavoritos();
  });
  
  btnTodos.addEventListener('click', function() {
    modoExibicao = 'todos';
    btnTodos.classList.add('ativo');
    btnFavoritosView.classList.remove('ativo');
    exibirFilmes();
  });
  
  btnFavoritosView.addEventListener('click', function() {
    modoExibicao = 'favoritos';
    btnFavoritosView.classList.add('ativo');
    btnTodos.classList.remove('ativo');
    exibirFilmes();
  });

  // Buscar filmes na API
  function buscarFilmes() {
    loading.classList.add('mostrar');
    resultadoDiv.innerHTML = '';
    
    const textoDigitado = inputBusca.value;
    const classificacao = selectClassif.value;
    const check_max = checkClassifMax.checked;

    let url_inicial = "https://filmes-api-dev.onrender.com/api/filmes";
    let parametros = [];

    if (textoDigitado.trim() !== "") {
      parametros.push("nome=" + encodeURIComponent(textoDigitado));
    }

    if (classificacao.trim() !== "") {
      if (check_max) {
        parametros.push("classificacao_max=" + classificacao);
      } else {
        parametros.push("classificacao=" + classificacao);
      }
    }

    let url_final = url_inicial;
    if (parametros.length > 0) {
      url_final += "?" + parametros.join("&");
    }

    fetch(url_final, { method: 'GET', headers: { 'Accept': 'application/json' } })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro na resposta da API');
        }
        return response.json();
      })
      .then(dados => {
        // Adicionar sinopses genéricas se não existirem
        filmes = Array.isArray(dados) ? dados.map(adicionarSinopseGenerica) : [];
        loading.classList.remove('mostrar');
        exibirFilmes();
      })
      .catch(error => {
        console.error('Erro na requisição:', error);
        loading.classList.remove('mostrar');
        resultadoDiv.innerHTML = `
          <div class="lista-vazia">
            <i class="fas fa-exclamation-triangle"></i>
            <p>Erro ao carregar filmes. Tente novamente.</p>
            <button class="btn" onclick="window.location.reload()"><i class="fas fa-redo"></i> Tentar Novamente</button>
          </div>
        `;
      });
  }

  // Função para adicionar sinopse genérica se não existir
  function adicionarSinopseGenerica(filme) {
    if (!filme.sinopse && !filme.descricao) {
      // Gerar sinopse genérica baseada no nome e classificação
      const classificacao = filme.classificacao || 0;
      const sinopsesGenericas = {
        0: `"${filme.nome}" é um filme divertido e educativo perfeito para crianças de todas as idades! Com personagens cativantes e aventuras emocionantes, esta história ensina valiosas lições sobre amizade e trabalho em equipe de forma lúdica e envolvente.`,
        10: `Em "${filme.nome}", jovens heróis embarcam em uma jornada incrível cheia de descobertas e desafios. Uma narrativa perfeita para crianças a partir de 10 anos, combinando diversão, aventura e importantes valores familiares.`,
        12: `"${filme.nome}" apresenta uma trama envolvente com elementos de aventura e comédia, ideal para o público adolescente. A história equilibra ação e desenvolvimento de personagens, abordando temas relevantes para jovens em formação.`,
        14: `Este filme oferece uma experiência cinematográfica mais complexa, com narrativa elaborada e temas que ressoam com o público adolescente. "${filme.nome}" combina entretenimento com reflexões sobre identidade e relacionamentos.`,
        16: `Uma produção madura que explora temas complexos através de uma narrativa sofisticada. "${filme.nome}" é indicado para jovens adultos, apresentando discussões relevantes e personagens bem desenvolvidos.`,
        18: `Filme com conteúdo adulto e temas complexos, direcionado para o público maduro. "${filme.nome}" oferece uma experiência cinematográfica intensa e reflexiva.`
      };
      
      filme.sinopse = sinopsesGenericas[classificacao] || `"${filme.nome}" é uma produção cinematográfica que promete entreter e emocionar o público. Com elementos únicos e uma narrativa cativante, este filme é uma excelente opção para assistir em família.`;
    }
    
    // Garantir que tenha uma descrição também
    if (!filme.descricao) {
      filme.descricao = filme.sinopse;
    }
    
    return filme;
  }

  // Exibir filmes na tela
  function exibirFilmes() {
    resultadoDiv.innerHTML = "";

    let filmesParaExibir = filmes;
    
    if (modoExibicao === 'favoritos') {
      const favoritos = obterFavoritos();
      filmesParaExibir = filmes.filter(filme => 
        favoritos.some(fav => fav.id === filme.id)
      );
    }

    if (filmesParaExibir.length <= 0) {
      resultadoDiv.innerHTML = `
        <div class="lista-vazia">
          <i class="fas fa-film"></i>
          <p>${modoExibicao === 'favoritos' ? 'Nenhum filme favoritado ainda.' : 'Nenhum filme encontrado.'}</p>
          ${modoExibicao === 'favoritos' ? '<p>Adicione filmes aos favoritos clicando no coração!</p>' : ''}
        </div>
      `;
    } else {
      filmesParaExibir.forEach(filme => {
        const card = criarCardFilme(filme);
        resultadoDiv.appendChild(card);
      });
    }
  }

  // Criar card de filme
  function criarCardFilme(filme) {
    const card = document.createElement('div');
    card.className = 'card-filme';
    
    // Verificar se é favorito
    const favoritos = obterFavoritos();
    const isFavorito = favoritos.some(fav => fav.id === filme.id);

    // Imagem da capa
    if (filme.capa_link) {
      const imagem_capa = document.createElement('img');
      imagem_capa.className = 'capa';
      imagem_capa.src = filme.capa_link;
      imagem_capa.alt = filme.nome;
      imagem_capa.onerror = function() {
        this.style.display = 'none';
        const semCapa = document.createElement('div');
        semCapa.className = 'sem-capa';
        semCapa.innerHTML = '<i class="fas fa-film"></i>';
        card.appendChild(semCapa);
      };
      card.appendChild(imagem_capa);
    } else {
      const semCapa = document.createElement('div');
      semCapa.className = 'sem-capa';
      semCapa.innerHTML = '<i class="fas fa-film"></i>';
      card.appendChild(semCapa);
    }

    // Informações básicas
    const info = document.createElement('div');
    info.className = 'info';
    
    // Título
    const titulo = document.createElement('h3');
    titulo.textContent = filme.nome;
    info.appendChild(titulo);
    
    // Classificação
    const classifContainer = document.createElement('div');
    classifContainer.className = 'classificacao-container';
    
    if (filme.icone_classif) {
      const icone_idade = document.createElement('img');
      icone_idade.className = 'icone_classif';
      icone_idade.src = filme.icone_classif;
      icone_idade.alt = filme.classificacao;
      classifContainer.appendChild(icone_idade);
    }
    
    const classifText = document.createElement('span');
    classifText.textContent = (filme.classificacao == 0)
      ? "Livre"
      : filme.classificacao + " anos";
    classifContainer.appendChild(classifText);
    
    info.appendChild(classifContainer);
    
    // Descritores
    const descritoresEl = document.createElement('p');
    descritoresEl.className = 'descritores';
    
    if (filme.descritores && filme.descritores.trim() !== "") {
      descritoresEl.textContent = "🔖 " + filme.descritores;
    } else {
      descritoresEl.textContent = "🔖 Descritores não informados";
    }
    
    info.appendChild(descritoresEl);
    
    // Ações
    const acoes = document.createElement('div');
    acoes.className = 'acoes';
    
    const btnFavoritar = document.createElement('button');
    btnFavoritar.className = `btn-favoritar ${isFavorito ? 'favoritado' : ''}`;
    btnFavoritar.innerHTML = '<i class="fas fa-heart"></i>';
    btnFavoritar.title = isFavorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos';
    btnFavoritar.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleFavorito(filme);
      btnFavoritar.classList.toggle('favoritado');
      btnFavoritar.title = btnFavoritar.classList.contains('favoritado') 
        ? 'Remover dos favoritos' 
        : 'Adicionar aos favoritos';
      atualizarContadorFavoritos();
      
      if (modoExibicao === 'favoritos') {
        exibirFilmes();
      }
    });
    
    acoes.appendChild(btnFavoritar);
    info.appendChild(acoes);
    
    card.appendChild(info);
    
    // Overlay com sinopse
    const overlay = document.createElement('div');
    overlay.className = 'card-overlay';
    
    const sinopse = document.createElement('div');
    sinopse.className = 'sinopse-overlay';
    
    // Usar sinopse gerada se necessário
    let textoSinopse = filme.sinopse || filme.descricao || "Sinopse não disponível para este filme.";
    sinopse.textContent = textoSinopse;
    overlay.appendChild(sinopse);
    
    const overlayAcoes = document.createElement('div');
    overlayAcoes.className = 'overlay-acoes';
    
    const btnVerDetalhes = document.createElement('button');
    btnVerDetalhes.className = 'btn';
    btnVerDetalhes.innerHTML = '<i class="fas fa-info-circle"></i> Ver Detalhes';
    btnVerDetalhes.addEventListener('click', function(e) {
      e.stopPropagation();
      abrirDetalhes(filme);
    });
    
    const btnFavoritarOverlay = document.createElement('button');
    btnFavoritarOverlay.className = `btn-favoritar ${isFavorito ? 'favoritado' : ''}`;
    btnFavoritarOverlay.innerHTML = '<i class="fas fa-heart"></i>';
    btnFavoritarOverlay.title = isFavorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos';
    btnFavoritarOverlay.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleFavorito(filme);
      btnFavoritarOverlay.classList.toggle('favoritado');
      btnFavoritarOverlay.title = btnFavoritarOverlay.classList.contains('favoritado') 
        ? 'Remover dos favoritos' 
        : 'Adicionar aos favoritos';
      btnFavoritar.classList.toggle('favoritado');
      atualizarContadorFavoritos();
    });
    
    overlayAcoes.appendChild(btnVerDetalhes);
    overlayAcoes.appendChild(btnFavoritarOverlay);
    overlay.appendChild(overlayAcoes);
    
    card.appendChild(overlay);
    
    // Clique no card → abre detalhes
    card.addEventListener('click', () => {
      abrirDetalhes(filme);
    });

    return card;
  }

  // Abrir página de detalhes
  function abrirDetalhes(filme) {
    localStorage.setItem('filmeSelecionado', JSON.stringify(filme));
    window.location.href = `detalhes.html?id=${filme.id}`;
  }

  // Gerenciamento de favoritos
  function obterFavoritos() {
    return JSON.parse(localStorage.getItem('filmesFavoritos')) || [];
  }

  function salvarFavoritos(favoritos) {
    localStorage.setItem('filmesFavoritos', JSON.stringify(favoritos));
  }

  function toggleFavorito(filme) {
    const favoritos = obterFavoritos();
    const index = favoritos.findIndex(fav => fav.id === filme.id);
    
    if (index === -1) {
      favoritos.push(filme);
    } else {
      favoritos.splice(index, 1);
    }
    
    salvarFavoritos(favoritos);
    atualizarContadorFavoritos();
  }

  function atualizarContadorFavoritos() {
    const favoritos = obterFavoritos();
    contadorFavoritos.textContent = favoritos.length;
  }

  // Modal de favoritos
  function abrirModalFavoritos() {
    const favoritos = obterFavoritos();
    listaFavoritos.innerHTML = "";
    
    if (favoritos.length === 0) {
      listaFavoritos.innerHTML = `
        <div class="lista-vazia">
          <i class="far fa-heart"></i>
          <p>Nenhum filme favoritado ainda.</p>
          <p>Adicione filmes aos favoritos clicando no coração!</p>
        </div>
      `;
    } else {
      favoritos.forEach(filme => {
        const item = document.createElement('div');
        item.className = 'favorito-item';
        
        if (filme.capa_link) {
          const img = document.createElement('img');
          img.src = filme.capa_link;
          img.alt = filme.nome;
          img.onerror = function() {
            this.style.display = 'none';
            const semImg = document.createElement('div');
            semImg.style.width = '90px';
            semImg.style.height = '135px';
            semImg.style.background = 'linear-gradient(135deg, #FF9E9E, #A05CFF)';
            semImg.style.display = 'flex';
            semImg.style.alignItems = 'center';
            semImg.style.justifyContent = 'center';
            semImg.style.borderRadius = '12px';
            semImg.innerHTML = '<i class="fas fa-film" style="color: white; font-size: 2rem;"></i>';
            item.insertBefore(semImg, item.firstChild);
          };
          item.appendChild(img);
        } else {
          const semImg = document.createElement('div');
          semImg.style.width = '90px';
          semImg.style.height = '135px';
          semImg.style.background = 'linear-gradient(135deg, #FF9E9E, #A05CFF)';
          semImg.style.display = 'flex';
          semImg.style.alignItems = 'center';
          semImg.style.justifyContent = 'center';
          semImg.style.borderRadius = '12px';
          semImg.innerHTML = '<i class="fas fa-film" style="color: white; font-size: 2rem;"></i>';
          item.appendChild(semImg);
        }
        
        const info = document.createElement('div');
        info.className = 'favorito-info';
        
        const titulo = document.createElement('h3');
        titulo.textContent = filme.nome;
        info.appendChild(titulo);
        
        const classifContainer = document.createElement('div');
        classifContainer.className = 'classificacao-container';
        
        if (filme.icone_classif) {
          const icone = document.createElement('img');
          icone.className = 'icone_classif';
          icone.src = filme.icone_classif;
          icone.alt = filme.classificacao;
          classifContainer.appendChild(icone);
        }
        
        const classifText = document.createElement('span');
        classifText.textContent = (filme.classificacao == 0)
          ? "Livre"
          : filme.classificacao + " anos";
        classifContainer.appendChild(classifText);
        info.appendChild(classifContainer);
        
        const descritores = document.createElement('p');
        descritores.textContent = filme.descritores || "Descritores não informados";
        descritores.style.color = '#666';
        descritores.style.fontSize = '0.9rem';
        info.appendChild(descritores);
        
        item.appendChild(info);
        
        const acoes = document.createElement('div');
        acoes.className = 'favorito-acoes';
        
        const btnRemover = document.createElement('button');
        btnRemover.className = 'btn-remover-favorito';
        btnRemover.innerHTML = '<i class="fas fa-trash"></i>';
        btnRemover.title = 'Remover dos favoritos';
        btnRemover.addEventListener('click', function() {
          toggleFavorito(filme);
          abrirModalFavoritos();
          atualizarContadorFavoritos();
          exibirFilmes();
        });
        
        const btnDetalhes = document.createElement('button');
        btnDetalhes.className = 'btn';
        btnDetalhes.innerHTML = '<i class="fas fa-info-circle"></i> Detalhes';
        btnDetalhes.addEventListener('click', function() {
          abrirDetalhes(filme);
        });
        
        acoes.appendChild(btnDetalhes);
        acoes.appendChild(btnRemover);
        item.appendChild(acoes);
        
        listaFavoritos.appendChild(item);
      });
    }
    
    modalFavoritos.style.display = 'block';
  }

  function fecharModalFavoritos() {
    modalFavoritos.style.display = 'none';
  }
});
