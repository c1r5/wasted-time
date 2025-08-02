# ⏳ Wasted Time Viewer

## 📌 VISÃO GERAL

**Wasted Time Viewer** é uma aplicação que permite ao usuário gerenciar e refletir sobre como utiliza seu tempo no dia a dia. A ferramenta oferece uma visão macro, média e micro da rotina, ajudando a responder:

- Para onde foi meu tempo?
- Onde mais gastei meu tempo?
- Onde posso tirar N minutos para estudar ou fazer algo que importa?

A proposta é aumentar a **disciplina pessoal** e promover **equilíbrio entre as áreas da vida**, destacando períodos ociosos ou mal aproveitados, como tempo de tela ou distrações.

---

## 🎯 OBJETIVO

Criar um MVP onde o usuário possa:

- Preencher o seu dia com atividades organizadas em blocos de 30 minutos.
- Visualizar claramente os blocos livres (lacunas) no calendário diário.
- Classificar atividades por categoria e visualizar o tempo gasto em cada uma.
- Obter uma visão analítica e interativa da própria rotina.

---

## 👤 Casos de Uso

- Quem estuda por conta própria e quer saber onde pode encaixar mais sessões.
- Pessoas com agenda cheia, mas sem clareza de onde o tempo vai.
- Alguém tentando criar uma rotina nova (ex: academia, leitura).
- Pessoas tentando reduzir distrações (procrastinação digital, por exemplo).

---

## 🔧 Funcionalidades Primárias

1. **Calendário com todos os dias do mês.**
2. Cada dia é dividido em **blocos de 30 minutos** numa grade de 24 horas.
3. **Categorias coloridas**: trabalho, estudo, lazer, distrações, descanso etc.
4. Destaque visual de **tempo livre (lacunas)**.
5. Visualização adaptável: **Macro (mensal), Média (semanal), Micro (diária)**.
6. **Relatórios** de tempo gasto por categoria e tempo livre restante.

---

## ✨ Funcionalidades Futuras Desejadas

1. **Exportação de relatórios com gráficos** em PDF, CSV ou imagem.
2. **Insights automáticos** com IA: recomendações de hábitos, alertas de excesso em certas categorias, sugestões de foco.
3. Integração com **Google Calendar** ou outras agendas.
4. Modo de análise semanal com **destaques de produtividade e procrastinação**.

---

## ⚙️ Tecnologias Sugeridas para o MVP

- **Frontend:** React + TailwindCSS
- **Visualização:** D3.js ou FullCalendar
- **Armazenamento local:** localStorage ou IndexedDB (sem backend)
- **Extras:** Exportar CSV/imagem; modo escuro; responsividade mobile

---

## 📁 Estrutura Inicial Sugerida

```
/src
├── components
│ ├── TimeGrid.jsx
│ ├── TimeBlock.jsx
├── logic
│ └── encontrarLacunas.js
├── App.jsx
└── index.js
```
