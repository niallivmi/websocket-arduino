const socket = new WebSocket('ws://localhost:8080');

var BRLigDes; // Variável global para o botão de rádio "Ligar" herdado do HTML
var IHora; // Variável global para o campo de horário herdado do HTML
var Formulario; // Variável global para o formulário herdado do HTML
var Enviar;

window.addEventListener('load', function () {
  // Herda o valor do botão de rádio
  BRLigDes = document.querySelector('input[name="LigDes"]:checked');
  // Herda o valor do campo de horário
  IHora = document.getElementById('Hora');
  Enviar = document.getElementById('Enviar');
  // Herda o formulário do HTML
  Formulario = document.getElementById('Formulario');

  Formulario.addEventListener('submit', function (event) {
    // Impede o envio padrão do formulário
    event.preventDefault();
  });

  Enviar.addEventListener('click', function () {
    // Atualiza o valor do botão de rádio
    BRLigDes = document.querySelector('input[name="LigDes"]:checked');
    // Verifica o valor do botão de rádio
    var DLigDes = BRLigDes.value === '1' ? 1 : 0;
    var DHora = IHora.value;

    // Verifica se a hora é válida
    if (DHora.trim() !== '') {
      EnviarDados(DLigDes, DHora);
      Formulario.reset();
    } else {
      alert('Por favor, insira uma hora válida antes de enviar.');
    }
  });

  // Função de enviar os dados
  function EnviarDados(DLigDes, DHora) {
    console.log('Ligar/Desligar:', DLigDes);
    console.log('Hora:', DHora);
  
    // Envia os dados de maneira correta
    if (socket !== null && socket.readyState === WebSocket.OPEN) {
      const dados = {
        scheduleAction: true,
        hora: DHora,
        acao: DLigDes === 1 ? 'ligar' : 'desligar',
      };
      const dadosJson = JSON.stringify(dados);
      socket.send(dadosJson);
    }
  } 
});
