---
layout: default
title: Theory
head: |
  <script src="https://unpkg.com/react@17/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js" crossorigin></script>
  <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
  <style>
    :root {
      /* Core colors */
      --primary: #1a56db;
      --primary-light: #2563eb;
      --primary-dark: #1e40af;
      --secondary: #4f46e5;
      --accent: #7c3aed;
      
      /* Text colors */
      --text-dark: #111827;
      --text-body: #374151;
      --text-light: #6b7280;
      
      /* Background colors */
      --bg-page: #f3f4f6;
      --bg-card: #ffffff;
      --bg-hover: #f9fafb;
      
      /* Border colors */
      --border-light: #e5e7eb;
      --border-medium: #d1d5db;
      
      /* Semantic colors */
      --success: #059669;
      --info: #0284c7;
      --warning: #d97706;
      
      /* Table colors */
      --table-header: #f8fafc;
      --table-border: #e2e8f0;
      --table-row-hover: #f1f5f9;

      /* Highlight colors */
      --highlight-pre: #059669;
      --highlight-post: #7c3aed;
    }

    /* Mobile-first base styles */
    .theory-container {
      padding: 0.25rem;
      width: 100%;
      margin: 0 auto;
      background: var(--bg-page);
      box-sizing: border-box;
    }

    .theory-card {
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: 8px;
      padding: 0.75rem;
      margin-bottom: 0.75rem;
      width: 100%;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      box-sizing: border-box;
    }

    .theory-title,
    .theory-card h3,
    .tldr-section h3 {
      font-size: 1.1rem;
      line-height: 1.2;
      word-break: break-word;
    }

    .theory-card h4 {
      font-size: 1rem;
      margin-bottom: 0.5rem;
    }

    .tldr-section h3 {
      font-size: 1rem;
    }

    .theory-header {
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .view-toggle {
      min-width: 0;
      overflow-x: auto;
      flex-shrink: 1;
    }

    .toggle-switch {
      min-width: 50px;
      max-width: 60px;
    }

    .quote-box {
      padding: 0.5rem;
      margin: 1rem 0;
      font-size: 0.95rem;
      width: 100%;
      box-sizing: border-box;
    }

    .theory-card p {
      color: var(--text-body);
      margin-bottom: 1.5rem;
      line-height: 1.5;
      font-size: 0.95rem;
    }

    .explore-btn {
      background: var(--primary);
      color: white;
      border: none;
      padding: 0.75rem 1.25rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.95rem;
      font-weight: 500;
      transition: all 0.2s ease;
      width: 100%;
      max-width: 200px;
    }

    .explore-btn:hover {
      background: var(--primary-dark);
      transform: translateY(-1px);
      box-shadow: 0 4px 6px rgba(26, 86, 219, 0.1);
    }

    .back-btn {
      background: var(--text-light);
      color: white;
      border: none;
      padding: 0.75rem 1.25rem;
      border-radius: 6px;
      cursor: pointer;
      margin-bottom: 1.5rem;
      font-size: 0.95rem;
      font-weight: 500;
      transition: all 0.2s ease;
      width: 100%;
      max-width: 200px;
    }

    .back-btn:hover {
      background: var(--text-body);
      transform: translateY(-1px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    #theory-root {
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: 8px;
      padding: 1.5rem;
      width: 100%;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    /* Responsive styles for larger screens */
    @media (min-width: 640px) {
      .theory-container {
        padding: 1rem;
      }
      .theory-card {
        padding: 1.5rem;
        margin-bottom: 1.5rem;
      }
      .theory-title,
      .theory-card h3,
      .tldr-section h3 {
        font-size: 1.5rem;
      }
      .theory-card h4 {
        font-size: 1.2rem;
      }
      .tldr-section h3 {
        font-size: 1.2rem;
      }
      .quote-box {
        padding: 1.5rem;
        margin: 2rem 0;
        font-size: 1.1rem;
      }
    }
    @media (min-width: 1024px) {
      .theory-container {
        padding: 2rem;
        max-width: 1200px;
      }
      .theory-card {
        max-width: 800px;
        margin-left: auto;
        margin-right: auto;
        padding: 2rem;
      }
    }

    /* Table responsive styles */
    .work-section table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      margin: 1.5rem 0;
      border: 1px solid var(--table-border);
      border-radius: 8px;
      overflow-x: auto;
      display: block;
    }

    .work-section th,
    .work-section td {
      padding: 0.75rem;
      min-width: 120px;
    }

    @media (min-width: 640px) {
      .work-section table {
        display: table;
      }

      .work-section th,
      .work-section td {
        padding: 1rem;
      }
    }

    /* Dual nature grid responsive styles */
    .dual-nature-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
      margin: 1rem 0;
    }

    @media (min-width: 640px) {
      .dual-nature-grid {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin: 1.5rem 0;
      }
    }

    /* Quote box responsive styles */
    .quote-box {
      padding: 1rem;
      margin: 1.5rem 0;
    }

    @media (min-width: 640px) {
      .quote-box {
        padding: 1.5rem;
        margin: 2rem 0;
      }
    }

    /* TL;DR section responsive styles */
    .tldr-section {
      padding: 1.5rem;
      margin: 1.5rem 0;
    }

    @media (min-width: 640px) {
      .tldr-section {
        padding: 2rem;
        margin: 2rem 0;
      }
    }

    .theory-container {
      padding: 4rem 2rem;
      max-width: 1200px;
      margin: 0 auto;
      background: var(--bg-page);
    }

    .theory-card {
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: 8px;
      padding: 2rem;
      margin-bottom: 2rem;
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .theory-card h3 {
      color: var(--primary);
      margin-bottom: 1rem;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .theory-card h4 {
      color: var(--text-body);
      margin-bottom: 1.5rem;
      font-size: 1.2rem;
      font-weight: 500;
    }

    .theory-card p {
      color: var(--text-body);
      margin-bottom: 2rem;
      line-height: 1.6;
    }

    .explore-btn {
      background: var(--primary);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .explore-btn:hover {
      background: var(--primary-dark);
      transform: translateY(-1px);
      box-shadow: 0 4px 6px rgba(26, 86, 219, 0.1);
    }

    .back-btn {
      background: var(--text-light);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      cursor: pointer;
      margin-bottom: 2rem;
      font-size: 1rem;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .back-btn:hover {
      background: var(--text-body);
      transform: translateY(-1px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    #theory-root {
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: 8px;
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .theory-content {
      color: var(--text-body);
    }

    .theory-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border-light);
    }

    .theory-title {
      color: var(--text-dark);
      font-size: 1.8rem;
      font-weight: 600;
    }

    .view-toggle {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .toggle-label {
      color: var(--text-light);
      font-size: 0.9rem;
      transition: color 0.2s ease;
    }

    .toggle-label.active {
      color: var(--primary);
      font-weight: 500;
    }

    .toggle-switch {
      width: 50px;
      height: 24px;
      background: var(--border-light);
      border-radius: 12px;
      position: relative;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .toggle-switch:hover {
      background: var(--border-medium);
    }

    .toggle-slider {
      width: 20px;
      height: 20px;
      background: white;
      border-radius: 50%;
      position: absolute;
      top: 2px;
      transition: all 0.2s ease;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    .toggle-slider.concept {
      left: 2px;
      background: var(--primary);
    }

    .toggle-slider.work {
      left: 28px;
      background: var(--secondary);
    }

    .concept-view,
    .work-view {
      color: var(--text-body);
    }

    .work-section {
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      transition: all 0.2s ease;
    }

    .work-section:hover {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      border-color: var(--border-medium);
    }

    .work-section h3 {
      color: var(--primary);
      margin-bottom: 1rem;
      font-size: 1.3rem;
      font-weight: 600;
    }

    .work-section p {
      color: var(--text-body);
      margin-bottom: 1rem;
      line-height: 1.6;
    }

    .work-section ul,
    .work-section ol {
      margin-left: 1.5rem;
      margin-bottom: 1rem;
    }

    .work-section li {
      color: var(--text-body);
      margin-bottom: 0.75rem;
      line-height: 1.6;
    }

    .work-section strong {
      color: var(--highlight);
      font-weight: 600;
    }

    /* Table Styles */
    .work-section table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      margin: 1.5rem 0;
      border: 1px solid var(--table-border);
      border-radius: 8px;
      overflow: hidden;
    }

    .work-section th {
      background: var(--table-header);
      color: var(--text-dark);
      font-weight: 600;
      text-align: left;
      padding: 1rem;
      border-bottom: 2px solid var(--table-border);
    }

    .work-section td {
      padding: 1rem;
      border-bottom: 1px solid var(--table-border);
      color: var(--text-body);
      line-height: 1.5;
    }

    .work-section tr:last-child td {
      border-bottom: none;
    }

    .work-section tr:hover td {
      background: var(--table-row-hover);
    }

    .quote-box {
      background: #f0f9ff;
      border: 1px solid #bae6fd;
      border-radius: 8px;
      padding: 1.5rem;
      margin: 2rem 0;
    }

    .quote-text {
      color: var(--primary-dark);
      font-style: italic;
      line-height: 1.6;
      font-size: 1.1rem;
    }

    .dual-nature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin: 1.5rem 0;
    }

    .nature-box {
      padding: 1.5rem;
      border-radius: 8px;
      background: var(--bg-card);
      border: 1px solid var(--border-light);
    }

    .nature-box.pre-time {
      background: #ecfdf5;
      border-color: #a7f3d0;
    }

    .nature-box.pre-time h4 {
      color: var(--highlight-pre);
    }

    .nature-box.pre-time li:before {
      color: var(--highlight-pre);
    }

    .nature-box.post-time {
      background: #f5f3ff;
      border-color: #ddd6fe;
    }

    .nature-box.post-time h4 {
      color: var(--highlight-post);
    }

    .nature-box.post-time li:before {
      color: var(--highlight-post);
    }

    .nature-box h4 {
      color: var(--primary);
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .nature-box ul {
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .nature-box li {
      color: var(--text-body);
      margin-bottom: 0.5rem;
      padding-left: 1.5rem;
      position: relative;
    }

    .nature-box li:before {
      content: "•";
      color: var(--highlight);
      position: absolute;
      left: 0;
    }

    .theory-footer {
      margin-top: 3rem;
      text-align: right;
      color: var(--text-light);
      font-size: 0.9rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border-light);
    }

    /* TL;DR Section Styles */
    .tldr-section {
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: 8px;
      padding: 2rem;
      margin: 2rem 0;
    }

    .tldr-section h3 {
      color: var(--primary);
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid var(--border-light);
    }

    .tldr-section h4 {
      color: var(--text-dark);
      font-size: 1.2rem;
      font-weight: 600;
      margin: 1.5rem 0 1rem;
    }

    .tldr-section p {
      color: var(--text-body);
      line-height: 1.6;
      margin-bottom: 1rem;
    }

    .tldr-section ul {
      margin: 1rem 0;
      padding-left: 1.5rem;
    }

    .tldr-section li {
      color: var(--text-body);
      margin-bottom: 0.75rem;
      line-height: 1.6;
    }

    .tldr-section .key-point {
      background: #f8fafc;
      border-left: 4px solid var(--primary);
      padding: 1rem 1.5rem;
      margin: 1.5rem 0;
    }

    .tldr-section .key-point p {
      margin: 0;
      color: var(--text-dark);
      font-weight: 500;
    }

    .tldr-section .implication {
      background: #f0f9ff;
      border-left: 4px solid var(--info);
      padding: 1rem 1.5rem;
      margin: 1.5rem 0;
    }

    .tldr-section .implication p {
      margin: 0;
      color: var(--text-dark);
    }

    .tldr-section .note {
      font-size: 0.9rem;
      color: var(--text-light);
      font-style: italic;
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border-light);
    }
  </style>
scripts: |
  <script src="assets/js/dist/theory.bundle.js"></script>
---

<div class="theory-container">
  <!-- Single Card Section -->
  <section class="theory-cards">
    <div class="container">
      <div class="card-grid">
        <!-- Physics Card -->
        <div class="theory-card" data-topic="black-holes">
          <div class="card-content">
            <h3>Physics & Cosmology</h3>
            <h4>The Quiet Center: Reframing Black Holes</h4>
            <p>A new perspective on black holes as pre-time structures that create the conditions for time and space.</p>
            <button class="explore-btn" type="button">Explore Theory →</button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Theory Content (Hidden by default) -->
  <section id="theory-content" class="theory-content-section" style="display: none;">
    <div class="container">
      <button class="back-btn" type="button">← Back to Topics</button>
      <div id="theory-root"></div>
    </div>
  </section>
</div>