"use client";
import React from "react";

export function parseInlineMarkdown(text, isUser = false) {
  if (!text) return null;

  // Regex matching inline tokens:
  // 1: Bold+Italic (*** or ___)
  // 2: Bold (** or __)
  // 3: Italic (* or _)
  // 4: Strikethrough (~~)
  // 5: Inline Code (`)
  // 6: Link ([text](url))
  const tokenRegex = /(?:\*\*\*([^*]+)\*\*\*|___([^_]+)___|\*\*([^*]+)\*\*|__([^_]+)__|(?<!\*)\*([^*]+)\*(?!\*)|(?<!_)_([^_]+)_(?!_)|~~([^~]+)~~|`([^`]+)`|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\))/g;

  const elements = [];
  let lastIndex = 0;
  let match;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push(text.slice(lastIndex, match.index));
    }

    if (match[1] || match[2]) {
      // Bold + Italic
      elements.push(
        <strong key={match.index} className="font-black italic">
          {match[1] || match[2]}
        </strong>
      );
    } else if (match[3] || match[4]) {
      // Bold
      elements.push(
        <strong key={match.index} className={isUser ? "font-black" : "font-extrabold text-[#1a1a1a]"}>
          {match[3] || match[4]}
        </strong>
      );
    } else if (match[5] || match[6]) {
      // Italic
      elements.push(
        <em key={match.index} className="italic">
          {match[5] || match[6]}
        </em>
      );
    } else if (match[7]) {
      // Strikethrough
      elements.push(
        <del key={match.index} className="line-through opacity-70">
          {match[7]}
        </del>
      );
    } else if (match[8]) {
      // Inline Code
      elements.push(
        <code
          key={match.index}
          className={`px-1.5 py-0.5 font-mono text-[11px] rounded border ${
            isUser
              ? "bg-black/20 text-white border-white/20"
              : "bg-[#FDF9F0] text-[#1a1a1a] border-[#1a1a1a]/20"
          }`}
        >
          {match[8]}
        </code>
      );
    } else if (match[9] && match[10]) {
      // Link
      elements.push(
        <a
          key={match.index}
          href={match[10]}
          target="_blank"
          rel="noopener noreferrer"
          className={`underline font-bold transition-opacity hover:opacity-80 ${
            isUser ? "text-white" : "text-blue-600 hover:text-blue-800"
          }`}
        >
          {match[9]}
        </a>
      );
    }

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    elements.push(text.slice(lastIndex));
  }

  return elements.length > 0 ? elements : text;
}

export default function MarkdownRenderer({ content, isUser = false, className = "" }) {
  if (!content) return null;

  const lines = content.split("\n");
  const nodes = [];

  let inCodeBlock = false;
  let codeBlockLang = "";
  let codeBlockLines = [];

  let inTable = false;
  let tableHeader = [];
  let tableRows = [];

  let currentList = null;

  const flushList = () => {
    if (currentList) {
      if (currentList.type === "ul") {
        nodes.push(
          <ul
            key={`ul-${nodes.length}`}
            className={`list-disc pl-5 my-2 space-y-1 ${
              isUser ? "text-white" : "text-[#1a1a1a]"
            }`}
          >
            {currentList.items.map((item, idx) => (
              <li key={idx} className="leading-relaxed text-xs sm:text-sm">
                {item}
              </li>
            ))}
          </ul>
        );
      } else if (currentList.type === "ol") {
        nodes.push(
          <ol
            key={`ol-${nodes.length}`}
            className={`list-decimal pl-5 my-2 space-y-1 ${
              isUser ? "text-white" : "text-[#1a1a1a]"
            }`}
          >
            {currentList.items.map((item, idx) => (
              <li key={idx} className="leading-relaxed text-xs sm:text-sm">
                {item}
              </li>
            ))}
          </ol>
        );
      } else if (currentList.type === "task") {
        nodes.push(
          <div key={`task-${nodes.length}`} className="my-2 space-y-1.5 pl-1">
            {currentList.items.map((it, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm">
                <input
                  type="checkbox"
                  readOnly
                  checked={it.checked}
                  className="mt-1 accent-[#FF4D00] pointer-events-none rounded border-[#1a1a1a]"
                />
                <span className={it.checked ? "line-through opacity-75" : ""}>
                  {it.text}
                </span>
              </div>
            ))}
          </div>
        );
      }
      currentList = null;
    }
  };

  const flushTable = () => {
    if (inTable) {
      nodes.push(
        <div key={`table-${nodes.length}`} className="overflow-x-auto my-3 border-2 border-[#1a1a1a] shadow-neo-sm">
          <table className="w-full border-collapse text-left text-xs sm:text-sm">
            {tableHeader.length > 0 && (
              <thead>
                <tr className="bg-[#1a1a1a] text-white font-mono uppercase text-[11px]">
                  {tableHeader.map((th, i) => (
                    <th key={i} className="p-2.5 border-b-2 border-[#1a1a1a] font-bold">
                      {parseInlineMarkdown(th, isUser)}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody className="divide-y divide-[#1a1a1a]/20">
              {tableRows.map((row, rIdx) => (
                <tr key={rIdx} className={rIdx % 2 === 0 ? "bg-white" : "bg-[#FDF9F0]"}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="p-2.5 text-gray-800 font-medium">
                      {parseInlineMarkdown(cell, isUser)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      inTable = false;
      tableHeader = [];
      tableRows = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // 1. Code Block Delimiter
    if (line.startsWith("```")) {
      flushList();
      flushTable();
      if (inCodeBlock) {
        // Close code block
        nodes.push(
          <div key={`code-${nodes.length}`} className="my-2.5 bg-[#1a1a1a] text-white border-2 border-[#1a1a1a] shadow-neo-sm overflow-hidden">
            {codeBlockLang && (
              <div className="bg-[#2a2a2a] px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-[#BFF000] border-b border-[#333] flex justify-between items-center">
                <span>{codeBlockLang}</span>
              </div>
            )}
            <pre className="p-3 text-[11px] sm:text-xs font-mono overflow-x-auto text-emerald-300 leading-relaxed">
              <code>{codeBlockLines.join("\n")}</code>
            </pre>
          </div>
        );
        inCodeBlock = false;
        codeBlockLang = "";
        codeBlockLines = [];
      } else {
        // Open code block
        inCodeBlock = true;
        codeBlockLang = line.slice(3).trim();
        codeBlockLines = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockLines.push(rawLine);
      continue;
    }

    // Empty Line
    if (!line) {
      flushList();
      flushTable();
      continue;
    }

    // 2. Table Row Detection
    if (line.startsWith("|") && line.endsWith("|")) {
      flushList();
      const cells = line
        .slice(1, -1)
        .split("|")
        .map((c) => c.trim());

      // Check if it's the table separator row: |---|---|
      const isSeparator = cells.every((c) => /^:?-+:?$/.test(c));

      if (isSeparator) {
        // Next rows will be body rows
        inTable = true;
      } else if (!inTable && tableHeader.length === 0) {
        tableHeader = cells;
      } else {
        inTable = true;
        tableRows.push(cells);
      }
      continue;
    } else {
      flushTable();
    }

    // 3. Horizontal Rule: ---, ***, ___
    if (/^(\-{3,}|\*{3,}|_{3,})$/.test(line)) {
      flushList();
      nodes.push(
        <hr key={`hr-${nodes.length}`} className="my-3 border-t-2 border-[#1a1a1a]/30" />
      );
      continue;
    }

    // 4. Headings: #, ##, ###, ####, #####, ######
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushList();
      const level = headingMatch[1].length;
      const headingContent = parseInlineMarkdown(headingMatch[2], isUser);

      if (level === 1) {
        nodes.push(
          <h1 key={`h1-${nodes.length}`} className="font-syne font-black text-base sm:text-lg md:text-xl uppercase border-b-2 border-[#1a1a1a] pb-1.5 mt-3.5 mb-2 leading-tight">
            {headingContent}
          </h1>
        );
      } else if (level === 2) {
        nodes.push(
          <h2 key={`h2-${nodes.length}`} className="font-syne font-black text-sm sm:text-base uppercase border-b border-[#1a1a1a]/25 pb-1 mt-3 mb-1.5 leading-snug">
            {headingContent}
          </h2>
        );
      } else if (level === 3) {
        nodes.push(
          <h3 key={`h3-${nodes.length}`} className="font-syne font-black text-xs sm:text-sm uppercase mt-2.5 mb-1 leading-snug">
            {headingContent}
          </h3>
        );
      } else {
        nodes.push(
          <h4 key={`h4-${nodes.length}`} className="font-syne font-extrabold text-xs uppercase text-gray-900 mt-2 mb-1 leading-snug">
            {headingContent}
          </h4>
        );
      }
      continue;
    }

    // 5. Task List: - [ ] or - [x]
    const taskMatch = line.match(/^([\*\-\+•])\s+\[([ xX])\]\s+(.*)$/);
    if (taskMatch) {
      if (!currentList || currentList.type !== "task") {
        flushList();
        currentList = { type: "task", items: [] };
      }
      currentList.items.push({
        checked: taskMatch[2].toLowerCase() === "x",
        text: parseInlineMarkdown(taskMatch[3], isUser),
      });
      continue;
    }

    // 6. Bullet List: -, *, +, •
    const bulletMatch = line.match(/^([\*\-\+•])\s+(.*)$/);
    if (bulletMatch) {
      if (!currentList || currentList.type !== "ul") {
        flushList();
        currentList = { type: "ul", items: [] };
      }
      currentList.items.push(parseInlineMarkdown(bulletMatch[2], isUser));
      continue;
    }

    // 7. Numbered List: 1., 1)
    const numMatch = line.match(/^(\d+)[\.\)]\s+(.*)$/);
    if (numMatch) {
      if (!currentList || currentList.type !== "ol") {
        flushList();
        currentList = { type: "ol", items: [] };
      }
      currentList.items.push(parseInlineMarkdown(numMatch[2], isUser));
      continue;
    }

    // 8. Blockquote: >
    const quoteMatch = line.match(/^>\s+(.*)$/);
    if (quoteMatch) {
      flushList();
      nodes.push(
        <blockquote
          key={`quote-${nodes.length}`}
          className={`border-l-3 border-[#FF4D00] pl-3 py-1 my-2 italic text-xs sm:text-sm leading-relaxed ${
            isUser ? "bg-black/15 text-white" : "bg-orange-50/50 text-gray-800"
          }`}
        >
          {parseInlineMarkdown(quoteMatch[1], isUser)}
        </blockquote>
      );
      continue;
    }

    // 9. Standard Paragraph
    flushList();
    nodes.push(
      <p key={`p-${nodes.length}`} className="my-1 text-xs sm:text-sm leading-relaxed">
        {parseInlineMarkdown(line, isUser)}
      </p>
    );
  }

  // Final flush
  flushList();
  flushTable();
  if (inCodeBlock && codeBlockLines.length > 0) {
    nodes.push(
      <div key={`code-${nodes.length}`} className="my-2.5 bg-[#1a1a1a] text-white border-2 border-[#1a1a1a] shadow-neo-sm overflow-hidden">
        <pre className="p-3 text-[11px] sm:text-xs font-mono overflow-x-auto text-emerald-300">
          <code>{codeBlockLines.join("\n")}</code>
        </pre>
      </div>
    );
  }

  return <div className={`space-y-1 ${className}`}>{nodes}</div>;
}
