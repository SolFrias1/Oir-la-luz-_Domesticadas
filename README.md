# Domesticadas · La Ilusión de la Libertad

**Domesticadas** es una plataforma interactiva de sonificación y diseño periférico que explora la condición de la domesticación a través del contraste entre la imagen animal y la voz humana. A partir de una grabación en video de un corral de gallinas (`granja.mp4`) y un banco sonoro polifónico multicanal (chismes, murmullos colectivos, elegía de piano y paisajes de naturaleza libre), la herramienta convierte el movimiento de las aves y la intrusión del cursor en una catarsis sonora sobre las jaulas invisibles del ser humano.

Desarrollada para el curso *Dispositivos periféricos y plataformas para la interacción digital* (DPPI, Escuela de Diseño UDP), como entrega del **Ejercicio 06**.

- **Enlace de publicación:** [https://solfrias1.github.io/Oir-la-luz-_Domesticadas/](https://solfrias1.github.io/Oir-la-luz-_Domesticadas/)
- **Video predeterminado:** `videos/granja_web.mp4` (versión optimizada en 540p H.264 para carga instantánea en web).
- **Banco sonoro:** 12 grabaciones WAV procesadas con compresión dinámica y ecualización vocal en la carpeta `sonidos/`.

---

## 1. Concepto y Relación Imagen–Sonido

### ¿Qué relación se propone y por qué?
La plataforma propone una relación de **contraste crítico y traducción somática**. 

El ser humano moderno suele percibirse a sí mismo como un ser emancipado de la naturaleza: domesticó plantas y animales, construyó ciudades y se declaró libre de los instintos biológicos básicos. Sin embargo, esta plataforma plantea la hipótesis contraria: **hemos reemplazado la jaula de madera y alambre por jaulas invisibles de lenguaje, juicio social, vigilancia cotidiana y murmuración.**

Al observar el corral, el espectador espera oír el cacareo instintivo de las gallinas. En su lugar, el sistema hace que las aves hablen con fragmentos de chismes, susurros y confesiones cotidianas humanas en español (`gossipesp.wav`). El animal domesticado adquiere la voz de su carcelero; los chismes humanos —esa manifestación puramente social de control de masas y pérdida de libertad— emergen de los cuerpos de las aves cautivas.

### ¿Qué queremos que la persona escuche que antes no escuchaba?
Aquí se busca que el usuario escuche **la domesticación humana reflejada en el confinamiento animal**. Al interactuar con la plataforma; el usuario descubre que su propio cursor no es inocente: funciona como el **ojo panóptico**, la mirada invasora del ser humano que perturba el corral y fuerza a las aves a confesar sus secretos. Detrás del bullicio de los chismes humanos se percibe, además, un paisaje sonoro de grillos y pájaros libres que se asfixia y apaga a medida que la actividad humana se intensifica.

```
corral (video) → ojo / cursor (mouse) → píxel (inquietud) → regla (mapping) → confesión humana (sonido)
```

---

## 2. Banco de Sonidos y Disparador Visual

### Selección y Procesamiento de Audios
El banco sonoro consta de **12 archivos de audio** organizados en cuatro capas conceptuales, derivados de los audios originales del proyecto:

1. **Capa Chismes y Conversación (`gossipesp_track` y `chisme_1` a `chisme_6`):** Extraídos de `Audios/gossipesp.wav` (grabación en 24-bit 96 kHz mono). Contienen susurros, reclamos, secretos, dudas y risas humanas en español. Fueron procesados con compresión dinámica adaptativa y ecualización de presencia (realce formante en 2.8 kHz) para garantizar nitidez e inteligibilidad vocal sin ruidos sordos.
   - `gossipesp_track.wav`: Pista continua de 143 segundos cuyo volumen se modula dinámicamente según la cercanía del cursor a las aves.
   - `chisme_1.wav` a `chisme_6.wav`: Confesiones y exclamaciones reactivas puntuales de 2,5 a 3,2 segundos.
2. **Capa Fantasmas / Masa (`fantasma_1`, `fantasma_2`):** Susurros corales y murmullos espectrales extraídos de `Audios/gossipghosts.wav`. Representan el eco de la masa y la conciencia colectiva vigilada.
3. **Capa Elegía (`piano_1`, `piano_2`):** Motivos melancólicos extraídos de `Audios/piano.mp3`, que aportan una carga dramática sobre el cielo del corral.
4. **Capa Paisaje Libre (`naturaleza_loop`):** Fragmento en bucle continuo de 20 segundos extraído de `Audios/grillos.pajaros.flac`, representando la naturaleza antes de la domesticación.

### Tabla de Sonidos, Fuentes y Licencias

| Archivo | Fuente original | Duración | Descripción narrativa | Autor / Crédito | Licencia |
|---|---|---|---|---|---|
| `gossipesp_track.wav` | `Audios/gossipesp.wav` | 143.8 s | Pista continua de conversación: susurros y secretos modulados por el cursor | Grabación de campo / Archivo sonoro | Creative Commons BY 4.0 |
| `chisme_1.wav` | `Audios/gossipesp.wav` | 2.50 s | Susurro confidencial entre aves | Registro sonoro / Archivo | Creative Commons BY 4.0 |
| `chisme_2.wav` | `Audios/gossipesp.wav` | 2.80 s | Reclamo cotidiano sobre el encierro | Registro sonoro / Archivo | Creative Commons BY 4.0 |
| `chisme_3.wav` | `Audios/gossipesp.wav` | 3.00 s | Secreto murmurado al oído | Registro sonoro / Archivo | Creative Commons BY 4.0 |
| `chisme_4.wav` | `Audios/gossipesp.wav` | 2.70 s | Murmullo ansioso de corral | Registro sonoro / Archivo | Creative Commons BY 4.0 |
| `chisme_5.wav` | `Audios/gossipesp.wav` | 3.00 s | Risa cómplice y disimulada | Registro sonoro / Archivo | Creative Commons BY 4.0 |
| `chisme_6.wav` | `Audios/gossipesp.wav` | 3.20 s | Confesión de domesticación | Registro sonoro / Archivo | Creative Commons BY 4.0 |
| `fantasma_1.wav` | `Audios/gossipghosts.wav` | 3.50 s | Masa espectral: Conciencia colectiva | Sound Design Archive | CC0 / Public Domain |
| `fantasma_2.wav` | `Audios/gossipghosts.wav` | 4.00 s | Masa espectral: Eco del galpón | Sound Design Archive | CC0 / Public Domain |
| `piano_1.wav` | `Audios/piano.mp3` | 3.00 s | Acorde elegíaco: Libertad perdida | Freesound / Dominio público | CC0 1.0 Universal |
| `piano_2.wav` | `Audios/piano.mp3` | 3.50 s | Frase de piano: Duelo por el estado salvaje | Freesound / Dominio público | CC0 1.0 Universal |
| `naturaleza_loop.wav` | `Audios/grillos.pajaros.flac` | 20.00 s | Paisaje natural: Grillos y aves silvestres | Registro de campo | Creative Commons BY-NC 3.0 |

### El Disparador Visual y Regla de Mapping
El sistema combina el análisis de diferencia de fotogramas (*frame differencing*) sobre una resolución de 128 × 72 píxeles con una grilla amplia configurable (por defecto 10 columnas × 6 filas) y la coordenada normalizada del cursor:

- **Modo Corral (Lupa Acústica Panóptica):** El cursor actúa como un ojo invasor. Cuando el cursor se encuentra lejos o en zonas vacías, `gossipesp_track.wav` se reduce a un susurro de fondo tenue (2-3%). A medida que el cursor se aproxima a gallinas con actividad biológica real (`energy` y memoria de presencia), el volumen de la conversación humana escala exponencialmente (**20% → 50% → 80% → 100%**), trayendo la voz al primer plano.
- **Espacialización (Pan):** La posición horizontal del cursor modula directamente el `StereoPannerNode` de Web Audio API: al mover el mouse hacia la izquierda o derecha, la conversación se traslada de un oído al otro.
- **Confesiones Directas:** Tocar directamente a una gallina, rozarla a alta velocidad o hacer clic sobre ella dispara una confesión puntual reactiva (`chisme_1` a `chisme_6`).
- **Velocidad y Tono del Habla:** El slider `pRate` ajusta la velocidad de reproducción (`playbackRate`), transformando los chismes desde murmullos guturales y pesados (0.5x) hasta hablas frenéticas y agudas (1.6x).
- **Inquietud Colectiva:** Si ocurre una perturbación masiva generalizada en el corral (`totalHot >= 7`), se disparan los murmullos espectrales de `fantasma_1` o `fantasma_2` con reverberación convolutiva profunda y enfriamiento de 12 segundos.
- **Elegía Superior:** Si una gallina salta o se mueve en la fila superior (el techo de la jaula), se disparan los acordes de `piano_1` o `piano_2`.
- **Asfixia Ambiental:** A medida que la conversación humana se eleva por la proximidad del cursor, el volumen del paisaje libre (`naturaleza_loop`) se atenúa dinámicamente, simbolizando cómo el parloteo social sofoca la vida silvestre.

---

## 3. Parámetros y Gráfica

### Justificación de Parámetros Sonoros
Cada parámetro disponible en el dock responde a una decisión conceptual estricta:

- **Radio del cursor (01 · Modo):** Mide la distancia de perturbación del ser humano. Un radio amplio representa una mirada invasora dominante; un radio estrecho obliga al usuario a perseguir a cada gallina de forma quirúrgica.
- **Grilla Panóptica (03 · Panóptico):** Configuración de columnas (4 a 20) y filas (2 a 10). Representa la granularidad del control carcelario. Más celdas significan mayor segmentación y vigilancia de cada individuo aviar.
- **Velocidad del Habla (05 · Sonoro):** Modula el ritmo de la catarsis. Al ralentizar el habla, las voces humanas suenan agónicas, carnales y pesadas; al acelerarla, adquieren la histeria neurótica del chisme cotidiano.
- **Balance de Capas (05 · Sonoro):** Permite aislar los chismes de las gallinas, los susurros de la masa fantasmal, la elegía de piano o el paisaje de la naturaleza original.
- **Asfixia / Filtro Pasa-Bajos (06 · Espacio):** Emula la acústica opresiva de un galpón cerrado. Valores bajos (500–1200 Hz) provocan una sensación de asfixia y aislamiento acústico; valores altos revelan la nitidez cruda de la voz.
- **Resonancia / Reverb (06 · Espacio):** Simula el eco de la memoria del rebaño mediante una respuesta al impulso convolutiva sintética de 2,8 segundos.

### Decisiones Gráficas e Identidad Visual
La interfaz visual fue rediseñada para alejarse de la estética de sintetizador digital genérico y adoptar una atmósfera carnal, rústica y forense:

- **Tarjeta de Manifiesto en Escena:** Ubicada en la esquina superior izquierda, presenta el título de la obra y la bajada reflexiva sobre el corral invisible del lenguaje y la vigilancia cotidiana, con un botón interactivo `_` para minimizarla o expandirla durante la experiencia.
- **Medidor de Voz Humana en Vivo (`voice-meter`):** En el panel de lectura inferior izquierdo, una barra de nivel visualiza dinámicamente el porcentaje de volumen de la conversación (`gossipesp.wav`), retroalimentando de inmediato la cercanía del cursor a las gallinas.
- **Paleta Cromática:** 
  - Fondo negro carbón orgánico (`#0B0A09`), que evoca el suelo de tierra y la sombra del galpón.
  - Acento principal en amarillo maíz / paja seca (`#E5B25D`), en reemplazo del amarillo neón anterior, tiñendo las celdas activas con un resplandor cálido de corral.
  - Acento secundario en rojo cresta aviar (`#D63D3D`), utilizado para los picos de agitación celular y el botón de grabación.
  - Blanco hueso / plumaje (`#F4F1EA`) para las tipografías y líneas estructurales.
- **Tipografía:** 
  - Título en `Anaktoria` / serif clásica con peso escultórico.
  - Datos de monitoreo y lecturas en `IBM Plex Mono`, enfatizando el registro pericial y el análisis panóptico en tiempo real.
- **Cursor Panóptico:** El mouse se sustituye por una mira concéntrica punteada (`crosshair` y halo dinámico) que pulsa e intensifica su color al entrar en contacto con las gallinas.
- **Visualizador Acústico (Ventana 09):** Muestra en tiempo real la osciloscopía de la voz humana, el espectro de formantes vocales, la envolvente de asfixia y la partitura acumulativa de confesiones en los últimos 10 segundos.

---

## 4. Reflexión Crítica

### ¿Qué descubriste al traducir imagen en sonido?
Descubrimos que la coincidencia espacial y temporal entre el movimiento errático de una gallina y la entonación cadenciosa de un chisme humano produce un efecto de extrañamiento inmediato (*uncanny valley* somático). El espectador no puede evitar humanizar al animal y, al mismo tiempo, animalizar el contenido del chisme. La fragmentación del habla en respuesta al aleteo o picoteo de las aves revela cómo el lenguaje humano funciona como un patrón rítmico compulsivo: hablamos para llenar el vacío del encierro, exactamente igual a como las gallinas caminan en círculos en el corral.

### ¿Qué queda fuera de la escucha del sistema?
El sistema opera mediante visión por computadora lineal: detecta diferencia lumínica entre fotogramas y proximidad euclidiana del cursor. Por tanto, queda fuera **la individualidad biológica y la intención real de las aves**. El algoritmo no distingue entre una gallina que huye asustada, una que picotea alimento o el parpadeo de una sombra producida por el sol entre los árboles; para la máquina, todo es píxel cambiado. Asimismo, queda fuera el sufrimiento animal silencioso que no produce movimiento: la gallina quieta, inmóvil en una esquina del galpón, es completamente sorda para este sistema.

### Dos mejoras concretas para el futuro
1. **Detección semántica de especies mediante modelos ligeros de visión (YOLO / MediaPipe Custom):** Reemplazar la diferencia genérica de píxeles por un modelo de detección de objetos en el navegador que identifique la anatomía específica de cada gallina (cabeza, pico, patas, alas). Esto permitiría que picotear el suelo dispare un susurro breve, mientras que abrir las alas dispare una exclamación abierta.
2. **Síntesis neuronal granular en tiempo real (AudioWorklet Granular Engine):** Implementar un motor de síntesis granular donde el cursor no solo dispare fragmentos pregrabados de audio, sino que frote y granule las sílabas del chisme en tiempo real según la aceleración física del mouse, permitiendo al usuario estirar una vocal humana o congelarla en un susurro infinito mientras mantiene el cursor sobre el cuerpo de una gallina.

---

## Cómo Ejecutar el Proyecto

### 1. En tu computador local
Para que el navegador permita acceder al audio, video y controladores MIDI, abre una terminal en la carpeta del proyecto y ejecuta un servidor local:

**macOS / Linux:**
```bash
python3 -m http.server 8123
```

**Windows (PowerShell):**
```powershell
py -m http.server 8123
```

Luego abre en Chrome o Edge:
`http://localhost:8123`

Haz clic en el botón superior **▶ Activar sonido** para iniciar la reproducción sonora.
