// Remove the import statements since we're using global React
// import React, { useState, useEffect } from 'react';
// import ReactDOM from 'react-dom';

console.log('Theory.js loaded');

// Simple toggle component for the black holes theory
function ToggleView() {
  const [viewMode, setViewMode] = React.useState('concept');

  return (
    <div className="theory-content">
      <div className="theory-header">
        <h2 className="theory-title">The Quiet Center: Reframing Black Holes</h2>
        <div className="view-toggle">
          <span className={`toggle-label ${viewMode === 'concept' ? 'active' : ''}`}>TL;DR</span>
          <div 
            className="toggle-switch" 
            onClick={() => setViewMode(viewMode === 'concept' ? 'work' : 'concept')}
          >
            <div className={`toggle-slider ${viewMode}`} />
          </div>
          <span className={`toggle-label ${viewMode === 'work' ? 'active' : ''}`}>Show Work</span>
        </div>
      </div>

      {viewMode === 'concept' ? (
        <div className="concept-view">
          <div className="tldr-section">
            <h3>TL;DR: Black Holes as Pre-Time Structures</h3>
            
            <div className="key-point">
              <p>Black holes are not just cosmic objects but fundamental structures that create the conditions for time and space to exist.</p>
            </div>

            <h4>Core Concepts</h4>
            <ul>
              <li>Black holes exist in a <strong>pre-time state</strong> - they are not bound by our conventional understanding of time</li>
              <li>They create the conditions for time and space to emerge in their surrounding regions</li>
              <li>This creates a fundamental duality in our universe: pre-time and post-time regions</li>
            </ul>

            <div className="implication">
              <p>This perspective suggests that black holes are not endpoints of space-time, but rather the source of space-time itself.</p>
            </div>

            <h4>Key Implications</h4>
            <ul>
              <li>Time is not a fundamental property of the universe, but emerges from black hole structures</li>
              <li>Our understanding of causality might need to be revised</li>
              <li>Black holes might be the source of space-time, not its end</li>
            </ul>

            <div className="note">
              <p>"Where interaction ceases — whether it never began or has completely ended — time is still. The shadow we call a black hole is not infinite mass, but the absence of becoming."</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="work-view">
          <div className="work-section">
            <h3>Pattern Recognition</h3>
            <ul>
              <li>
                <strong>Cross-domain insight:</strong> In materials science, structures like vantablack achieve near-perfect light absorption through structural properties, not density
              </li>
              <li>
                <strong>Vivolere principle application:</strong> If time emerges from interaction (core Vivolere premise), then absence of interaction would mean absence of time
              </li>
              <li>
                <strong>Logical reversal:</strong> Instead of black holes being "where everything ends up," what if they're "where nothing has yet begun"?
              </li>
            </ul>
          </div>

          <div className="work-section">
            <h3>Alternative Model Development</h3>
            <p>Reframing black holes through the interaction lens:</p>
            <table>
              <thead>
                <tr>
                  <th>Standard Model</th>
                  <th>Vivolere Model</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Singularity of infinite density</td>
                  <td>Region of zero interaction probability</td>
                </tr>
                <tr>
                  <td>Gravitational pull from mass</td>
                  <td>Gradient in the interaction field</td>
                </tr>
                <tr>
                  <td>Event horizon as point of no return</td>
                  <td>Boundary between interaction and stasis</td>
                </tr>
                <tr>
                  <td>Hawking radiation as quantum tunneling</td>
                  <td>First shimmer of interaction at dormant boundary</td>
                </tr>
                <tr>
                  <td>Black holes as end products of stars</td>
                  <td>Primordial regions untouched by interaction</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="work-section">
            <h3>Testing Against Observations</h3>
            <ol>
              <li>
                <strong>Observable:</strong> Light cannot escape black holes<br/>
                <strong>Standard explanation:</strong> Gravitational pull is too strong<br/>
                <strong>Vivolere explanation:</strong> No interaction means no light propagation
              </li>
              <li>
                <strong>Observable:</strong> Event horizon appears as boundary<br/>
                <strong>Standard explanation:</strong> Escape velocity equals speed of light<br/>
                <strong>Vivolere explanation:</strong> Transition point where interaction probability drops below threshold for temporal emergence
              </li>
              <li>
                <strong>Observable:</strong> Black holes appear to have mass<br/>
                <strong>Standard explanation:</strong> They contain collapsed matter<br/>
                <strong>Vivolere explanation:</strong> The gradient in interaction field creates effects indistinguishable from mass
              </li>
            </ol>
          </div>

          <div className="work-section">
            <h3>The Dual Nature: Pre-Time or Post-Time</h3>
            <p>
              A critical insight in this framework is that black holes could represent either:
            </p>
            <div className="dual-nature-grid">
              <div className="nature-box pre-time">
                <h4>Pre-Time Regions</h4>
                <ul>
                  <li>Areas where interaction never began</li>
                  <li>Primordial voids untouched by the initial wavefront of interaction</li>
                  <li>Potential in a dormant state</li>
                  <li>Like unplanted seeds</li>
                </ul>
              </div>
              <div className="nature-box post-time">
                <h4>Post-Time Regions</h4>
                <ul>
                  <li>Areas where all possible interactions have ceased</li>
                  <li>Systems that have reached complete equilibrium</li>
                  <li>Exhausted possibility</li>
                  <li>Like a completely spent fuel source</li>
                </ul>
              </div>
            </div>
            <p>
              <strong>The key insight:</strong> These two fundamentally different states would appear identical to observers outside the event horizon. Both would manifest as regions of zero interaction, creating the same observational effects without requiring infinite density or mass.
            </p>
            <p>
              This is analogous to how materials like vantablack create the appearance of perfect blackness through structural properties rather than extreme density. The perfect absorption comes from the arrangement of carbon nanotubes, not from infinite density of material.
            </p>
          </div>

          <div className="work-section">
            <h3>Thought Experiment: The Vantablack Planet</h3>
            <p>
              Imagine a planet whose surface was composed of perfect light-absorbing material similar to vantablack. From an observational standpoint:
            </p>
            <ul>
              <li>No light would return from the planet's surface</li>
              <li>The planet would appear as a perfect black sphere</li>
              <li>The boundary of this sphere would function as an "event horizon" for light</li>
              <li>We could not distinguish this object from a black hole through direct observation</li>
            </ul>
            <p>
              This demonstrates how the same observational phenomenon (no light return) could be caused by different mechanisms - suggesting black holes could similarly achieve their effects through interaction properties rather than infinite density.
            </p>
          </div>

          <div className="work-section">
            <h3>Implications & Predictions</h3>
            <ul>
              <li>Information isn't truly lost but exists in either a pre-temporal or post-temporal state</li>
              <li>The universe contains both "unawakened" regions and regions that have returned to stasis</li>
              <li>Near-horizon environments should show gradients in temporal properties</li>
              <li>Hawking radiation should contain patterns reflecting boundary interactions</li>
              <li>Black hole mergers might represent either activation events or unification of exhausted regions</li>
              <li>Black holes shouldn't require infinite density to explain their observed properties</li>
            </ul>
          </div>
        </div>
      )}

      <div className="theory-footer">
        <p>Vivolere Theory - Dr. Andrew Makohon-George</p>
      </div>
    </div>
  );
}

// Initialize the React component when the page loads
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Content Loaded');
  
  // Handle explore button clicks
  const exploreBtn = document.querySelector('.explore-btn');
  if (exploreBtn) {
    console.log('Found explore button');
    exploreBtn.addEventListener('click', () => {
      console.log('Explore button clicked');
      // Hide cards section and show content section
      document.querySelector('.theory-cards').style.display = 'none';
      document.querySelector('#theory-content').style.display = 'block';
      
      // Render the React component
      const root = document.getElementById('theory-root');
      if (root) {
        console.log('Rendering React component');
        ReactDOM.render(<ToggleView />, root);
      } else {
        console.log('Could not find theory-root element');
      }
    });
  } else {
    console.log('Could not find explore button');
  }

  // Handle back button clicks
  const backBtn = document.querySelector('.back-btn');
  if (backBtn) {
    console.log('Found back button');
    backBtn.addEventListener('click', () => {
      console.log('Back button clicked');
      document.querySelector('.theory-cards').style.display = 'block';
      document.querySelector('#theory-content').style.display = 'none';
    });
  } else {
    console.log('Could not find back button');
  }
}); 