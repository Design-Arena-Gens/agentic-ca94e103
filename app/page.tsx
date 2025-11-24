"use client";

import { FormEvent, useMemo, useState } from "react";
import { clsx } from "clsx";
import { generateVideoBlueprint } from "@/lib/generators";
import type { VideoBlueprint } from "@/lib/types";

type FormState = {
  topic: string;
  minutes: number;
  audience: string;
  tone: string;
  callToAction: string;
  keywords: string;
};

const DEFAULT_FORM: FormState = {
  topic: "AI-assisted design systems",
  minutes: 9,
  audience: "design directors at product-led companies",
  tone: "Authoritative",
  callToAction:
    "Download the design ops blueprint and align your next sprint in under 30 minutes.",
  keywords: "design automation, ai design workflow, figma systems"
};

const TONE_OPTIONS = [
  "Authoritative",
  "Educational",
  "Inspirational",
  "Entertaining",
  "Analytical"
];

function splitKeywords(input: string): string[] {
  return input
    .split(/[,\n]/)
    .map((word) => word.trim())
    .filter(Boolean);
}

function downloadFile(fileName: string, contents: string) {
  const blob = new Blob([contents], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function copyToClipboard(text: string) {
  return navigator.clipboard?.writeText(text);
}

export default function Page() {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [blueprint, setBlueprint] = useState<VideoBlueprint | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  const outlineDurationTotal = useMemo(() => {
    if (!blueprint) return 0;
    return blueprint.outline.reduce(
      (acc, section) => acc + section.estimatedDuration,
      0
    );
  }, [blueprint]);

  const handleGenerate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsThinking(true);
    try {
      const plan = generateVideoBlueprint({
        topic: form.topic,
        minutes: form.minutes,
        targetAudience: form.audience,
        tone: form.tone,
        keywords: splitKeywords(form.keywords),
        callToAction: form.callToAction
      });
      setBlueprint(plan);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="grid">
      <section className="card input-panel">
        <div className="status-pill planning">
          <span />
          Planning Deck
        </div>
        <h2>Campaign Brief</h2>
        <p>
          Define the topic and intent. The agent synthesizes research, outline,
          scripts, and publishing assets for a high-impact upload.
        </p>
        <form onSubmit={handleGenerate}>
          <div className="field-group">
            <label htmlFor="topic">Video topic or keyword</label>
            <input
              id="topic"
              value={form.topic}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, topic: event.target.value }))
              }
              placeholder="e.g. 'YouTube strategy for SaaS founders'"
              required
            />
            <p className="field-note">
              The agent anchors research and metadata around this focus.
            </p>
          </div>
          <div className="field-inline">
            <div className="field-group">
              <label htmlFor="minutes">Length (minutes)</label>
              <input
                id="minutes"
                type="number"
                min={5}
                max={25}
                value={form.minutes}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    minutes: Number(event.target.value || 9)
                  }))
                }
              />
            </div>
            <div className="field-group">
              <label htmlFor="tone">Tone</label>
              <select
                id="tone"
                value={form.tone}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, tone: event.target.value }))
                }
              >
                {TONE_OPTIONS.map((tone) => (
                  <option key={tone} value={tone}>
                    {tone}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="field-group">
            <label htmlFor="audience">Target audience</label>
            <input
              id="audience"
              value={form.audience}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, audience: event.target.value }))
              }
              placeholder="Who are we speaking to?"
            />
          </div>
          <div className="field-group">
            <label htmlFor="cta">Primary call to action</label>
            <input
              id="cta"
              value={form.callToAction}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  callToAction: event.target.value
                }))
              }
              placeholder="Invite viewers to download, subscribe, join, etc."
            />
          </div>
          <div className="field-group">
            <label htmlFor="keywords">Priority keywords</label>
            <textarea
              id="keywords"
              value={form.keywords}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, keywords: event.target.value }))
              }
              placeholder="Comma separated or line separated keyword phrases"
            />
            <p className="field-note">
              Used to boost metadata suggestions and align with search intent.
            </p>
          </div>
          <div className="cta-row">
            <button
              className={clsx("btn-primary")}
              type="submit"
              disabled={isThinking}
            >
              {isThinking ? "Synthesizing Blueprint…" : "Generate Blueprint"}
            </button>
            {blueprint ? (
              <>
                <button
                  className="btn-secondary"
                  type="button"
                  onClick={() =>
                    downloadFile(
                      "youtube-blueprint.txt",
                      formatBlueprintText(blueprint)
                    )
                  }
                >
                  Export Script + Assets
                </button>
                <button
                  className="btn-secondary"
                  type="button"
                  onClick={() =>
                    copyToClipboard(formatBlueprintText(blueprint))
                  }
                >
                  Copy to Clipboard
                </button>
              </>
            ) : null}
          </div>
        </form>
      </section>

      {blueprint ? (
        <div className="grid" style={{ gap: "1.75rem" }}>
          <section className="card">
            <div className="status-pill active">
              <span />
              Campaign Generated
            </div>
            <h2>{blueprint.videoLengthMinutes} Minute Production Blueprint</h2>
            <p>
              Narrative angle: {blueprint.narrativeAngle}. Focused on{" "}
              {blueprint.targetAudience}.
            </p>
            <div className="pill-stack">
              {blueprint.primaryKeywords.slice(0, 5).map((keyword) => (
                <span key={keyword} className="tag">
                  {keyword}
                </span>
              ))}
            </div>
          </section>

          <section className="card">
            <h2>Niche Intel & Research</h2>
            <p>{blueprint.nicheAnalysis.positioningStatement}</p>
            <div className="grid two" style={{ marginTop: "1.2rem" }}>
              <div>
                <h3>Trend Signals</h3>
                <ul>
                  {blueprint.nicheAnalysis.trendSignals.map((signal) => (
                    <li key={signal.headline}>
                      <strong>{signal.headline}</strong>
                      <br />
                      <span>{signal.rationale}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Audience Intel</h3>
                <p>
                  Pressing questions from {blueprint.targetAudience}. Address
                  these early to lock retention.
                </p>
                <ul>
                  {blueprint.nicheAnalysis.audienceQuestions.map((question) => (
                    <li key={question}>{question}</li>
                  ))}
                </ul>
                <h3>Competitor Watch</h3>
                <ul>
                  {blueprint.nicheAnalysis.competitorWatch.map((channel) => (
                    <li key={channel}>{channel}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="card">
            <h2>Outline Architecture</h2>
            <p>
              Structured for {outlineDurationTotal} minutes coverage. Each block
              includes talking points and desired viewer state.
            </p>
            <div className="grid" style={{ gap: "1.25rem" }}>
              {blueprint.outline.map((section) => (
                <div
                  key={section.title}
                  className="metadata-entry"
                  style={{ background: "rgba(9,13,24,0.82)" }}
                >
                  <h3>
                    {section.title}{" "}
                    <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
                      · {section.estimatedDuration} min
                    </span>
                  </h3>
                  <p>{section.purpose}</p>
                  <ul>
                    {section.talkingPoints.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="card">
            <h2>Voiceover Script & Visual Direction</h2>
            {blueprint.script.map((section) => (
              <div key={section.title} className="metadata-entry">
                <h3>{section.title}</h3>
                <div className="script-block">{section.voiceover}</div>
                <h4>Visual Prompts</h4>
                <ul>
                  {section.visualPrompts.map((prompt) => (
                    <li key={prompt}>{prompt}</li>
                  ))}
                </ul>
                <h4>Engagement Cue</h4>
                <p>{section.engagementHook}</p>
              </div>
            ))}
          </section>

          <section className="card">
            <h2>SEO & Metadata Package</h2>
            <div className="metadata-grid">
              <div className="metadata-entry">
                <h4>Title</h4>
                <p>{blueprint.seo.videoTitle}</p>
              </div>
              <div className="metadata-entry">
                <h4>Description</h4>
                <p style={{ whiteSpace: "pre-line" }}>
                  {blueprint.seo.description}
                </p>
              </div>
              <div className="metadata-entry">
                <h4>Tags</h4>
                <div className="tag-row">
                  {blueprint.seo.keywordTags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="metadata-entry">
                <h4>Hashtags</h4>
                <div className="tag-row">
                  {blueprint.seo.hashtags.map((hashtag) => (
                    <span key={hashtag} className="tag">
                      {hashtag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="metadata-entry">
                <h4>Chapter Markers</h4>
                <ul>
                  {blueprint.seo.chapterMarkers.map((marker) => (
                    <li key={marker.label}>
                      {marker.timestamp} — {marker.label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="card">
            <h2>Production Pipeline</h2>
            <div className="timeline-grid">
              <div className="timeline-block">
                <h4>Pre-production</h4>
                <p>{blueprint.production.timelineDays.preProduction} day</p>
              </div>
              <div className="timeline-block">
                <h4>Production</h4>
                <p>{blueprint.production.timelineDays.production} days</p>
              </div>
              <div className="timeline-block">
                <h4>Post</h4>
                <p>{blueprint.production.timelineDays.postProduction} day</p>
              </div>
            </div>
            <h3>Task Board</h3>
            <div className="grid two">
              {blueprint.production.checklist.map((task) => (
                <div key={task.id} className="checklist-item">
                  <input type="checkbox" />
                  <div>
                    <strong>{task.title}</strong>
                    <p>{task.description}</p>
                    <p className="field-note">
                      {task.phase} · Owner: {task.owner} · Due +{task.dueAfterHours}h
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <h3>Assets Needed</h3>
            <ul>
              {blueprint.production.assetRequests.map((asset) => (
                <li key={asset.label}>
                  <strong>{asset.label}:</strong> {asset.notes}
                </li>
              ))}
            </ul>
          </section>

          <section className="card">
            <h2>Upload-Ready Package</h2>
            <div className="metadata-grid">
              <div className="metadata-entry">
                <h4>Optimized Title</h4>
                <p>{blueprint.upload.optimizedTitle}</p>
              </div>
              <div className="metadata-entry">
                <h4>Optimized Description</h4>
                <p style={{ whiteSpace: "pre-line" }}>
                  {blueprint.upload.optimizedDescription}
                </p>
              </div>
              <div className="metadata-entry">
                <h4>Tags</h4>
                <div className="tag-row">
                  {blueprint.upload.uploadTags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="metadata-entry">
                <h4>Thumbnail Concept</h4>
                <p>{blueprint.upload.thumbnailConcept}</p>
              </div>
              <div className="metadata-entry">
                <h4>End Screen</h4>
                <ul>
                  {blueprint.upload.endScreenIdeas.map((idea) => (
                    <li key={idea}>{idea}</li>
                  ))}
                </ul>
              </div>
              <div className="metadata-entry">
                <h4>Playlist Targets</h4>
                <ul>
                  {blueprint.upload.playlistTargets.map((target) => (
                    <li key={target}>{target}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="card">
            <h2>Publishing & Amplification</h2>
            <div className="grid two">
              <div>
                <h3>Best Launch Windows</h3>
                <ul>
                  {blueprint.publishing.bestPublishWindows.map((window) => (
                    <li key={window}>{window}</li>
                  ))}
                </ul>
                <h3>Community Prompts</h3>
                <ul>
                  {blueprint.publishing.communityPrompts.map((prompt) => (
                    <li key={prompt}>{prompt}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Cross Promotion</h3>
                <ul>
                  {blueprint.publishing.crossPromotion.map((idea) => (
                    <li key={idea}>{idea}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}

function formatBlueprintText(blueprint: VideoBlueprint): string {
  const scriptSections = blueprint.script
    .map(
      (section, index) =>
        `Section ${index + 1}: ${section.title}\n` +
        `${section.voiceover}\n\nVisual Prompts:\n- ${section.visualPrompts.join(
          "\n- "
        )}\nEngagement: ${section.engagementHook}\n`
    )
    .join("\n");

  return [
    `YouTube Blueprint — ${blueprint.topic}`,
    "",
    `Audience: ${blueprint.targetAudience}`,
    `Tone: ${blueprint.tone}`,
    `Length: ${blueprint.videoLengthMinutes} minutes`,
    `Narrative Angle: ${blueprint.narrativeAngle}`,
    "",
    "Niche Positioning:",
    blueprint.nicheAnalysis.positioningStatement,
    "",
    "Trend Signals:",
    ...blueprint.nicheAnalysis.trendSignals.map(
      (signal) => `- ${signal.headline}: ${signal.rationale}`
    ),
    "",
    "Outline:",
    ...blueprint.outline.map(
      (section) =>
        `- ${section.title} (${section.estimatedDuration} min): ${section.purpose}`
    ),
    "",
    "Script:",
    scriptSections,
    "",
    "SEO Title:",
    blueprint.seo.videoTitle,
    "",
    "SEO Description:",
    blueprint.seo.description,
    "",
    "Tags:",
    blueprint.seo.keywordTags.join(", "),
    "",
    "Production Checklist:",
    ...blueprint.production.checklist.map(
      (task) => `- [ ] ${task.title} (${task.phase}, owner ${task.owner})`
    ),
    "",
    "Upload Package:",
    `Title: ${blueprint.upload.optimizedTitle}`,
    `Thumbnail Concept: ${blueprint.upload.thumbnailConcept}`,
    `Call To Action: ${blueprint.callToAction}`,
    "",
    "Publishing Plan:",
    ...blueprint.publishing.bestPublishWindows.map(
      (window) => `- ${window}`
    ),
    "",
    "Community Prompts:",
    ...blueprint.publishing.communityPrompts.map((prompt) => `- ${prompt}`),
    "",
    "Cross Promotion:",
    ...blueprint.publishing.crossPromotion.map((idea) => `- ${idea}`)
  ].join("\n");
}
