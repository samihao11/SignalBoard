import { useState, useEffect, useRef } from "react";
import OpenAI from "openai";
import "./DraftEmailModal.css";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const SYSTEM_PROMPT = `You are an AE at Decagon writing a short cold email to a healthcare payer CX leader. Decagon builds AI agents that handle member support (chat, voice, email, SMS), resolving 60-80% of tickets autonomously. It helps health plans cut call volume, protect Star Ratings, and absorb seasonal spikes without adding headcount. HIPAA-ready.

FORMAT:
- 75-100 words. Plain text. No HTML, bold, bullets, or em dashes.
- "Subject: ..." (under 6 words), blank line, body.
- Max 15 words per sentence.
- 3-4 paragraphs, 1-2 sentences each. Blank lines between.
- CTA on its own line. Keep it simple and human like "Open to a quick 10 min chat next week?" or "Free for a quick call this week?". Never say "compare notes", "explore synergies", or anything that sounds like a sales playbook.
- Sign off: "Best,\\n[YOUR NAME]"

HOW TO WRITE THIS:
- Casually reference a signal ("saw your recent post about...", "noticed [company] has been..."). Don't formally declare what they did.
- Ask a genuine question that ties the signal to Decagon's world ("have you explored AI voice agents at [company]?", "is your team looking at ways to handle volume during OEP?"). Questions > statements.
- Briefly mention what you do at Decagon in 1 sentence. Don't pitch. Just context.
- Only reference contact details that connect to Decagon. Skip anything irrelevant (awards, achievements, generic career praise).
- Sound like a real person who saw something interesting and thinks there might be a fit. Curious, not pushy.
- No filler. No "I hope this finds you well", "excited to", "I'd love to".

GOOD EXAMPLE:
Hi Allison,

Saw you just started at UnitedHealth. Congrats.

I work with health plans on automating repeat member calls. Especially the ones that drag down experience scores and Stars. Have you started looking at the support side yet?

Open to a quick 10 min chat next week?

Best,
[YOUR NAME]

BAD EXAMPLE (do NOT write like this):
Hi Tanya,

You have been posting about AI improving customer experience. That usually points to a practical question. Where can automation reduce volume without hurting member experience?`;

export default function DraftEmailModal({ contact, company, cms, signals, onClose }) {
  const [emailBody, setEmailBody] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [selectedSignals, setSelectedSignals] = useState({
    disenrolled: false,
    newHire: false,
    aiPosts: false,
  });
  const abortRef = useRef(null);

  const hasNewHire = !!contact.startedRoleInPastYear;
  const hasAiPosts = !!contact.aiPostSummary;

  useEffect(() => {
    generateEmail();
    return () => { if (abortRef.current) abortRef.current.abort(); };
  }, [selectedSignals.disenrolled, selectedSignals.newHire, selectedSignals.aiPosts]);

  async function generateEmail() {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);

    const years = [2024, 2025, 2026];
    const avg = years.reduce((s, y) => s + cms[y].pctMembershipLostBadCX, 0) / years.length;

    let signalContext = "";
    if (selectedSignals.disenrolled) {
      signalContext += `\n- ${company} is losing ${avg.toFixed(2)}% of members due to bad CX (3-year avg). Use this exact stat naturally in the email.`;
    }
    if (selectedSignals.newHire && hasNewHire) {
      signalContext += `\n- ${contact.fullName} recently moved into a leadership role at ${company} (new to the role within the past year)`;
    }
    if (selectedSignals.aiPosts && hasAiPosts) {
      signalContext += `\n- ${contact.fullName} posted about AI/automation on LinkedIn. Here is the post summary: "${contact.aiPostSummary}". Reference a specific post topic casually, e.g. "saw your post about [specific topic from summary]..."`;
    }

    const userPrompt = `Write a personalized outbound email to:
- Name: ${contact.fullName}
- Title: ${contact.title}
- Company: ${company}
- Profile Summary: ${contact.profileSummary || "N/A"}

Relevant signals to reference:${signalContext || "\n- No specific signals selected"}`;

    try {
      const response = await openai.chat.completions.create(
        {
          model: "gpt-5.4",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.8,
        },
        { signal: controller.signal }
      );

      const text = response.choices[0].message.content.trim();
      const subjectMatch = text.match(/^Subject:\s*(.+)/i);
      if (subjectMatch) {
        setSubject(subjectMatch[1].trim());
        setEmailBody(text.replace(/^Subject:\s*.+\n\n?/, "").trim());
      } else {
        setSubject("");
        setEmailBody(text);
      }
    } catch (err) {
      if (controller.signal.aborted) return;
      setEmailBody("Error generating email. Please check your API key and try again.");
    } finally {
      if (controller.signal.aborted) return;
      setLoading(false);
    }
  }

  function handleSignalToggle(key) {
    setSelectedSignals((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function handleCopy() {
    const fullText = subject ? `Subject: ${subject}\n\n${emailBody}` : emailBody;
    await navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="draft-modal-overlay" onClick={onClose}>
      <div className="draft-modal" onClick={(e) => e.stopPropagation()}>
        <button className="draft-modal-close" onClick={onClose}>&times;</button>

        <div className="draft-email-header">
          <div className="draft-email-field">
            <span className="draft-email-field-label">To:</span>
            <span className="draft-email-field-value">{contact.email || "No email available"}</span>
          </div>
          <div className="draft-email-field">
            <span className="draft-email-field-label">Subject:</span>
            <span className="draft-email-field-value">{loading ? "..." : subject}</span>
          </div>
        </div>

        {loading ? (
          <div className="draft-loading">
            <div className="draft-spinner" />
            Generating personalized email...
          </div>
        ) : (
          <textarea
            className="draft-email-body"
            value={emailBody}
            onChange={(e) => setEmailBody(e.target.value)}
          />
        )}

        <div className="draft-signal-checkboxes">
          <label>
            <input
              type="checkbox"
              checked={selectedSignals.disenrolled}
              onChange={() => handleSignalToggle("disenrolled")}
            />
            % Disenrolled due to CX
          </label>
          {hasNewHire && (
            <label>
              <input
                type="checkbox"
                checked={selectedSignals.newHire}
                onChange={() => handleSignalToggle("newHire")}
              />
              Leadership Change
            </label>
          )}
          {hasAiPosts && (
            <label>
              <input
                type="checkbox"
                checked={selectedSignals.aiPosts}
                onChange={() => handleSignalToggle("aiPosts")}
              />
              AI/Automation Posts
            </label>
          )}
        </div>

        {copied ? (
          <button className="draft-copy-btn-copied">Email copy copied to clipboard!</button>
        ) : (
          <button className="draft-copy-btn" onClick={handleCopy} disabled={loading}>
            Copy Email
          </button>
        )}
      </div>
    </div>
  );
}
