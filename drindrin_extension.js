// Exibe a DIV de insercao dos dados do(a) servidor(a) para formatacao
document.addEventListener('DOMContentLoaded', function() {
    const btEndereco = document.getElementById('bt-endereco');
    const divMontarEndereco = document.getElementById('montar-endereço');
    
    btEndereco.addEventListener('click', function() {
        // Toggle: se estiver visível, esconde; se estiver escondido, mostra
        divMontarEndereco.classList.toggle('show');
        const iptDadosServidor = document.getElementById('dados-servidor');
        iptDadosServidor.focus()
    });
});

