document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const idFilme = params.get('id');
    
    const divDetalhes = document.getElementById('detalhes');
    const resultadoVotos = document.getElementById('resultadoVotos');
    const selectVoto = document.getElementById('votoClassificacao');
    const btnVotar = document.getElementById('btnVotar');

    const API_BASE = "https://filmes-api-dev.onrender.com/api";

    if (!idFilme) {
        divDetalhes.innerHTML = `
          <div style="text-align: center; padding: 50px; background: white; border-radius: 16px; box-shadow: 0 8px 20px rgba(0,0,0,0.1);">
            <i class="fas fa-exclamation-triangle" style="font-size: 4rem; color: #FF6B6B; margin-bottom: 20px;"></i>
            <h2 style="color: #333;">Ops! Filme não encontrado</h2>
            <p style="color: #666; font-size: 1.2rem;">O link parece estar incompleto.</p>
            <a href="index.html" class="btn" style="margin-top: 20px;">
              <i class="fas fa-arrow-left"></i> Voltar para Catálogo
            </a>
          </div>
        `;
        return;
    }

    // --- FUNÇÕES AUXILIARES ---

    function obterFavoritos() {
        return JSON.parse(localStorage.getItem('filmesFavoritos')) || [];
    }

    function salvarFavoritos(favoritos) {
        localStorage.setItem('filmesFavoritos', JSON.stringify(favoritos));
    }

    function toggleFavorito(filme) {
        const favoritos = obterFavoritos();
        const index = favoritos.findIndex(fav => fav.id === filme.id);
        
        if (index === -1) favoritos.push(filme);
        else favoritos.splice(index, 1);
        
        salvarFavoritos(favoritos);
    }

    function mostrarVotos(dadosVotos) {
        const dados = dadosVotos || {};
        const chaves = ["0","10","12","14","16","18"];
        chaves.forEach(k => { if(!dados[k]) dados[k] = 0; });
        
        const totalVotos = Object.values(dados).reduce((a, b) => a + b, 0);

        resultadoVotos.innerHTML = `
          <h4 style="margin-bottom:20px; color:#333;">Resultado dos votos (${totalVotos} votos no total):</h4>
          <div class="lista-votos">
            ${chaves.map(key => {
              const qtd = dados[key];
              const porcentagem = totalVotos > 0 ? (qtd / totalVotos * 100).toFixed(1) : 0;
              
              const iconesPadrao = {
                "0": '<i class="fas fa-child" style="color:green; font-size:1.5rem;"></i>',
                "10": '<i class="fas fa-user-friends" style="color:blue; font-size:1.5rem;"></i>',
                "12": '<i class="fas fa-user-graduate" style="color:orange; font-size:1.5rem;"></i>',
                "14": '<i class="fas fa-user-check" style="color:purple; font-size:1.5rem;"></i>',
                "16": '<i class="fas fa-user-shield" style="color:red; font-size:1.5rem;"></i>',
                "18": '<i class="fas fa-user-secret" style="color:darkred; font-size:1.5rem;"></i>'
              };
              
              const icone = iconesPadrao[key] || `<span>${key}</span>`;
              const label = key == "0" ? "Livre" : key + " anos";

              return `
                <div class="voto-item" style="display:flex; align-items:center; gap:15px; margin-bottom:15px; padding:15px; background:#F8F9FA; border-radius:16px; transition:all 0.3s ease;">
                  <div class="voto-info" style="display:flex; align-items:center; gap:12px; min-width:180px; font-weight:600;">
                    ${icone}
                    <span>${label}</span>
                    <span class="voto-contador" style="margin-left:auto; font-weight:bold; color:#FF6B6B;">${qtd} votos</span>
                  </div>
                  <div class="voto-barra-container" style="flex:1; height:20px; background:rgba(0,0,0,0.1); border-radius:10px; overflow:hidden;">
                    <div class="voto-barra" style="height:100%; background:linear-gradient(135deg, #FF6B6B, #A05CFF); border-radius:10px; transition:width 0.5s ease; width: ${porcentagem}%"></div>
                  </div>
                  <span class="voto-porcentagem" style="min-width:60px; text-align:right; font-weight:bold; color:#333;">${porcentagem}%</span>
                </div>
              `;
            }).join("")}
          </div>
        `;
    }

    // --- BUSCAR DADOS NA API ---
    fetch(`${API_BASE}/filmes/${idFilme}`)
        .then(res => res.json())
        .then(filme => {
            if (filme.erro) {
                // Seu layout de erro
                divDetalhes.innerHTML = `
                  <div style="text-align: center; padding: 50px; background: white; border-radius: 16px; box-shadow: 0 8px 20px rgba(0,0,0,0.1);">
                    <i class="fas fa-exclamation-triangle" style="font-size: 4rem; color: #FF6B6B; margin-bottom: 20px;"></i>
                    <h2 style="color: #333;">Ops! Filme não encontrado</h2>
                    <a href="index.html" class="btn" style="margin-top: 20px;">
                      <i class="fas fa-arrow-left"></i> Voltar para Catálogo
                    </a>
                  </div>
                `;
                return;
            }


            const favoritos = obterFavoritos();
            const isFavorito = favoritos.some(fav => fav.id === filme.id);

  
            let imagem_capa = filme.capa_link ? 
                `<img src="${filme.capa_link}" class="capa-img" alt="${filme.nome}" style="width:100%; border-radius:16px; box-shadow:0 8px 20px rgba(0,0,0,0.1);">` : 
                '<div class="sem-capa-detalhes" style="height:400px; background:linear-gradient(135deg, #FF9E9E, #A05CFF); display:flex; align-items:center; justify-content:center; border-radius:16px; color:white; font-size:4rem;"><i class="fas fa-film"></i></div>';

            let icone_classif = filme.icone_classif ? 
                `<img src="${filme.icone_classif}" style="width:40px; height:40px; object-fit:contain;" alt="${filme.classif}">` : 
                `<span style="font-size:1.3rem; font-weight:600;">${filme.classificacao == 0 ? "Livre" : filme.classificacao + " anos"}</span>`;


            divDetalhes.innerHTML = `
                <div class="detalhes-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; flex-wrap:wrap; gap:20px; background:white; padding:25px; border-radius:16px; box-shadow:0 8px 20px rgba(0,0,0,0.1);">
                  <h1 class="titulo-principal" style="font-size:2.5rem; margin:0; background:linear-gradient(135deg, #FF6B6B, #A05CFF); -webkit-background-clip:text; -webkit-text-fill-color:transparent; font-weight:700;">${filme.nome}</h1>
                  <button id="btnFavoritarDetalhes" class="btn-favoritar ${isFavorito ? 'favoritado' : ''}" style="background:transparent; border:none; color:${isFavorito ? '#FF6B6B' : '#666'}; cursor:pointer; font-size:1.5rem; transition:all 0.3s ease; padding:10px; border-radius:50%;">
                    <i class="fas fa-heart"></i> ${isFavorito ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                  </button>
                </div>

                <div class="detalhes-container" style="display:grid; grid-template-columns:1fr 2fr; gap:30px; margin-bottom:30px;">
                  <div class="coluna-esquerda">
                    ${imagem_capa}
                    <p class="ano-texto" style="margin-top:15px; text-align:center; color:#333; font-size:1.2rem; font-weight:600; background:#F8F9FA; padding:10px; border-radius:12px;"><i class="far fa-calendar-alt" style="color:#4ECDC4; margin-right:8px;"></i> Ano: ${filme.ano || "N/A"}</p>
                  </div>

                  <div class="coluna-direita">
                    <div class="info-box" style="background:white; padding:25px; border-radius:16px; margin-bottom:20px; box-shadow:0 8px 20px rgba(0,0,0,0.1); border-left:5px solid #4ECDC4;">
                      <h3 style="margin-bottom:15px; display:flex; align-items:center; gap:10px; color:#333; font-size:1.4rem;"><i class="fas fa-certificate" style="color:#4ECDC4;"></i> Classificação oficial</h3>
                      <div class="classificacao-detalhes" style="display:flex; align-items:center; gap:15px; font-size:1.3rem; font-weight:600;">
                        ${icone_classif}
                        <span>${filme.classificacao == 0 ? "Livre - Para todas as idades" : `A partir de ${filme.classificacao} anos`}</span>
                      </div>
                    </div>

                    <div class="info-box" style="background:white; padding:25px; border-radius:16px; margin-bottom:20px; box-shadow:0 8px 20px rgba(0,0,0,0.1); border-left:5px solid #4ECDC4;">
                      <h3 style="margin-bottom:15px; display:flex; align-items:center; gap:10px; color:#333; font-size:1.4rem;"><i class="fas fa-tags" style="color:#4ECDC4;"></i> Descritores de conteúdo</h3>
                      <p class="descriptores-box" style="background:#F8F9FA; padding:20px; border-radius:16px; line-height:1.6; font-size:1.1rem;">${filme.descritores || "Não informado"}</p>
                    </div>
                  </div>
                </div>

                <div class="sinopse-container" style="background:white; padding:30px; border-radius:16px; box-shadow:0 8px 20px rgba(0,0,0,0.1); border-left:5px solid #FFD166;">
                  <h3 style="margin-bottom:20px; display:flex; align-items:center; gap:10px; color:#333; font-size:1.5rem;"><i class="fas fa-book-open" style="color:#FFD166;"></i> Sinopse</h3>
                  <p class="sinopse-texto" style="line-height:1.7; font-size:1.1rem; color:#333;">${filme.sinopse || "Sinopse não disponível."}</p>
                </div>
            `;

            //botão Favoritar
            const btnFav = document.getElementById('btnFavoritarDetalhes');
            btnFav.addEventListener('click', function() {
                toggleFavorito(filme);
                const agoraFavoritado = !isFavorito;
             
                btnFav.classList.toggle('favoritado');
                btnFav.innerHTML = `<i class="fas fa-heart"></i> ${agoraFavoritado ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}`;
                btnFav.style.color = agoraFavoritado ? '#FF6B6B' : '#666';
                window.location.reload();
            });

            mostrarVotos(filme.classif_votos);
        })
        .catch(err => {
            console.error("Erro ao carregar:", err);
            divDetalhes.innerHTML = `<p style='text-align:center'>Erro de conexão com o servidor.</p>`;
        });

    // --- EVENTO DE VOTAR (ENVIAR PARA A API) ---
    if(btnVotar) {
        btnVotar.addEventListener('click', () => {
            const valor = selectVoto.value;
            
            if (!valor) {
                alert("Escolha uma classificação antes de votar.");
                return;
            }

            if (localStorage.getItem(`votou_filme_${idFilme}`)) {
                alert("Você já votou neste filme!");
                return;
            }

            // Envia para o Banco
            fetch(`${API_BASE}/votar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    obra_id: idFilme,
                    classif_escolhida: valor
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.mensagem) {
                    alert("Seu voto foi registrado! Obrigado por participar! 😊");
                    localStorage.setItem(`votou_filme_${idFilme}`, "true");
                    window.location.reload();
                } else {
                    alert("Erro ao votar: " + (data.erro || "Erro desconhecido"));
                }
            })
            .catch(err => console.error("Erro no voto:", err));
        });
    }

    // --- ESTILOS RESPONSIVOS ---
    const style = document.createElement('style');
    style.textContent = `
      @media (max-width: 768px) {
        .detalhes-container { grid-template-columns: 1fr !important; }
        .detalhes-header { flex-direction: column; align-items: flex-start; }
        .titulo-principal { font-size: 2rem !important; }
        .voto-item { flex-direction: column; align-items: flex-start; gap: 10px; }
        .voto-info, .voto-barra-container { width: 100%; }
      }
    `;
    document.head.appendChild(style);
});
