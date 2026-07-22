import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import "./styles.css";
import Dashboard from "./pages/Dashboard.jsx";

const apiResponse = `{
  "username": "octocat",
  "rating_score": 72,
  "developer_level": "Mid",
  "public_activity": {
    "public_commits": 18,
    "public_prs_created": 4
  },
  "model_info": {
    "data_source": "rest-public"
  }
}`;

const deployCommands = `cp .env.example .env
docker compose up --build -d
docker compose logs -f api`;

const powershellCommands = `py -3.12 -m venv .venv
.\\.venv\\Scripts\\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000`;

function Shell({ children }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink className="brand" to="/">
          <span className="brand-mark">G</span>
          <span>AI Reviewer Docs</span>
        </NavLink>
        <nav>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/" end>Overview</NavLink>
          <NavLink to="/how-it-works">How It Works</NavLink>
          <NavLink to="/api">API</NavLink>
          <NavLink to="/deploy">Deploy</NavLink>
          <NavLink to="/troubleshooting">Troubleshooting</NavLink>
        </nav>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}

function PageHeader({ eyebrow, title, children }) {
  return (
    <header className="page-header">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{children}</p>
    </header>
  );
}

function CodeBlock({ children }) {
  return <pre className="code"><code>{children}</code></pre>;
}

function Overview() {
  return (
    <>
      <PageHeader eyebrow="Documentation" title="GitHub Profile AI Reviewer">
        A FastAPI service that rates public GitHub profiles out of 100 using repository, language, contribution, public commit, and pull request signals.
      </PageHeader>

      <section className="grid three">
        <article className="card">
          <span className="card-kicker">Rating</span>
          <h2>0-100 score</h2>
          <p>The API returns `rating_score`, level, confidence, consistency, strongest language, and public activity counts.</p>
        </article>
        <article className="card">
          <span className="card-kicker">Token Optional</span>
          <h2>Public or GraphQL</h2>
          <p>No token mode uses GitHub public REST. A valid `GITHUB_TOKEN` enables richer GraphQL data and higher rate limits.</p>
        </article>
        <article className="card">
          <span className="card-kicker">Frontend</span>
          <h2>Built-in console</h2>
          <p>The FastAPI app serves a lightweight analyzer UI at `http://localhost:8000/` for quick testing.</p>
        </article>
      </section>

      <section className="panel">
        <h2>Repository Layout</h2>
        <div className="folder-map">
          <div><strong>app/</strong><span>FastAPI app, routes, scoring workflow, GitHub clients, static API console.</span></div>
          <div><strong>app/api/</strong><span>HTTP routes for `/health` and `/analyze`.</span></div>
          <div><strong>app/graph/</strong><span>Workflow that extracts signals and builds the final report.</span></div>
          <div><strong>scripts/</strong><span>Developer CLI helpers.</span></div>
          <div><strong>backend/</strong><span>Legacy LangGraph prototype pipeline.</span></div>
          <div><strong>src/</strong><span>This React documentation website.</span></div>
        </div>
      </section>
    </>
  );
}

function HowItWorks() {
  return (
    <>
      <PageHeader eyebrow="Architecture" title="How the scoring pipeline works">
        The app collects public GitHub signals, normalizes them, creates repository text embeddings, and blends activity with consistency into a developer rating.
      </PageHeader>

      <section className="timeline">
        {[
          ["1", "Request", "The frontend or client sends `POST /analyze` with a GitHub username."],
          ["2", "GitHub data", "The backend uses GraphQL when `GITHUB_TOKEN` is valid, otherwise public REST endpoints."],
          ["3", "Signal extraction", "Repositories, languages, stars, forks, followers, public commits, and public PRs are collected."],
          ["4", "Scoring", "A deterministic heuristic rates activity, consistency, public impact, and language signals out of 100."],
          ["5", "Response", "The API returns rating, level, public activity, language breakdown, streak data, and metadata."]
        ].map(([step, title, text]) => (
          <article className="timeline-item" key={step}>
            <span>{step}</span>
            <div>
              <h2>{title}</h2>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="panel">
        <h2>Data Source Behavior</h2>
        <p><strong>Authenticated mode:</strong> uses GitHub GraphQL and gives more complete contribution totals.</p>
        <p><strong>Public mode:</strong> uses recent public REST events, so public commits and public PRs are recent public activity, not private contribution history.</p>
      </section>
    </>
  );
}

function Api() {
  return (
    <>
      <PageHeader eyebrow="API" title="Analyze GitHub profiles">
        The API is JSON-only and can be called from the built-in console, another frontend, curl, or any backend client.
      </PageHeader>

      <section className="grid two">
        <article className="panel">
          <h2>Request</h2>
          <CodeBlock>{`POST /analyze
Content-Type: application/json

{
  "username": "octocat"
}`}</CodeBlock>
        </article>
        <article className="panel">
          <h2>Response</h2>
          <CodeBlock>{apiResponse}</CodeBlock>
        </article>
      </section>

      <section className="panel">
        <h2>Important Response Fields</h2>
        <ul className="list">
          <li><strong>rating_score</strong> Main score from 0 to 100.</li>
          <li><strong>public_activity.public_commits</strong> Public commits counted for the user.</li>
          <li><strong>public_activity.public_prs_created</strong> Public pull requests created by the user.</li>
          <li><strong>model_info.data_source</strong> `graphql` for token mode, `rest-public` for public mode.</li>
        </ul>
      </section>
    </>
  );
}

function Deploy() {
  return (
    <>
      <PageHeader eyebrow="Deployment" title="Run locally or deploy with Docker">
        Use local Python for development and Docker Compose for repeatable deployment on a VM or server.
      </PageHeader>

      <section className="grid two">
        <article className="panel">
          <h2>Windows PowerShell</h2>
          <CodeBlock>{powershellCommands}</CodeBlock>
          <p>The API and built-in analyzer UI will be available at `http://localhost:8000/`.</p>
        </article>
        <article className="panel">
          <h2>Docker Compose</h2>
          <CodeBlock>{deployCommands}</CodeBlock>
          <p>Forward traffic to container port `8000` when deploying behind a domain or reverse proxy.</p>
        </article>
      </section>

      <section className="panel">
        <h2>Environment</h2>
        <CodeBlock>{`GITHUB_TOKEN=
GITHUB_API_URL=https://api.github.com/graphql
GITHUB_REST_API_URL=https://api.github.com
GITHUB_PUBLIC_REPO_LIMIT=20
GITHUB_FETCH_COMMIT_COUNTS=false
GITHUB_CACHE_TTL_SECONDS=900
APP_HOST=0.0.0.0
APP_PORT=8000
SCORING_BACKEND=heuristic`}</CodeBlock>
      </section>
    </>
  );
}

function Troubleshooting() {
  return (
    <>
      <PageHeader eyebrow="Support" title="Common issues and fixes">
        Most problems come from Python environment mismatch, GitHub credentials, CORS, or GitHub public API rate limits.
      </PageHeader>

      <section className="grid two">
        <article className="card">
          <h2>Missing Python packages</h2>
          <p>Use `python -m pip install -r requirements.txt` inside `.venv`, then run `python -m uvicorn ...`.</p>
        </article>
        <article className="card">
          <h2>Bad credentials</h2>
          <p>Set `GITHUB_TOKEN=` empty for public mode, or create a valid GitHub token and restart Uvicorn.</p>
        </article>
        <article className="card">
          <h2>Rate limit exceeded</h2>
          <p>Add a valid `GITHUB_TOKEN`. Public mode is intentionally limited by GitHub.</p>
        </article>
        <article className="card">
          <h2>Frontend not fetching</h2>
          <p>Use the FastAPI-served page at `http://localhost:8000/`, or set API Base to `http://127.0.0.1:8000`.</p>
        </article>
      </section>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Shell>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Overview />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/api" element={<Api />} />
          <Route path="/deploy" element={<Deploy />} />
          <Route path="/troubleshooting" element={<Troubleshooting />} />
        </Routes>
      </Shell>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(<App />);
