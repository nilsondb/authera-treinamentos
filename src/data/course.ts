import type { Course } from '../types'

const lesson = (id: number, title: string) => ({ id, title, hours: 6 })

export const course: Course = {
  id: 'ia-aplicada-engenharia-sistemas-inteligentes',
  title: 'Inteligência Artificial Aplicada e Engenharia de Sistemas Inteligentes',
  shortTitle: 'IA Aplicada e Engenharia de Sistemas Inteligentes',
  hours: 360,
  disciplines: [
    {
      id: 1,
      title: 'Fundamentos Matemáticos, Estatísticos e Computacionais da IA',
      lessons: [
        lesson(1, 'Inteligência Artificial: fundamentos e evolução'),
        lesson(2, 'Álgebra Linear aplicada à IA'),
        lesson(3, 'Probabilidade e Estatística para IA'),
        lesson(4, 'Cálculo e Otimização'),
        lesson(5, 'Avaliação Científica de Modelos'),
      ],
    },
    {
      id: 2,
      title: 'Python, Dados e Engenharia de Dados para IA',
      lessons: [
        lesson(6, 'Python aplicado à Inteligência Artificial'),
        lesson(7, 'Aquisição e preparação de dados'),
        lesson(8, 'Bancos de Dados para IA'),
        lesson(9, 'Feature Engineering'),
        lesson(10, 'Engenharia e versionamento de dados'),
      ],
    },
    {
      id: 3,
      title: 'Machine Learning e Modelagem Preditiva',
      lessons: [
        lesson(11, 'Regressão e previsão'),
        lesson(12, 'Classificação'),
        lesson(13, 'Ensemble Learning'),
        lesson(14, 'Aprendizado não supervisionado'),
        lesson(15, 'Seleção, interpretação e explicabilidade'),
      ],
    },
    {
      id: 4,
      title: 'Deep Learning, Redes Neurais e Aprendizado Avançado',
      lessons: [
        lesson(16, 'Redes neurais artificiais'),
        lesson(17, 'Treinamento de redes neurais'),
        lesson(18, 'Redes convolucionais'),
        lesson(19, 'Redes para dados sequenciais'),
        lesson(20, 'Modelos generativos e aprendizado avançado'),
      ],
    },
    {
      id: 5,
      title: 'Visão Computacional e Inteligência Multimodal',
      lessons: [
        lesson(21, 'Processamento digital de imagens'),
        lesson(22, 'Detecção e classificação de objetos'),
        lesson(23, 'Reconhecimento facial e biometria'),
        lesson(24, 'Document AI e multimodalidade'),
        lesson(25, 'Sistemas multimodais em tempo real'),
      ],
    },
    {
      id: 6,
      title: 'NLP, Transformers e Large Language Models',
      lessons: [
        lesson(26, 'Fundamentos de NLP'),
        lesson(27, 'Attention e Transformers'),
        lesson(28, 'Anatomia de um Large Language Model'),
        lesson(29, 'Engenharia de Prompt e Structured Output'),
        lesson(30, 'Modelos abertos e IA local'),
      ],
    },
    {
      id: 7,
      title: 'IA Generativa, Modelos Locais, RAG e Fine-Tuning',
      lessons: [
        lesson(31, 'Embeddings e busca semântica'),
        lesson(32, 'Arquitetura RAG'),
        lesson(33, 'RAG Avançado'),
        lesson(34, 'Avaliação de sistemas RAG'),
        lesson(35, 'Fine-Tuning e adaptação de modelos'),
      ],
    },
    {
      id: 8,
      title: 'Agentes Inteligentes, Ferramentas e MCP',
      lessons: [
        lesson(36, 'Fundamentos de agentes de IA'),
        lesson(37, 'Tool Calling e integração com sistemas'),
        lesson(38, 'Workflows e memória'),
        lesson(39, 'Model Context Protocol — MCP'),
        lesson(40, 'Sistemas Multiagentes'),
      ],
    },
    {
      id: 9,
      title: 'Engenharia de Sistemas de IA e Infraestrutura',
      lessons: [
        lesson(41, 'APIs profissionais para IA'),
        lesson(42, 'Docker para Inteligência Artificial'),
        lesson(43, 'GPU e CUDA para IA'),
        lesson(44, 'Servidores de inferência'),
        lesson(45, 'Kubernetes, Edge e Cloud'),
      ],
    },
    {
      id: 10,
      title: 'MLOps, LLMOps, Observabilidade e Escalabilidade',
      lessons: [
        lesson(46, 'Ciclo de vida de Machine Learning'),
        lesson(47, 'MLflow e gestão de experimentos'),
        lesson(48, 'CI/CD para Inteligência Artificial'),
        lesson(49, 'Observabilidade de IA'),
        lesson(50, 'LLMOps e evolução contínua'),
      ],
    },
    {
      id: 11,
      title: 'Segurança, Privacidade, Ética e Governança de IA',
      lessons: [
        lesson(51, 'Segurança de aplicações com LLM'),
        lesson(52, 'Segurança de dados e infraestrutura'),
        lesson(53, 'Segurança de modelos'),
        lesson(54, 'Governança e IA responsável'),
        lesson(55, 'Red Team de Inteligência Artificial'),
      ],
    },
    {
      id: 12,
      title: 'Projeto Integrador de Inteligência Artificial',
      lessons: [
        lesson(56, 'Arquitetura e proposta de projeto'),
        lesson(57, 'Construção do núcleo inteligente'),
        lesson(58, 'Engenharia e implantação'),
        lesson(59, 'Observabilidade, avaliação e segurança'),
        lesson(60, 'Defesa do projeto'),
      ],
    },
  ],
}
