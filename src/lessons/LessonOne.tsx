import { useMemo, useState } from 'react'

type LessonOneProps = {
  answer: string
  onAnswer: (value: string) => void
  onSaveAnswer: () => void
  savedMessage: string
}

type QuizAnswer = Record<number, number>

const LAB_KEY = 'authera.lesson1.lab.v1'
const QUIZ_KEY = 'authera.lesson1.quiz.v1'
const VIEWED_KEY = 'authera.lesson1.viewed.v1'

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key)
    return value ? (JSON.parse(value) as T) : fallback
  } catch {
    return fallback
  }
}

const stages = [
  { id: 0, label: 'Abertura', time: '15 min' },
  { id: 1, label: 'Evolução da IA', time: '20 min' },
  { id: 2, label: 'Mapa da IA', time: '20 min' },
  { id: 3, label: 'Como a máquina aprende', time: '20 min' },
  { id: 4, label: 'Modelo, dados e parâmetros', time: '15 min' },
  { id: 5, label: 'Treinamento × inferência', time: '15 min' },
  { id: 6, label: 'Hardware para IA', time: '15 min' },
  { id: 7, label: 'Laboratório prático', time: '3h' },
  { id: 8, label: 'Checkpoint', time: '20 min' },
  { id: 9, label: 'Desafio e síntese', time: '40 min' },
]

const quiz = [
  {
    question: 'Qual frase descreve melhor Machine Learning?',
    options: [
      'É qualquer programa escrito em Python.',
      'É uma abordagem em que sistemas aprendem padrões a partir de dados.',
      'É sinônimo de Inteligência Artificial Generativa.',
      'É o hardware usado para treinar redes neurais.',
    ],
    correct: 1,
  },
  {
    question: 'O que acontece durante a inferência?',
    options: [
      'O modelo usa o que aprendeu para produzir uma previsão ou resposta.',
      'Todo o dataset é obrigatoriamente treinado novamente.',
      'A GPU apaga os pesos do modelo.',
      'O código-fonte do modelo é compilado.',
    ],
    correct: 0,
  },
  {
    question: 'Parâmetros de um modelo são:',
    options: [
      'Somente as perguntas enviadas pelo usuário.',
      'Os valores internos ajustados durante o aprendizado.',
      'A quantidade de arquivos do dataset.',
      'As configurações do sistema operacional.',
    ],
    correct: 1,
  },
  {
    question: 'Por que GPUs são úteis em IA?',
    options: [
      'Porque armazenam permanentemente o dataset.',
      'Porque substituem bancos de dados.',
      'Porque executam muitas operações matemáticas em paralelo.',
      'Porque todo modelo de IA exige uma GPU para funcionar.',
    ],
    correct: 2,
  },
  {
    question: 'IA Generativa é melhor descrita como:',
    options: [
      'Uma área capaz de criar novo conteúdo a partir dos padrões aprendidos.',
      'Um antivírus especializado em IA.',
      'Uma linguagem de programação.',
      'Um banco de dados vetorial.',
    ],
    correct: 0,
  },
]

export default function LessonOne({
  answer,
  onAnswer,
  onSaveAnswer,
  savedMessage,
}: LessonOneProps) {
  const [stage, setStage] = useState(0)
  const [viewed, setViewed] = useState<number[]>(() => loadJSON<number[]>(VIEWED_KEY, [0]))
  const [lab, setLab] = useState<boolean[]>(() => loadJSON<boolean[]>(LAB_KEY, [false, false, false, false]))
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswer>(() => loadJSON<QuizAnswer>(QUIZ_KEY, {}))
  const [quizSubmitted, setQuizSubmitted] = useState(false)

  const quizScore = useMemo(() => {
    return quiz.reduce(
      (score, item, index) => score + (quizAnswers[index] === item.correct ? 1 : 0),
      0,
    )
  }, [quizAnswers])

  const lessonProgress = Math.round(
    ((viewed.length / stages.length) * 0.15 +
      (lab.filter(Boolean).length / lab.length) * 0.35 +
      (Object.keys(quizAnswers).length === quiz.length ? 0.2 : 0) +
      (answer.trim().length >= 80 ? 0.3 : 0)) *
      100,
  )

  function goToStage(next: number) {
    if (next < 0 || next >= stages.length) return
    setStage(next)

    if (!viewed.includes(next)) {
      const updated = [...viewed, next].sort((a, b) => a - b)
      setViewed(updated)
      localStorage.setItem(VIEWED_KEY, JSON.stringify(updated))
    }

    document.getElementById('lesson-one-player')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function toggleLab(index: number) {
    const updated = lab.map((value, itemIndex) => itemIndex === index ? !value : value)
    setLab(updated)
    localStorage.setItem(LAB_KEY, JSON.stringify(updated))
  }

  function chooseQuiz(question: number, option: number) {
    const updated = { ...quizAnswers, [question]: option }
    setQuizAnswers(updated)
    localStorage.setItem(QUIZ_KEY, JSON.stringify(updated))
    setQuizSubmitted(false)
  }

  return (
    <section className="lesson-one-player" id="lesson-one-player">
      <div className="lesson-player-head">
        <div>
          <span className="section-label">AULA GUIADA · 6 HORAS</span>
          <h2>Inteligência Artificial: fundamentos e evolução</h2>
          <p>
            A aula está dividida em dez etapas. Navegar pelos blocos conta apenas uma
            pequena parte do progresso; laboratório, checkpoint e desafio têm peso maior.
          </p>
        </div>
        <div className="lesson-internal-progress">
          <strong>{lessonProgress}%</strong>
          <span>progresso acadêmico</span>
        </div>
      </div>

      <div className="progress-criteria">
        <span>Etapas visitadas: 15%</span>
        <span>Laboratório: 35%</span>
        <span>Checkpoint: 20%</span>
        <span>Desafio: 30%</span>
      </div>

      <div className="lesson-stage-progress">
        <div style={{ width: `${lessonProgress}%` }} />
      </div>

      <div className="lesson-stage-nav">
        {stages.map((item, index) => (
          <button
            key={item.id}
            className={stage === index ? 'stage-nav-item active' : 'stage-nav-item'}
            onClick={() => goToStage(index)}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            <b>{item.label}</b>
            <small>{item.time}</small>
          </button>
        ))}
      </div>

      <div className="slide-shell">
        <div className="slide-topline">
          <span>ETAPA {stage + 1} DE {stages.length}</span>
          <span>{stages[stage].time}</span>
        </div>

        {stage === 0 && <OpeningSlide />}
        {stage === 1 && <HistorySlide />}
        {stage === 2 && <MapSlide />}
        {stage === 3 && <LearningSlide />}
        {stage === 4 && <ModelSlide />}
        {stage === 5 && <TrainingSlide />}
        {stage === 6 && <HardwareSlide />}
        {stage === 7 && <LabSlide values={lab} onToggle={toggleLab} />}
        {stage === 8 && (
          <QuizSlide
            answers={quizAnswers}
            submitted={quizSubmitted}
            score={quizScore}
            onChoose={chooseQuiz}
            onSubmit={() => setQuizSubmitted(true)}
          />
        )}
        {stage === 9 && (
          <ChallengeSlide
            answer={answer}
            onAnswer={onAnswer}
            onSave={onSaveAnswer}
            savedMessage={savedMessage}
            progress={lessonProgress}
          />
        )}

        <div className="slide-actions">
          <button
            className="secondary-btn"
            disabled={stage === 0}
            onClick={() => goToStage(stage - 1)}
          >
            ← Etapa anterior
          </button>
          <span>{stages[stage].label}</span>
          <button
            className="primary-btn"
            disabled={stage === stages.length - 1}
            onClick={() => goToStage(stage + 1)}
          >
            Próxima etapa →
          </button>
        </div>
      </div>
    </section>
  )
}

function OpeningSlide() {
  return (
    <div className="lesson-slide">
      <span className="slide-kicker">ABERTURA · 15 MIN</span>
      <h2>Antes de falar de modelos, vamos entender o território.</h2>
      <p className="slide-lead">
        Inteligência Artificial não começou com ChatGPT. Ela é resultado de décadas de
        matemática, computação, estatística, pesquisa sobre representação do conhecimento
        e aumento da capacidade de processamento.
      </p>

      <div className="objectives-grid">
        <div><b>01</b><p>Explicar o que chamamos de Inteligência Artificial.</p></div>
        <div><b>02</b><p>Diferenciar IA, Machine Learning, Deep Learning e IA Generativa.</p></div>
        <div><b>03</b><p>Entender treinamento, inferência, modelos, parâmetros e tokens.</p></div>
        <div><b>04</b><p>Relacionar CPU, GPU, RAM e armazenamento ao processamento de IA.</p></div>
      </div>

      <div className="theory-stack">
        <article>
          <span>IDEIA 1</span>
          <h3>IA é uma área da computação, não uma tecnologia única.</h3>
          <p>
            Um sistema de IA pode usar regras, estatística, algoritmos de busca, Machine Learning,
            redes neurais ou uma combinação dessas abordagens. Por isso, dizer “esta aplicação usa IA”
            ainda não explica como ela funciona.
          </p>
        </article>
        <article>
          <span>IDEIA 2</span>
          <h3>Automação e IA não são exatamente a mesma coisa.</h3>
          <p>
            Uma automação tradicional executa regras previamente definidas. Um sistema de Machine Learning
            pode aprender padrões a partir de exemplos e generalizar para situações não vistas durante
            o treinamento. Sistemas modernos normalmente combinam os dois.
          </p>
        </article>
        <article>
          <span>IDEIA 3</span>
          <h3>O curso vai sempre separar conceito de ferramenta.</h3>
          <p>
            Ollama, PyTorch, Docker, LangGraph e bancos vetoriais são ferramentas. Modelo, inferência,
            embedding, classificação, contexto e generalização são conceitos. Ferramentas mudam;
            conceitos permanecem úteis por muito mais tempo.
          </p>
        </article>
        <article>
          <span>IDEIA 4</span>
          <h3>IA depende de computação: CPU, GPU, memória e armazenamento fazem parte do problema.</h3>
          <p>
            Um modelo pode ser excelente e ainda assim ser inviável em determinado ambiente. Tamanho do
            modelo, quantidade de parâmetros, precisão numérica, contexto, VRAM, RAM e velocidade de disco
            influenciam diretamente onde e como uma solução de IA pode rodar.
          </p>
        </article>
      </div>

      <div className="worked-example">
        <span className="section-label">EXEMPLO RÁPIDO</span>
        <h3>Detector de spam</h3>
        <p>
          Se escrevermos manualmente “se o e-mail contém ‘ganhe dinheiro’, marque como spam”, criamos
          uma regra. Se entregarmos milhares de e-mails classificados a um algoritmo e ele aprender
          padrões que distinguem spam de mensagens legítimas, entramos em Machine Learning.
        </p>
      </div>

      <details className="study-check">
        <summary>Verifique sua compreensão</summary>
        <p>
          Pense em dois sistemas do seu cotidiano: um que apenas automatiza uma regra e outro que parece
          adaptar sua resposta com base em dados. Tente explicar por que você os classificaria dessa forma.
        </p>
      </details>

      <div className="teaching-note">
        <strong>Como estudar esta aula</strong>
        <p>
          Não tente decorar definições. Ao final, você deverá conseguir explicar cada conceito com exemplos
          próprios e observar esses conceitos funcionando em um modelo executado de verdade.
        </p>
      </div>
    </div>
  )
}

function HistorySlide() {
  return (
    <div className="lesson-slide">
      <span className="slide-kicker">1.1 · EVOLUÇÃO · 20 MIN</span>
      <h2>Da regra escrita pelo programador ao modelo que aprende padrões.</h2>
      <p className="slide-lead">
        A história da IA não é uma linha reta. Houve períodos de enorme entusiasmo,
        limitações técnicas, redução de investimento e retomadas impulsionadas por novos
        algoritmos, mais dados e hardware mais poderoso.
      </p>

      <div className="timeline">
        <div>
          <b>1950–1980</b>
          <strong>IA simbólica</strong>
          <p>Regras, lógica, busca e sistemas especialistas. O conhecimento era explicitamente representado.</p>
        </div>
        <div>
          <b>1980–2010</b>
          <strong>Aprendizado estatístico</strong>
          <p>Modelos passam a extrair padrões dos dados em vez de depender apenas de regras escritas à mão.</p>
        </div>
        <div>
          <b>2010–2020</b>
          <strong>Deep Learning</strong>
          <p>Redes profundas, grandes datasets e GPUs impulsionam visão, fala, tradução e reconhecimento.</p>
        </div>
        <div>
          <b>2020+</b>
          <strong>Modelos fundacionais</strong>
          <p>Transformers e modelos multimodais passam a executar muitas tarefas a partir de uma base comum.</p>
        </div>
      </div>

      <div className="theory-stack">
        <article>
          <span>POR QUE A IA TEVE “INVERNOS”?</span>
          <h3>Promessas cresceram mais rápido que a capacidade técnica.</h3>
          <p>
            Em vários momentos, expectativas sobre máquinas “inteligentes” ficaram muito acima do que
            hardware, algoritmos e dados disponíveis podiam entregar. Quando resultados não acompanharam
            as promessas, financiamento e interesse diminuíram.
          </p>
        </article>
        <article>
          <span>O QUE MUDOU NO DEEP LEARNING?</span>
          <h3>Escala passou a importar muito.</h3>
          <p>
            Redes neurais não eram novas, mas o aumento de dados digitais, GPUs e técnicas de treinamento
            tornou possível treinar redes muito maiores e mais profundas com resultados práticos relevantes.
          </p>
        </article>
        <article>
          <span>TRANSFORMERS</span>
          <h3>A linguagem ganhou uma arquitetura altamente escalável.</h3>
          <p>
            A arquitetura Transformer, introduzida em 2017, tornou eficiente modelar relações em sequências
            longas. Ela se tornou a base de muitos LLMs e também foi adaptada para imagem, áudio e multimodalidade.
          </p>
        </article>
      </div>

      <div className="worked-example">
        <span className="section-label">LEITURA HISTÓRICA</span>
        <h3>Um chatbot de 1980 e um LLM moderno podem parecer semelhantes na interface.</h3>
        <p>
          O primeiro poderia selecionar respostas com regras e padrões explícitos. O segundo produz texto
          estimando probabilidades condicionais de tokens com bilhões de parâmetros aprendidos. A interface
          “conversa” não revela a arquitetura por trás dela.
        </p>
      </div>

      <blockquote>
        Cada geração não apagou completamente a anterior. Sistemas modernos frequentemente combinam
        regras, modelos estatísticos, redes neurais e software tradicional.
      </blockquote>
    </div>
  )
}

function MapSlide() {
  return (
    <div className="lesson-slide">
      <span className="slide-kicker">1.2 · MAPA DA ÁREA · 20 MIN</span>
      <h2>IA é o campo; Machine Learning e Deep Learning são abordagens dentro dele.</h2>
      <p className="slide-lead">
        Entender a hierarquia evita um erro comum: tratar IA, Machine Learning, Deep Learning
        e IA Generativa como sinônimos.
      </p>

      <div className="nested-map">
        <div className="map-level ia">
          <b>INTELIGÊNCIA ARTIFICIAL</b>
          <span>Campo amplo dedicado a sistemas que executam tarefas associadas a percepção, decisão, linguagem, planejamento e resolução de problemas.</span>
          <div className="map-level ml">
            <b>MACHINE LEARNING</b>
            <span>Abordagens nas quais algoritmos ajustam modelos a partir de dados e exemplos.</span>
            <div className="map-level dl">
              <b>DEEP LEARNING</b>
              <span>Machine Learning baseado em redes neurais com múltiplas camadas e representações aprendidas.</span>
              <div className="map-level gen">
                <b>IA GENERATIVA</b>
                <span>Modelos capazes de produzir novo texto, imagem, áudio, código e outros conteúdos.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="example-strip">
        <div><span>IA</span><b>Sistema especialista para diagnóstico</b></div>
        <div><span>ML</span><b>Previsão de inadimplência</b></div>
        <div><span>DL</span><b>Reconhecimento de objetos</b></div>
        <div><span>GenAI</span><b>LLM escrevendo uma resposta</b></div>
      </div>

      <div className="theory-stack">
        <article>
          <span>NEM TODA IA É ML</span>
          <h3>Regras e algoritmos de busca também podem compor sistemas inteligentes.</h3>
          <p>
            Um mecanismo de planejamento que busca a melhor sequência de ações pode ser considerado IA
            mesmo sem aprender pesos a partir de um dataset.
          </p>
        </article>
        <article>
          <span>NEM TODO ML É DEEP LEARNING</span>
          <h3>Modelos clássicos continuam extremamente úteis.</h3>
          <p>
            Regressão, árvores, Random Forest e Gradient Boosting podem superar redes neurais em muitos
            problemas com dados tabulares, menor volume de dados e necessidade de interpretabilidade.
          </p>
        </article>
        <article>
          <span>IA GENERATIVA É UMA PARTE DO ECOSSISTEMA</span>
          <h3>Gerar texto é apenas uma das formas de usar IA.</h3>
          <p>
            Classificação, previsão de demanda, detecção de fraude, visão computacional, recomendação,
            otimização e controle continuam sendo problemas centrais da área.
          </p>
        </article>
      </div>

      <details className="study-check">
        <summary>Exercício mental</summary>
        <p>
          Classifique estes casos: previsão de preço de imóvel, detector de rosto, chatbot com LLM,
          algoritmo de rota e sistema de recomendação. Eles pertencem a qual nível do mapa acima?
        </p>
      </details>
    </div>
  )
}

function LearningSlide() {
  return (
    <div className="lesson-slide">
      <span className="slide-kicker">1.3 · APRENDIZADO · 20 MIN</span>
      <h2>“Aprender” significa ajustar um modelo a partir de evidências.</h2>
      <p className="slide-lead">
        Um computador não aprende como uma pessoa. Em Machine Learning, aprender significa
        encontrar parâmetros que façam o modelo desempenhar bem uma tarefa segundo uma métrica.
      </p>

      <div className="learning-types">
        <article>
          <span>01</span>
          <h3>Supervisionado</h3>
          <p>Temos entradas acompanhadas da resposta desejada. O modelo aprende uma relação entre ambos.</p>
          <strong>Classificação · Regressão</strong>
        </article>
        <article>
          <span>02</span>
          <h3>Não supervisionado</h3>
          <p>O algoritmo procura estrutura, grupos ou representações sem uma resposta-alvo fornecida.</p>
          <strong>Clustering · Redução de dimensionalidade</strong>
        </article>
        <article>
          <span>03</span>
          <h3>Por reforço</h3>
          <p>Um agente executa ações em um ambiente e aprende a maximizar recompensas acumuladas.</p>
          <strong>Políticas · Recompensas</strong>
        </article>
      </div>

      <div className="theory-stack">
        <article>
          <span>SUPERVISIONADO</span>
          <h3>Exemplo: detectar fraude em transações.</h3>
          <p>
            Cada exemplo pode conter valor, horário, localização e características da compra, acompanhado
            de um rótulo “fraude” ou “legítima”. O modelo tenta aprender uma fronteira que generalize
            para transações novas.
          </p>
        </article>
        <article>
          <span>NÃO SUPERVISIONADO</span>
          <h3>Exemplo: descobrir segmentos de clientes.</h3>
          <p>
            Sem indicar previamente quais grupos existem, um algoritmo pode encontrar clientes com padrões
            semelhantes de frequência, ticket médio, produtos e canais de compra.
          </p>
        </article>
        <article>
          <span>REFORÇO</span>
          <h3>Exemplo: aprender uma política de controle.</h3>
          <p>
            Em vez de receber a “resposta correta” para cada estado, o agente testa ações e recebe sinais
            de recompensa. O problema passa a ser aprender quais decisões produzem maior retorno no tempo.
          </p>
        </article>
      </div>

      <div className="formula-card">
        <span>IDEIA CENTRAL</span>
        <code>dados + objetivo + algoritmo → parâmetros ajustados → modelo → avaliação em dados novos</code>
      </div>

      <div className="worked-example">
        <span className="section-label">GENERALIZAÇÃO</span>
        <h3>Memorizar o treino não basta.</h3>
        <p>
          O objetivo é funcionar em exemplos não vistos. Se o modelo apresenta resultado excelente nos dados
          de treino e ruim em novos dados, pode estar sofrendo overfitting — conceito que estudaremos em profundidade.
        </p>
      </div>
    </div>
  )
}

function ModelSlide() {
  return (
    <div className="lesson-slide">
      <span className="slide-kicker">1.4 · ANATOMIA · 15 MIN</span>
      <h2>Dataset, modelo, parâmetros e hiperparâmetros não são a mesma coisa.</h2>
      <p className="slide-lead">
        Essas palavras aparecem o tempo todo em IA. Saber distingui-las evita confusões
        quando começarmos a treinar e executar modelos.
      </p>

      <div className="definition-grid">
        <article>
          <b>Dataset</b>
          <p>Conjunto de exemplos usados para treinar, validar ou testar um modelo.</p>
        </article>
        <article>
          <b>Modelo</b>
          <p>Estrutura matemática/computacional que transforma entradas em saídas.</p>
        </article>
        <article>
          <b>Parâmetros</b>
          <p>Valores internos aprendidos durante o treinamento, como pesos de uma rede neural.</p>
        </article>
        <article>
          <b>Hiperparâmetros</b>
          <p>Configurações escolhidas pelo processo de treinamento, como learning rate e batch size.</p>
        </article>
        <article>
          <b>Token</b>
          <p>Unidade em que o texto é dividido antes de ser processado por um modelo de linguagem.</p>
        </article>
        <article>
          <b>Contexto</b>
          <p>Informação disponível ao modelo no momento em que ele calcula a próxima saída.</p>
        </article>
      </div>

      <div className="worked-example">
        <span className="section-label">ANALOGIA CONTROLADA</span>
        <h3>Receita, ingredientes e regulagens</h3>
        <p>
          Pense no modelo como uma estrutura de receita, nos dados como exemplos de pratos, nos parâmetros
          como ajustes internos aprendidos para reproduzir o resultado e nos hiperparâmetros como decisões
          de como conduzir o processo. A analogia é imperfeita, mas ajuda a separar os papéis.
        </p>
      </div>

      <div className="theory-stack">
        <article>
          <span>LLMs</span>
          <h3>Bilhões de parâmetros não significam bilhões de fatos.</h3>
          <p>
            Parâmetros armazenam relações numéricas distribuídas. Conhecimento e capacidades emergem do conjunto;
            não existe, em geral, um único peso correspondente a “Recife”, “Python” ou “fotossíntese”.
          </p>
        </article>
        <article>
          <span>TOKENS</span>
          <h3>Modelos de linguagem não enxergam texto exatamente como nós.</h3>
          <p>
            O texto é tokenizado em unidades que podem ser palavras, partes de palavras, sinais ou bytes.
            Isso influencia custo, tamanho de contexto e comportamento do modelo.
          </p>
        </article>
      </div>

      <blockquote>
        Um modelo com bilhões de parâmetros não guarda uma “enciclopédia de frases”.
        Ele codifica relações estatísticas distribuídas aprendidas durante o treinamento.
      </blockquote>
    </div>
  )
}

function TrainingSlide() {
  return (
    <div className="lesson-slide">
      <span className="slide-kicker">1.5 · CICLO · 15 MIN</span>
      <h2>Treinar é ajustar. Inferir é usar o que foi ajustado.</h2>

      <div className="training-flow">
        <div><span>1</span><b>Dados</b><small>Exemplos disponíveis</small></div>
        <i>→</i>
        <div><span>2</span><b>Treinamento</b><small>Ajuste dos parâmetros</small></div>
        <i>→</i>
        <div><span>3</span><b>Modelo treinado</b><small>Pesos resultantes</small></div>
        <i>→</i>
        <div><span>4</span><b>Inferência</b><small>Uso em novos dados</small></div>
      </div>

      <div className="comparison-grid">
        <article>
          <span>TREINAMENTO</span>
          <h3>Mais caro e demorado</h3>
          <p>
            Processa muitos exemplos, calcula erro, obtém gradientes e atualiza parâmetros repetidamente.
            Pode levar minutos, dias ou semanas dependendo da escala.
          </p>
        </article>
        <article>
          <span>INFERÊNCIA</span>
          <h3>Mais frequente no produto</h3>
          <p>
            Recebe uma entrada e executa o modelo já treinado para gerar classificação, previsão, embedding,
            texto, imagem ou outra saída.
          </p>
        </article>
      </div>

      <div className="theory-stack">
        <article>
          <span>FINE-TUNING</span>
          <h3>É um novo treinamento, mas normalmente menor.</h3>
          <p>
            Em vez de treinar tudo do zero, partimos de um modelo pré-treinado e continuamos o ajuste com
            dados específicos. Mais adiante veremos LoRA, QLoRA e quando isso faz sentido.
          </p>
        </article>
        <article>
          <span>RAG</span>
          <h3>Não é treinamento do modelo.</h3>
          <p>
            RAG recupera informação externa e a inclui no contexto da inferência. O conhecimento usado na
            resposta pode mudar sem modificar os parâmetros do LLM.
          </p>
        </article>
      </div>

      <div className="teaching-note">
        <strong>Exemplo com LLM local</strong>
        <p>
          Quando executamos um modelo no Ollama, normalmente estamos fazendo inferência. O treinamento
          original ocorreu antes, em infraestrutura muito maior. Quando adicionamos documentos via RAG,
          continuamos fazendo inferência, agora com contexto recuperado.
        </p>
      </div>
    </div>
  )
}

function HardwareSlide() {
  return (
    <div className="lesson-slide">
      <span className="slide-kicker">1.6 · HARDWARE · 15 MIN</span>
      <h2>IA é software, mas o limite prático frequentemente aparece no hardware.</h2>
      <p className="slide-lead">
        Entender recursos computacionais evita escolher modelos que não cabem na memória,
        subdimensionar servidores ou confundir lentidão de rede com lentidão do modelo.
      </p>

      <div className="hardware-grid">
        <article>
          <div className="hardware-icon">CPU</div>
          <h3>Processador</h3>
          <p>Excelente para controle, lógica geral, pré/pós-processamento e partes sequenciais da aplicação.</p>
        </article>
        <article>
          <div className="hardware-icon">GPU</div>
          <h3>Processamento paralelo</h3>
          <p>Muitas unidades executam operações sobre matrizes e tensores em paralelo, acelerando treinamento e inferência.</p>
        </article>
        <article>
          <div className="hardware-icon">RAM</div>
          <h3>Memória do sistema</h3>
          <p>Mantém processos, dados e partes de modelos ativas; também pode receber camadas por offload.</p>
        </article>
        <article>
          <div className="hardware-icon">VRAM</div>
          <h3>Memória da GPU</h3>
          <p>Um dos limites mais importantes para carregar pesos, cache de atenção e batches diretamente na GPU.</p>
        </article>
        <article>
          <div className="hardware-icon">SSD</div>
          <h3>Armazenamento</h3>
          <p>Guarda modelos, datasets, índices vetoriais, logs, checkpoints e artefatos de experimentos.</p>
        </article>
        <article>
          <div className="hardware-icon">NET</div>
          <h3>Rede</h3>
          <p>Afeta sistemas distribuídos, APIs remotas, acesso a bancos, ingestão de dados e clusters de treinamento.</p>
        </article>
      </div>

      <div className="theory-stack">
        <article>
          <span>VRAM E QUANTIZAÇÃO</span>
          <h3>Reduzir precisão pode permitir executar modelos maiores.</h3>
          <p>
            Pesos em menor precisão ocupam menos memória. Quantização troca parte da precisão numérica por
            economia de VRAM/RAM e, muitas vezes, maior velocidade. O impacto depende do modelo e da tarefa.
          </p>
        </article>
        <article>
          <span>LATÊNCIA × THROUGHPUT</span>
          <h3>Responder rápido a um usuário e atender muitos usuários são problemas diferentes.</h3>
          <p>
            Latência mede quanto uma resposta individual demora; throughput mede quanto trabalho o sistema
            processa por unidade de tempo. Batching pode aumentar throughput e ao mesmo tempo alterar latência.
          </p>
        </article>
      </div>

      <div className="formula-card">
        <span>REGRA PRÁTICA</span>
        <code>modelo maior → mais memória · mais usuários → mais throughput · mais contexto → mais memória e processamento</code>
      </div>

      <details className="study-check">
        <summary>Antes do laboratório</summary>
        <p>
          Se um modelo não cabe totalmente na VRAM, quais opções você imagina? Nas próximas aulas veremos
          quantização, offload para RAM/CPU, redução de contexto, modelos menores e servidores especializados.
        </p>
      </details>
    </div>
  )
}

type LabSlideProps = {
  values: boolean[]
  onToggle: (index: number) => void
}

function LabSlide({ values, onToggle }: LabSlideProps) {
  const steps = [
    {
      title: 'Inventariar o hardware',
      description: 'Identifique CPU, RAM, armazenamento e GPU da máquina. Anote modelo do processador, memória disponível, disco principal, GPU e VRAM.',
      command: 'lscpu | head -20\nfree -h\nlsblk\nnvidia-smi',
    },
    {
      title: 'Verificar o ambiente de IA',
      description: 'Confirme a versão do Ollama e liste os modelos locais. Compare tamanho em disco e família dos modelos disponíveis.',
      command: 'ollama --version\nollama list',
    },
    {
      title: 'Executar uma inferência',
      description: 'Escolha um modelo instalado e execute uma pergunta curta. Observe tempo até a primeira resposta e fluidez da geração.',
      command: 'ollama run qwen3:4b "Explique em uma frase o que uma GPU faz em IA."',
    },
    {
      title: 'Observar recursos',
      description: 'Enquanto o modelo responde, observe uso da GPU, VRAM e processo ativo. Relacione o que aparece na tela com os conceitos da etapa anterior.',
      command: 'watch -n 1 nvidia-smi',
    },
  ]

  return (
    <div className="lesson-slide">
      <span className="slide-kicker">LABORATÓRIO · 3 HORAS</span>
      <h2>Do conceito para uma IA executando de verdade.</h2>
      <p className="slide-lead">
        Este laboratório foi desenhado para Linux com Ollama e GPU NVIDIA. Em uma
        futura turma pública, disponibilizaremos também ambiente cloud para quem não
        possuir hardware próprio.
      </p>

      <div className="lab-warning">
        <strong>Importante</strong>
        <p>Os comandos abaixo são apenas de consulta ou execução de modelo. Nenhum deles altera a configuração do sistema.</p>
      </div>

      <div className="lab-objectives">
        <article>
          <span>OBJETIVO A</span>
          <b>Ligar conceito ao hardware</b>
          <p>Você deve sair do laboratório sabendo onde CPU, RAM, GPU e VRAM aparecem no sistema real.</p>
        </article>
        <article>
          <span>OBJETIVO B</span>
          <b>Distinguir modelo de servidor</b>
          <p>Ollama é o software que serve modelos; Qwen, Llama e outros são modelos executados por ele.</p>
        </article>
        <article>
          <span>OBJETIVO C</span>
          <b>Observar inferência</b>
          <p>A resposta gerada é uma inferência. O modelo não está sendo treinado novamente a cada pergunta.</p>
        </article>
      </div>

      <div className="lab-steps">
        {steps.map((item, index) => (
          <article className={values[index] ? 'lab-step completed' : 'lab-step'} key={item.title}>
            <button className="lab-check" onClick={() => onToggle(index)}>
              {values[index] ? '✓' : index + 1}
            </button>
            <div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <pre><code>{item.command}</code></pre>
              <button className="lab-done-btn" onClick={() => onToggle(index)}>
                {values[index] ? 'Etapa concluída' : 'Marcar como concluída'}
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="lab-observation">
        <span className="section-label">O QUE VOCÊ DEVE OBSERVAR</span>
        <ul>
          <li>Quanto de VRAM o modelo ocupa quando está carregado.</li>
          <li>Se a utilização da GPU aumenta durante a geração.</li>
          <li>A diferença entre o tamanho do modelo em disco e o consumo de memória em execução.</li>
          <li>O fato de a pergunta mudar sem que o modelo seja treinado novamente.</li>
          <li>Como hardware e tamanho do modelo influenciam a velocidade percebida.</li>
        </ul>
      </div>

      <div className="lab-result">
        <strong>{values.filter(Boolean).length}/4 etapas concluídas</strong>
        <span>O estado do laboratório fica salvo neste dispositivo.</span>
      </div>
    </div>
  )
}

type QuizSlideProps = {
  answers: QuizAnswer
  submitted: boolean
  score: number
  onChoose: (question: number, option: number) => void
  onSubmit: () => void
}

function QuizSlide({ answers, submitted, score, onChoose, onSubmit }: QuizSlideProps) {
  return (
    <div className="lesson-slide">
      <span className="slide-kicker">CHECKPOINT</span>
      <h2>Vamos verificar se os conceitos principais ficaram claros.</h2>
      <p className="slide-lead">São cinco questões. O objetivo aqui é diagnóstico, não punição.</p>

      <div className="quiz-list">
        {quiz.map((item, questionIndex) => (
          <article className="quiz-question" key={item.question}>
            <div className="quiz-title">
              <span>{String(questionIndex + 1).padStart(2, '0')}</span>
              <h3>{item.question}</h3>
            </div>
            <div className="quiz-options">
              {item.options.map((option, optionIndex) => {
                const selected = answers[questionIndex] === optionIndex
                const correct = submitted && optionIndex === item.correct
                const wrong = submitted && selected && optionIndex !== item.correct

                return (
                  <button
                    key={option}
                    className={[
                      'quiz-option',
                      selected ? 'selected' : '',
                      correct ? 'correct' : '',
                      wrong ? 'wrong' : '',
                    ].join(' ')}
                    onClick={() => onChoose(questionIndex, optionIndex)}
                  >
                    <span>{String.fromCharCode(65 + optionIndex)}</span>
                    {option}
                  </button>
                )
              })}
            </div>
          </article>
        ))}
      </div>

      <div className="quiz-footer">
        {submitted ? (
          <div className="quiz-score">
            <strong>{quizScoreLabel(score)}</strong>
            <span>{score} de {quiz.length} respostas corretas</span>
          </div>
        ) : (
          <span>Responda todas as questões antes de conferir o resultado.</span>
        )}

        <button
          className="primary-btn"
          disabled={Object.keys(answers).length < quiz.length}
          onClick={onSubmit}
        >
          Corrigir checkpoint
        </button>
      </div>
    </div>
  )
}

function quizScoreLabel(score: number) {
  if (score === 5) return 'Excelente.'
  if (score >= 4) return 'Muito bom.'
  if (score >= 3) return 'Bom começo.'
  return 'Vale revisar os conceitos.'
}

type ChallengeSlideProps = {
  answer: string
  onAnswer: (value: string) => void
  onSave: () => void
  savedMessage: string
  progress: number
}

function ChallengeSlide({ answer, onAnswer, onSave, savedMessage, progress }: ChallengeSlideProps) {
  return (
    <div className="lesson-slide">
      <span className="slide-kicker">DESAFIO + SÍNTESE</span>
      <h2>Agora explique sem copiar uma definição pronta.</h2>
      <p className="slide-lead">
        Em aproximadamente 100 a 250 palavras, responda à pergunta abaixo. Esta resposta
        será futuramente enviada ao nosso avaliador IA e fará parte do histórico acadêmico.
      </p>

      <div className="challenge-question">
        Qual é a diferença entre Inteligência Artificial, Machine Learning e Deep Learning?
        Dê pelo menos um exemplo prático de cada conceito.
      </div>

      <textarea
        className="answer-box large"
        value={answer}
        onChange={(event) => onAnswer(event.target.value)}
        placeholder="Escreva aqui com suas próprias palavras..."
      />

      <div className="answer-meta">
        <span>{answer.trim() ? answer.trim().split(/\s+/).length : 0} palavras</span>
        <span>{answer.trim().length >= 80 ? '✓ resposta com conteúdo suficiente para o piloto' : 'mínimo sugerido: 80 caracteres'}</span>
      </div>

      <div className="save-row">
        <span>{savedMessage}</span>
        <button className="primary-btn" onClick={onSave} disabled={answer.trim().length < 80}>
          Salvar desafio
        </button>
      </div>

      <div className="lesson-summary-box">
        <span className="section-label">SÍNTESE DA AULA</span>
        <h3>Você percorreu a base conceitual que sustentará o restante do curso.</h3>
        <div className="summary-tags">
          <span>IA</span><span>Machine Learning</span><span>Deep Learning</span>
          <span>IA Generativa</span><span>Treinamento</span><span>Inferência</span>
          <span>CPU</span><span>GPU</span><span>Parâmetros</span><span>Tokens</span>
        </div>
        <p>
          Progresso interno calculado: <strong>{progress}%</strong>. Depois de salvar o desafio,
          use o botão geral “Marcar aula como concluída” no final da página.
        </p>
      </div>
    </div>
  )
}
