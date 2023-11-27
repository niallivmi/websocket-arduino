int statusRelay; // Variável para armazenar o estado do relé

void setup() {
  Serial.begin(9600);
  // Configurar o pino do relé como saída
  pinMode(13, OUTPUT); // Suponha que você esteja usando o pino 13 para o controle do relé
  digitalWrite(13, HIGH); // Inicialmente, ligue o relé (HIGH)
}

void loop() {
  if (Serial.available() > 0) {
    statusRelay = Serial.read();
    if (statusRelay == '0') {
      digitalWrite(13, HIGH); // Desliga o relé (LOW)
    } else if (statusRelay == '1') {
      digitalWrite(13, LOW); // Liga o relé (HIGH)
    }
  }
}
