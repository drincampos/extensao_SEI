document.addEventListener('DOMContentLoaded', function() {

    const btEndereco = document.getElementById('bt-endereco');
    const divMontarEndereco = document.getElementById('montar-endereço');
    const btFormatar = document.getElementById('bt-formatar');
    const dadosServidor = document.getElementById('dados-servidor');
    const dadosFormatados = document.getElementById('dados-formatados');

    function inserirTextoNoFormulario(texto) {
    // Clica na imagem com id que começa com "iconCOMP"
    const img = [...document.querySelectorAll("img")].find(img => img.id.startsWith("iconCOMP"));
    if (img) img.click();

    // Aguarda e continua
    setTimeout(() => {
        const btnNovo = document.getElementById("betnNovo");
        if (btnNovo) btnNovo.click();

        setTimeout(() => {
        const textarea = document.getElementById("txaDescricao");
        if (textarea) {
            textarea.value = texto;

            const btnCadastrar = document.querySelector('button[name="sbmCadastrarComentario"]');
            if (btnCadastrar) btnCadastrar.click();
        } else {
            console.warn("Textarea não encontrado.");
        }
        }, 1000);
    }, 500);
    }

    // Toggle da div ao clicar no botão "Montar endereço"
    btEndereco.addEventListener('click', function() {
        divMontarEndereco.classList.toggle('show');
    });
    
    // Formatar endereço ao clicar no botão "Formatar Endereço"
    btFormatar.addEventListener('click', function() {
        const texto = dadosServidor.value.trim();
        
        // Verificar se a textarea está vazia
        if (texto === '') {
            alert('Por favor, insira os dados do servidor(a) antes de formatar.');
            dadosServidor.focus();
            return;
        }
        
        // Extrair dados do texto
        const dados = {};
        const linhas = texto.split('\n');
        
        linhas.forEach(linha => {
            const partes = linha.split(':');
            if (partes.length >= 2) {
                const chave = partes[0].trim();
                const valor = partes.slice(1).join(':').trim();
                dados[chave] = valor;
            }
        });
        
        // Formatar o endereço com os campos disponíveis
        let enderecoFormatado = 'Ao(Á) Senhor(a)\n';
        
        // Adicionar nome se existir
        if (dados['Nome']) {
            enderecoFormatado += `${dados['Nome']}\n`;
        }
        
        // Montar linha de endereço
        const partes = [];
        if (dados['Logradouro']) partes.push(dados['Logradouro']);
        if (dados['Numero']) partes.push(dados['Numero']);
        if (dados['Complemento']) partes.push(`- ${dados['Complemento']}`);
        if (dados['Bairro']) partes.push(`- ${dados['Bairro']}`);
        
        if (partes.length > 0) {
            enderecoFormatado += partes.join(' ') + '\n';
        }
        
        // Montar linha de CEP/Cidade/UF
        const partesLocal = [];
        if (dados['CEP']) partesLocal.push(dados['CEP']);
        if (dados['Cidade']) partesLocal.push(dados['Cidade']);
        if (dados['UF']) partesLocal.push(dados['UF']);
        
        if (partesLocal.length > 0) {
            enderecoFormatado += partesLocal.join(' - ') + '\n';
        }
        
        // Adicionar email se existir
        if (dados['Email']) {
            enderecoFormatado += dados['Email'];
        }

        try {
            
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: inserirTextoNoFormulario,
                args: [texto],
                });
            });

        } catch(e) {
            alert("Não foi possível criar a nota. Insira os dados manualmente")
        }
        
        // Inserir texto formatado na textarea
        dadosFormatados.value = enderecoFormatado;
        
        // Dar foco e selecionar o texto
        dadosFormatados.focus();
        dadosFormatados.select();
    });
});