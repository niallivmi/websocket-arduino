/* @niallivmi
Baixar as bibliotecas antes de utilizar o código, basta utilizar npm install (librarie)
*/

// Requisição SerialPort para conectar COM5 - Arduino
const { SerialPort } = require("serialport")

// Construtor Port COM4
const port = new SerialPort({
    // Porta Serial
    path: "COM5",
    // Baudrate
    baudRate: 9600,
    dataBits: 8,
    stopBits: 1,
    parity: "none",
})
console.log('Conexão estabelecida: COM5')

// Requisição WebSocket para conectar 8080 - Site HTML
const WebSocket = require('ws')

// Importe a biblioteca node-schedule
const schedule = require('node-schedule');

// Construtor WS 8080 - localhost:8080
const server = new WebSocket.Server({ port: 8080 })

// "Conectado"
server.on('connection', (socket) => {
    console.log('Conexão estabelecida: localhost:8080')

    // Mensagem recebida por localhost:8080
    socket.on('message', (message) => {
        // A mensagem atribuída a varíavel message é demonstrada no console e enviada pela porta serial para o Arduino.
        console.log(`Mensagem recebida 'localhost:8080': ${message.toString()}`)

        // Converte a mensagem para Json
        const data = JSON.parse(message);

        // Verifica se houve agendamento
        if (data.scheduleAction === true) {
          agendarAcao(data.hora, data.acao);
        } else {
          // Caso não tenha ocorrido agendamento
          // Mensagem para a COM5
          port.write(message.toString())
        }

        // Chamar a função para armazenar o evento, botão, comando e horário no banco de dados
        const botaoId = message.toString()
        storeButtonClickEvent(botaoId)
    })

// "Desconectado"
    socket.on('close', () => {
        console.log('Conexão fechada: localhost:8080')
    })
})

// Requisição Mysql para conectar com o MySql
const mysql = require('mysql2')

// Configurações da conexão
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Batata600237084!',
    database: 'conexao_node'
})

// Teste de conexão
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL: ', err)
        return
    }
    console.log('Conexão estabelecida: MySQL')
})

// Função para armazenar o evento, botão, comando e horário no banco de dados
function storeButtonClickEvent(botaoId) {
  // Requisição para timezone
  const moment = require('moment')
  require('moment-timezone')
  const horaData = moment().tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss')

  let comando

  // Switch para definir o comando do botão
 switch (botaoId) {
  case '1':
    comando = 'Ligar'
    break
  case '0':
    comando = 'Desligar'
    break
  case '2':
    comando = 'Conectar'
    break
  case '3':
    comando = 'Desconectar'
    break
  case '4':
    comando = 'Cronômetrar'
    break
  default:
    comando = 'Desconhecido'
    break
}

  // Query para armazenar o evento
  const sql = 'INSERT INTO registros (ID_BOTÃO, COMANDO, HORÁRIO) VALUES (?, ?, ?)'
  const values = [getButtonName(botaoId), comando, horaData]
    
  // Trata a query
  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Erro ao armazenar os dados no MySQL:', err)
      return
    }
    console.log('Dados armazenados no MySQL:', result.affectedRows + ' registro(s) inserido(s)')
  })}

// Função para obter o nome do botão com base nos dados recebidos
function getButtonName(data) {
    if (data === '1' || data === '0') {
        return 'Ligar/Desligar';
    } else if (data === '2' || data === '3') {
        return 'Conectar/Desconectar';
    } else if (data === '4') {
        return 'Cronômetro'
    }
    else {
        return 'Desconhecido';
    }
}

// Encerrar a conexão MySQL
 server.on('close', () => {
    connection.end()
    console.log('Conexão fechada: MySQL')
})

// Agenda a ação de ligar ou desligar
function agendarAcao(hora, acao) {
  const [horas, minutos] = hora.split(':');

  // Cria uma regra de agendamento para a hora e minutos especificados
  const regra = new schedule.RecurrenceRule();
  regra.hour = parseInt(horas);
  regra.minute = parseInt(minutos);

  console.log(`Ação ${acao} agendada para ${hora}`);

  // Agenda a ação (ligar ou desligar) na hora especificada
    schedule.scheduleJob(regra, function () {
    
    // Execute a ação desejada aqui (por exemplo, enviar '1' para ligar ou '0' para desligar)
    if (acao === 'ligar') {
      port.write('1'); // Envie o comando para ligar o LED no Arduino
    } else if (acao === 'desligar') {
      port.write('0'); // Envie o comando para desligar o LED no Arduino
    }
  });
}