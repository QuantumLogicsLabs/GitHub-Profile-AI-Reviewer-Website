import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const API_BASE = import.meta.env.VITE_API_BASE || "https://muhammadsaadamin-github-ai-reviewer.hf.space";

export default function Dashboard() {
  const [username, setUsername] = useState("octocat");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  async function handleAnalyze() {
    if (!username.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim() }),
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.detail || `Request failed (${response.status})`);
      }

      const data = await response.json();
      setResult(data);
    } catch (e) {
      setError(e.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400">Dashboard</p>
        <h1 className="text-3xl font-bold text-slate-100">Analyze a GitHub Profile</h1>
        <p className="text-slate-400">
          Enter a public GitHub username to get a live developer rating from the API.
        </p>
      </header>

      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="GitHub username (e.g. octocat)"
            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
          />
          <Button onClick={handleAnalyze} disabled={loading}>
            {loading ? "Analyzing..." : "Analyze"}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-900 bg-red-950/40">
          <CardContent className="p-4 text-sm text-red-300">{error}</CardContent>
        </Card>
      )}

      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle>Rating</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-bold text-emerald-400">
                {result.rating_score}
                <span className="text-base text-slate-500">/100</span>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Level</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge>{result.developer_level}</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Strongest Language</CardTitle>
              </CardHeader>
              <CardContent className="text-lg font-semibold text-slate-100">
                {result.strongest_language}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hiring Readiness</CardTitle>
              </CardHeader>
              <CardContent className="text-lg font-semibold text-slate-100">
                {result.hiring_readiness_score}/100
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Language Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(result.language_breakdown || {}).map(([lang, pct]) => (
                  <div key={lang} className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">{lang}</span>
                    <span className="text-slate-500">{pct}%</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Streak</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm text-slate-300">
                <div>Current streak: {result.streak_data?.current_streak} days</div>
                <div>Longest streak: {result.streak_data?.longest_streak} days</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Activity Signals</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm text-slate-300 sm:grid-cols-3">
              <div>Public commits: {result.public_activity?.public_commits}</div>
              <div>Public PRs created: {result.public_activity?.public_prs_created}</div>
              <div>Total commits: {result.graphql_signals?.total_commits}</div>
              <div>Merged PRs: {result.graphql_signals?.merged_prs}</div>
              <div>Consistency score: {result.consistency_score}/100</div>
              <div>Confidence: {(result.confidence * 100).toFixed(0)}%</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}