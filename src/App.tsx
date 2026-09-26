import { FormEvent, useMemo, useState } from 'react'
import { course } from './data/course'
import type { Student } from './types'

const STORAGE = {
  student: 'authera.student.v1',
  completed: 'authera.completed.v1',
  answers: 'authera.answers.v1',
  session: 'authera.session.v1',
}

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key)
    return value ? (JSON.parse(value) as T) : fallback
  } catch {
    return fallback
  }
}

const projectMilestones: Record<number, string> = {
  1: 'Definir o problema, objetivo e hipótese do Projeto Integrador.',
  2: 'Construir e versionar o pipeline de dados.',
  3: 'Treinar e avaliar o primeiro modelo de Machine Learning.',
  4: 'Evoluir a solução com Deep Learning quando aplicável.',
  5: 'Adicionar visão computacional ou componente multimodal quando fizer sentido.',
  6: 'Integrar um modelo de linguagem ao projeto.',
  7: 'Construir a base de conhecimento e o RAG.',
  8: 'Adicionar agentes, ferramentas e automações.',
  9: 'Publicar API, container e infraestrutura de inferência.',
  10: 'Adicionar monitoramento, versionamento e ciclo MLOps/LLMOps.',
  11: 'Realizar auditoria de segurança, privacidade e governança.',
  12: 'Consolidar, documentar, demonstrar e defender o produto final.',
}

type Screen = 'home' | 'login' | 'register' | 'course'

function App() {
  const [student, setStudent] = useState<Student | null>(() =>
    loadJSON<Student | null>(STORAGE.student, null),
  )
  const [screen, setScreen] = useState<Screen>(() =>
    localStorage.getItem(STORAGE.session) === 'course' ? 'course' : 'home',
  )
  const [selectedLessonId, setSelectedLessonId] = useState(1)
  const [completed, setCompleted] = useState<number[]>(() =>
    loadJSON<number[]>(STORAGE.completed, []),
  )
  const [answers, setAnswers] = useState<Record<string, string>>(() =>
    loadJSON<Record<string, string>>(STORAGE.answers, {}),
  )
  const [savedMessage, setSavedMessage] = useState('')
  const [loginError, setLoginError] = useState('')

  const allLessons = useMemo(
    () => course.disciplines.flatMap((discipline) => discipline.lessons),
    [],
  )

  const selectedLesson =
    allLessons.find((lesson) => lesson.id === selectedLessonId) ?? allLessons[0]

  const selectedDiscipline =
    course.disciplines.find((discipline) =>
      discipline.lessons.some((lesson) => lesson.id === selectedLesson.id),
    ) ?? course.disciplines[0]

  const progress = Math.round((completed.length / allLessons.length) * 100)
  const answerKey = `lesson-${selectedLesson.id}`

  function register(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()

    if (!name || !email) return

    const newStudent: Student = {
      name,
      email,
      enrolledAt: new Date().toISOString(),
    }

    localStorage.setItem(STORAGE.student, JSON.stringify(newStudent))
    localStorage.setItem(STORAGE.session, 'course')
    setStudent(newStudent)
    setScreen('course')
  }

  function enterCourse() {
    if (!student) {
      setScreen('login')
      return
    }

    localStorage.setItem(STORAGE.session, 'course')
    setScreen('course')
    setLoginError('')
    window.scrollTo({ top: 0 })
  }

  function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const email = String(data.get('email') ?? '').trim().toLowerCase()

    if (!student) {
      setLoginError('Nenhum cadastro piloto foi encontrado neste dispositivo.')
      return
    }

    if (student.email.trim().toLowerCase() !== email) {
      setLoginError('E-mail não corresponde ao cadastro piloto deste dispositivo.')
      return
    }

    localStorage.setItem(STORAGE.session, 'course')
    setLoginError('')
    setScreen('course')
    window.scrollTo({ top: 0 })
  }

  function goHome() {
    localStorage.removeItem(STORAGE.session)
    setScreen('home')
    window.scrollTo({ top: 0 })
  }

  function toggleComplete() {
    const next = completed.includes(selectedLesson.id)
      ? completed.filter((id) => id !== selectedLesson.id)
      : [...completed, selectedLesson.id].sort((a, b) => a - b)

    localStorage.setItem(STORAGE.completed, JSON.stringify(next))
    setCompleted(next)
  }

  function saveAnswer() {
    localStorage.setItem(STORAGE.answers, JSON.stringify(answers))
    setSavedMessage('Resposta salva neste dispositivo.')
    window.setTimeout(() => setSavedMessage(''), 2200)
  }

  function selectLesson(id: number) {
    setSelectedLessonId(id)
    setSavedMessage('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function goRelative(offset: number) {
    const index = allLessons.findIndex((lesson) => lesson.id === selectedLesson.id)
    const next = allLessons[index + offset]
    if (next) selectLesson(next.id)
  }

  function resetPilot() {
    if (!window.confirm('Apagar o cadastro e progresso local deste dispositivo?')) return
    Object.values(STORAGE).forEach((key) => localStorage.removeItem(key))
    setStudent(null)
    setCompleted([])
    setAnswers({})
    setSelectedLessonId(1)
    setScreen('home')
  }

  if (screen === 'home') {
    return (
      <HomePage
        onLogin={() => setScreen('login')}
        onRegister={() => setScreen('register')}
      />
    )
  }

  if (screen === 'login') {
    return (
      <main className="auth-page">
        <section className="auth-shell">
          <button className="back-home-btn" type="button" onClick={goHome}>
            ← Página principal
          </button>

          <div className="brand-lockup">
            <div className="brand-mark">A</div>
            <div>
              <strong>AUTHERA</strong>
              <span>TREINAMENTOS</span>
            </div>
          </div>

          <div className="pilot-badge">ÁREA DO ALUNO</div>
          <h1>Entre para continuar seu curso.</h1>
          <p className="auth-lead">
            Na versão piloto, o acesso é validado pelo e-mail cadastrado neste dispositivo.
            Na próxima fase, esta tela será substituída por autenticação real com Supabase.
          </p>

          <form className="auth-form" onSubmit={login}>
            <label>
              E-mail
              <input
                name="email"
                type="email"
                autoComplete="email"
                placeholder="voce@email.com"
                required
              />
            </label>

            {loginError && <div className="login-error">{loginError}</div>}

            <button className="primary-btn" type="submit">
              Entrar na área do aluno
            </button>
          </form>

          {!student && (
            <button className="auth-register-link" onClick={() => setScreen('register')}>
              Ainda não tenho acesso piloto
            </button>
          )}
        </section>
      </main>
    )
  }

  if (!student || screen === 'register') {
    return (
      <main className="auth-page">
        <section className="auth-shell">
          <button className="back-home-btn" type="button" onClick={goHome}>
            ← Página principal
          </button>

          <div className="brand-lockup">
            <div className="brand-mark">A</div>
            <div>
              <strong>AUTHERA</strong>
              <span>TREINAMENTOS</span>
            </div>
          </div>

          <div className="pilot-badge">TURMA PILOTO · V1</div>
          <h1>Aprenda IA construindo sistemas reais.</h1>
          <p className="auth-lead">
            Você será o primeiro aluno da plataforma AUTHERA Treinamentos. Nesta fase,
            cadastro e progresso ficam salvos somente neste dispositivo.
          </p>

          <div className="course-preview">
            <span>CURSO 01</span>
            <h2>{course.title}</h2>
            <div className="meta-row">
              <b>360h</b>
              <b>12 disciplinas</b>
              <b>60 aulas</b>
            </div>
          </div>

          <form className="auth-form" onSubmit={register}>
            <label>
              Nome completo
              <input name="name" autoComplete="name" placeholder="Seu nome" required />
            </label>
            <label>
              E-mail
              <input
                name="email"
                type="email"
                autoComplete="email"
                placeholder="voce@email.com"
                required
              />
            </label>
            <button className="primary-btn" type="submit">
              Criar meu acesso piloto
            </button>
          </form>

          <p className="microcopy">
            Sem cobrança nesta fase. Autenticação real e banco entram na próxima etapa.
          </p>
        </section>
      </main>
    )
  }

  const firstName = student.name.split(' ')[0]

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-head">
          <div className="brand-lockup compact">
            <div className="brand-mark">A</div>
            <div>
              <strong>AUTHERA</strong>
              <span>TREINAMENTOS</span>
            </div>
          </div>
        </div>

        <div className="student-card">
          <div className="avatar">{student.name.charAt(0).toUpperCase()}</div>
          <div className="student-copy">
            <strong>{student.name}</strong>
            <span>Aluno piloto · 0001</span>
          </div>
        </div>

        <div className="progress-card">
          <div className="progress-heading">
            <span>Progresso geral</span>
            <strong>{progress}%</strong>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <small>
            {completed.length} de {allLessons.length} aulas concluídas
          </small>
        </div>

        <nav className="curriculum" aria-label="Matriz curricular">
          {course.disciplines.map((discipline) => {
            const done = discipline.lessons.filter((lesson) =>
              completed.includes(lesson.id),
            ).length

            return (
              <details
                key={discipline.id}
                open={discipline.id === selectedDiscipline.id}
              >
                <summary>
                  <span className="discipline-number">
                    {String(discipline.id).padStart(2, '0')}
                  </span>
                  <span className="discipline-summary">
                    <b>{discipline.title}</b>
                    <small>{done}/5 aulas</small>
                  </span>
                </summary>

                <div className="lesson-menu">
                  {discipline.lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      className={
                        selectedLesson.id === lesson.id
                          ? 'lesson-menu-item active'
                          : 'lesson-menu-item'
                      }
                      onClick={() => selectLesson(lesson.id)}
                    >
                      <span className={completed.includes(lesson.id) ? 'done-dot' : ''}>
                        {completed.includes(lesson.id) ? '✓' : lesson.id}
                      </span>
                      <span>{lesson.title}</span>
                    </button>
                  ))}
                </div>
              </details>
            )
          })}
        </nav>

        <div className="sidebar-actions">
          <button className="ghost-btn" onClick={goHome}>
            ← Página principal
          </button>
          <button className="logout-btn" onClick={goHome}>
            Encerrar sessão
          </button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div>
            <span className="top-kicker">CURSO 01</span>
            <strong>{course.shortTitle}</strong>
          </div>
          <div className="top-meta">
            <span>360 horas</span>
            <span>12 disciplinas</span>
            <span>60 aulas</span>
          </div>
        </header>

        <article className="lesson-page">
          <section className="welcome-strip">
            <div>
              <span>Olá, {firstName}.</span>
              <strong>Você está construindo seu percurso em IA.</strong>
            </div>
            <div className="course-progress-number">{progress}%</div>
          </section>

          <div className="breadcrumb">
            Disciplina {selectedDiscipline.id} · Aula {selectedLesson.id}
          </div>

          <div className="lesson-title-row">
            <div>
              <span className="eyebrow">AULA {String(selectedLesson.id).padStart(2, '0')}</span>
              <h1>{selectedLesson.title}</h1>
            </div>
            <span className="hours-pill">{selectedLesson.hours}h</span>
          </div>

          <section className="discipline-banner">
            <span>DISCIPLINA {String(selectedDiscipline.id).padStart(2, '0')}</span>
            <h2>{selectedDiscipline.title}</h2>
            <p>
              Etapa do Projeto Integrador: {projectMilestones[selectedDiscipline.id]}
            </p>
          </section>

          {selectedLesson.id === 1 ? (
            <LessonOne
              answer={answers[answerKey] ?? ''}
              onAnswer={(value) =>
                setAnswers((current) => ({ ...current, [answerKey]: value }))
              }
              onSaveAnswer={saveAnswer}
              savedMessage={savedMessage}
            />
          ) : (
            <section className="content-card placeholder-card">
              <span className="eyebrow">CONTEÚDO EM PRODUÇÃO</span>
              <h2>{selectedLesson.title}</h2>
              <p>
                A matriz curricular completa já está cadastrada. Durante a turma piloto,
                cada aula será produzida, testada e aperfeiçoada antes de ser liberada.
              </p>
              <div className="placeholder-grid">
                <div><b>2h</b><span>Fundamentos e teoria</span></div>
                <div><b>3h</b><span>Laboratório prático</span></div>
                <div><b>1h</b><span>Desafio aplicado</span></div>
              </div>
            </section>
          )}

          <section className="ai-card">
            <div className="ai-icon">AI</div>
            <div>
              <div className="section-label">FASE 2</div>
              <h2>Professor IA AUTHERA</h2>
              <p>
                O professor contextual será ligado ao material de cada aula via RAG e
                responderá prioritariamente pelo JARVIS/Ollama.
              </p>
            </div>
            <button disabled>Em breve</button>
          </section>

          <section className="project-card">
            <div>
              <span className="section-label">PROJETO INTEGRADOR</span>
              <h2>Entrega da Disciplina {selectedDiscipline.id}</h2>
              <p>{projectMilestones[selectedDiscipline.id]}</p>
            </div>
            <div className="project-status">Preparação</div>
          </section>

          <footer className="lesson-actions">
            <button
              className="secondary-btn"
              onClick={() => goRelative(-1)}
              disabled={selectedLesson.id === 1}
            >
              ← Aula anterior
            </button>

            <button
              className={completed.includes(selectedLesson.id) ? 'complete-btn completed' : 'complete-btn'}
              onClick={toggleComplete}
            >
              {completed.includes(selectedLesson.id)
                ? '✓ Aula concluída'
                : 'Marcar aula como concluída'}
            </button>

            <button
              className="secondary-btn"
              onClick={() => goRelative(1)}
              disabled={selectedLesson.id === allLessons.length}
            >
              Próxima aula →
            </button>
          </footer>
        </article>
      </main>
    </div>
  )
}

type HomePageProps = {
  onLogin: () => void
  onRegister: () => void
}

function HomePage({ onLogin, onRegister }: HomePageProps) {
  const [showProgram, setShowProgram] = useState(false)

  function toggleProgram() {
    const next = !showProgram
    setShowProgram(next)

    if (!showProgram) {
      window.setTimeout(() => {
        document.getElementById('programacao')?.scrollIntoView({ behavior: 'smooth' })
      }, 80)
    }
  }

  return (
    <main className="home-page">
      <header className="home-header">
        <div className="brand-lockup">
          <div className="brand-mark">A</div>
          <div>
            <strong>AUTHERA</strong>
            <span>TREINAMENTOS</span>
          </div>
        </div>

        <div className="public-nav">
          <a href="#curso">Curso</a>
          <a href="#metodologia">Metodologia</a>
          <button className="header-login-btn" onClick={onLogin}>Entrar</button>
        </div>
      </header>

      <section className="home-hero">
        <div className="home-copy">
          <span className="eyebrow">AUTHERA TREINAMENTOS</span>
          <h1>Formação prática para quem quer compreender e construir Inteligência Artificial.</h1>
          <p>
            Cursos online desenvolvidos para unir fundamentos, prática, projetos reais
            e engenharia de sistemas inteligentes.
          </p>

          <div className="home-actions">
            <button className="primary-btn" onClick={onRegister}>
              Conhecer a turma piloto
            </button>
            <button className="secondary-btn" onClick={onLogin}>
              Entrar na área do aluno
            </button>
            <button className="program-btn" onClick={toggleProgram}>
              {showProgram ? 'Fechar programação' : 'Ver programação completa'}
            </button>
          </div>
        </div>

        <div className="home-course-card" id="curso">
          <span>CURSO 01</span>
          <h2>{course.title}</h2>
          <p>
            Da matemática e Machine Learning até LLMs, RAG, agentes, MLOps,
            infraestrutura e segurança de IA.
          </p>

          <div className="home-stats">
            <div><b>360h</b><span>Carga horária</span></div>
            <div><b>12</b><span>Disciplinas</span></div>
            <div><b>60</b><span>Aulas</span></div>
          </div>
        </div>
      </section>

      <section className="home-pillars" id="metodologia">
        <article>
          <span>01</span>
          <h3>Fundamentos sólidos</h3>
          <p>Matemática, dados, Machine Learning e Deep Learning antes das ferramentas.</p>
        </article>
        <article>
          <span>02</span>
          <h3>IA moderna</h3>
          <p>LLMs, RAG, agentes, modelos locais, multimodalidade e MCP.</p>
        </article>
        <article>
          <span>03</span>
          <h3>Produção real</h3>
          <p>APIs, Docker, GPU, MLOps, observabilidade, segurança e implantação.</p>
        </article>
      </section>

      {showProgram && (
        <section className="public-program" id="programacao">
          <div className="program-header">
            <div>
              <span className="section-label">PROGRAMAÇÃO COMPLETA</span>
              <h2>12 disciplinas · 60 aulas · 360 horas</h2>
              <p>
                Clique em uma disciplina para visualizar as cinco aulas que fazem parte dela.
              </p>
            </div>
            <button className="program-close" onClick={toggleProgram}>Fechar</button>
          </div>

          <div className="program-list">
            {course.disciplines.map((discipline) => (
              <details className="program-discipline" key={discipline.id}>
                <summary>
                  <div className="program-number">
                    {String(discipline.id).padStart(2, '0')}
                  </div>
                  <div className="program-summary-copy">
                    <strong>{discipline.title}</strong>
                    <span>30 horas · 5 aulas</span>
                  </div>
                  <div className="program-chevron">⌄</div>
                </summary>

                <div className="program-lessons">
                  {discipline.lessons.map((lesson) => (
                    <div className="program-lesson" key={lesson.id}>
                      <span className="program-lesson-number">
                        Aula {String(lesson.id).padStart(2, '0')}
                      </span>
                      <strong>{lesson.title}</strong>
                      <span className="program-lesson-hours">{lesson.hours}h</span>
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </section>
      )}

      <section className="public-cta">
        <div>
          <span className="section-label">ÁREA DO ALUNO</span>
          <h2>Já está matriculado?</h2>
          <p>Entre para acessar aulas, progresso, atividades e Projeto Integrador.</p>
        </div>
        <button className="primary-btn" onClick={onLogin}>Entrar</button>
      </section>

      <footer className="home-footer">
        AUTHERA Treinamentos · Educação aplicada à Inteligência Artificial
      </footer>
    </main>
  )
}

type LessonOneProps = {
  answer: string
  onAnswer: (value: string) => void
  onSaveAnswer: () => void
  savedMessage: string
}

function LessonOne({ answer, onAnswer, onSaveAnswer, savedMessage }: LessonOneProps) {
  return (
    <>
      <section className="content-card">
        <div className="section-label">OBJETIVOS DE APRENDIZAGEM</div>
        <h2>Ao final desta aula você deverá ser capaz de:</h2>

        <div className="objectives-grid">
          <div>
            <b>01</b>
            <p>Explicar o que chamamos de Inteligência Artificial.</p>
          </div>
          <div>
            <b>02</b>
            <p>Diferenciar IA, Machine Learning, Deep Learning e IA Generativa.</p>
          </div>
          <div>
            <b>03</b>
            <p>Compreender treinamento, inferência, modelos, parâmetros e tokens.</p>
          </div>
          <div>
            <b>04</b>
            <p>Relacionar CPU, GPU, memória e armazenamento ao processamento de IA.</p>
          </div>
        </div>
      </section>

      <section className="content-card">
        <div className="section-label">1.1 · CONCEITO FUNDAMENTAL</div>
        <h2>O que é Inteligência Artificial?</h2>
        <p>
          Inteligência Artificial é uma área da computação que desenvolve sistemas
          capazes de executar tarefas associadas a percepção, previsão, decisão,
          linguagem, criação e resolução de problemas.
        </p>
        <blockquote>
          O ponto central do curso não será apenas utilizar IA, mas compreender como
          ela aprende, como é construída e como se transforma em um sistema confiável.
        </blockquote>
      </section>

      <section className="content-card">
        <div className="section-label">1.2 · MAPA DA ÁREA</div>
        <h2>IA → ML → Deep Learning → IA Generativa</h2>
        <div className="concept-flow">
          <div><b>IA</b><span>Campo mais amplo</span></div>
          <i>→</i>
          <div><b>Machine Learning</b><span>Aprende padrões nos dados</span></div>
          <i>→</i>
          <div><b>Deep Learning</b><span>Redes neurais profundas</span></div>
          <i>→</i>
          <div><b>IA Generativa</b><span>Gera novo conteúdo</span></div>
        </div>
      </section>

      <section className="content-card">
        <div className="section-label">DESAFIO DA AULA</div>
        <h2>Explique com suas próprias palavras</h2>
        <p>
          Qual é a diferença entre Inteligência Artificial, Machine Learning e Deep
          Learning? Não procure uma definição pronta: queremos registrar sua compreensão
          inicial e comparar novamente no fim da disciplina.
        </p>
        <textarea
          className="answer-box"
          value={answer}
          onChange={(event) => onAnswer(event.target.value)}
          placeholder="Escreva sua resposta..."
        />
        <div className="save-row">
          <span>{savedMessage}</span>
          <button className="secondary-btn" onClick={onSaveAnswer}>
            Salvar resposta
          </button>
        </div>
      </section>
    </>
  )
}

export default App
