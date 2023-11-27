//@niallivmi   
var BLigDes // Variável global para o botão de Ligar e Desligar herdado do HTML
var BConexao // Variável global para o botão de Conectar e Desconectar herdado do HTML
var socket = null // Variável global para a conexão WebSocket
let janela // Variável para abrir janela do Cronômetro
var BTempo // Variável global para o botão Cronômetro herdado do HTML
var connectDataQueue = [] // Fila para armazenar os dados de conectar/desconectar
var horaClique

window.addEventListener('load', function() {
    BLigDes = document.getElementById('BLigDes') // Herda o botão de Ligar e Desligar do HTML
    BConexao = document.getElementById('BConexao') // Herda o botão de Conectar e Desconectar do HTML
    BTempo = document.getElementById('BTempo') // Herda o botão de Cronômetro

    BLigDes.addEventListener('click', LigarDesligar) // Evento de clique no botão de Ligar e Desligar
    BConexao.addEventListener('click', ConectarDesconectar) // Evento do clique no botão de Conectar e Desconectar
    BTempo.addEventListener('click', Abrir) // Evento do clique no botão do Cronômetro

    // Função de Ligar e Desligar
    function LigarDesligar() {
        // Altera a palavra do botão
        var BValor = BLigDes.textContent === 'Ligar' ? 'Desligar' : 'Ligar' 
        BLigDes.textContent = BValor

        // Captura a hora do clique
        horaClique = new Date().toISOString()

        // Envia os dados para a porta COM5
        if (socket !== null && socket.readyState === WebSocket.OPEN) {
            if (BValor === 'Ligar') {
                socket.send('0')
            } else if (BValor === 'Desligar') {
                socket.send('1')
            }
        }
    }

    // Função de Conectar e Desconectar
    function ConectarDesconectar() {
        // Altera a palavra do botão
        var BValor = BConexao.textContent === 'Conectar' ? 'Desconectar' : 'Conectar'
        BConexao.textContent = BValor

        // Captura a hora do clique
        horaClique = new Date().toISOString()

        // Condição para Conectar ao servidor WebSocket no host localhost:8080
        if (BValor === 'Desconectar' && (socket === null || socket.readyState === WebSocket.CLOSED)) {
            socket = new WebSocket('ws://localhost:8080') // Cria uma nova conexão WebSocket

            // Evento ao conectar ao servidor
            socket.onopen = function() {
                console.log('Conexão estabelecida com o servidor')

                // Envia os dados da fila de conectar/desconectar
                while (connectDataQueue.length > 0) {
                    socket.send(connectDataQueue.shift())
                }

                // Envia os dados para a porta COM4
                if (socket !== null) {
                    if (BValor === 'Desconectar') {
                        socket.send('2')
                    } else if (BValor === 'Conectar') {
                        socket.send('3')
                    }
                 }
            }

            // Evento ao desconectar do servidor
            socket.onclose = function() {
                console.log('Conexão encerrada com o servidor')
                socket = null // Define o valor da variável como null
            }

            // Evento caso ocorra erro com a conexão
            socket.onerror = function(event) {
                console.error('Erro na conexão com o servidor:', event)
            }

        } else if (BValor === 'Conectar' && socket !== null && socket.readyState === WebSocket.OPEN) {
            socket.send('3')
            socket.close() // Fecha a conexão WebSocket existente
            socket = null // Define o valor da variável para null
        }
    }

    // Abre janela para enviar hora
    function Abrir() {
        if (socket !== null && socket.readyState === WebSocket.OPEN) {
            socket.send('4')
        }
        janela = window.open('cronometro.html', '', 'width=350, height=300')
    }
});
