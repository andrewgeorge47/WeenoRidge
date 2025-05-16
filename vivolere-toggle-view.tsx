import React, { useState } from 'react';

const ToggleView = () => {
  const [viewMode, setViewMode] = useState('concept');

  return (
    <div className="mx-auto p-6 max-w-4xl bg-gray-50 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">The Quiet Center: Reframing Black Holes</h1>
        <div className="flex items-center space-x-4">
          <span className={`text-sm ${viewMode === 'concept' ? 'font-bold text-blue-600' : 'text-gray-500'}`}>Concept View</span>
          <div 
            className="relative w-14 h-7 bg-gray-200 rounded-full cursor-pointer transition-colors duration-300 ease-in-out hover:bg-gray-300"
            onClick={() => setViewMode(viewMode === 'concept' ? 'work' : 'concept')}
          >
            <div className={`absolute top-1 w-5 h-5 rounded-full transition-all duration-300 ease-in-out ${viewMode === 'concept' ? 'left-1 bg-blue-600' : 'left-8 bg-green-600'}`}></div>
          </div>
          <span className={`text-sm ${viewMode === 'work' ? 'font-bold text-green-600' : 'text-gray-500'}`}>Show Work</span>
        </div>
      </div>

      {viewMode === 'concept' ? (
        <div className="concept-view space-y-4">
          <p className="text-lg">
            In the Vivolere framework, black holes are regions of <strong>zero interaction</strong> that could be either <strong>pre-time or post-time</strong> — and would appear identical to observers.
          </p>
          
          <p>
            They are not singularities of infinite density, but <strong>interaction voids</strong> — similar to how vantablack absorbs light through structure rather than density.
          </p>
          
          <p>
            What appears as gravitational pull is actually a <strong>gradient in the interaction field</strong> — surrounding spacetime responding to perfect stillness.
          </p>
          
          <p>
            The crucial insight: a black hole could be either <strong>untouched potential</strong> (pre-time, where interaction never began) or <strong>exhausted possibility</strong> (post-time, where interaction has ceased) — we cannot observationally distinguish between them.
          </p>
          
          <p>
            The event horizon is a <strong>boundary of interaction possibility</strong>. Outside it, time flows through ongoing interactions. Inside, interaction probability drops to zero.
          </p>
          
          <p>
            Hawking radiation represents the <strong>fluctuations at this boundary</strong> — the shimmer between interactive and non-interactive states, regardless of whether the black hole is pre-time or post-time.
          </p>
          
          <p>
            This dual nature explains why black holes don't require infinite mass or density — their properties emerge from <strong>interaction structure rather than substance</strong>.
          </p>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="italic">
              "Where interaction ceases — whether it never began or has completely ended — time is still. The shadow we call a black hole is not infinite mass, but the absence of becoming."
            </p>
          </div>
        </div>
      ) : (
        <div className="work-view space-y-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="font-bold text-green-700 mb-2">Initial Questions</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>If black holes are singularities of infinite density, how does physical matter transition from finite to infinite density?</li>
              <li>Why does the fusion process of stars creating increasingly complex elements suddenly shift to collapse?</li>
              <li>How can information be truly lost in a universe with conservation laws?</li>
              <li>If time is relative to the observer, what does it mean for time to "end" at a singularity?</li>
            </ol>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="font-bold text-green-700 mb-2">Pattern Recognition</h3>
            <ul className="list-disc pl-5 space-y-2">
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
          
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="font-bold text-green-700 mb-2">Alternative Model Development</h3>
            <p className="mb-3">Reframing black holes through the interaction lens:</p>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left">Standard Model</th>
                  <th className="border border-gray-300 p-2 text-left">Vivolere Model</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2">Singularity of infinite density</td>
                  <td className="border border-gray-300 p-2">Region of zero interaction probability</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">Gravitational pull from mass</td>
                  <td className="border border-gray-300 p-2">Gradient in the interaction field</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">Event horizon as point of no return</td>
                  <td className="border border-gray-300 p-2">Boundary between interaction and stasis</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">Hawking radiation as quantum tunneling</td>
                  <td className="border border-gray-300 p-2">First shimmer of interaction at dormant boundary</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">Black holes as end products of stars</td>
                  <td className="border border-gray-300 p-2">Primordial regions untouched by interaction</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="font-bold text-green-700 mb-2">Testing Against Observations</h3>
            <ol className="list-decimal pl-5 space-y-2">
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
          
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="font-bold text-green-700 mb-2">The Dual Nature: Pre-Time or Post-Time</h3>
            <p className="mb-3">
              A critical insight in this framework is that black holes could represent either:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded-md">
                <h4 className="font-bold text-blue-700">Pre-Time Regions</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Areas where interaction never began</li>
                  <li>Primordial voids untouched by the initial wavefront of interaction</li>
                  <li>Potential in a dormant state</li>
                  <li>Like unplanted seeds</li>
                </ul>
              </div>
              <div className="bg-purple-50 p-3 rounded-md">
                <h4 className="font-bold text-purple-700">Post-Time Regions</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Areas where all possible interactions have ceased</li>
                  <li>Systems that have reached complete equilibrium</li>
                  <li>Exhausted possibility</li>
                  <li>Like a completely spent fuel source</li>
                </ul>
              </div>
            </div>
            <p className="mt-3">
              <strong>The key insight:</strong> These two fundamentally different states would appear identical to observers outside the event horizon. Both would manifest as regions of zero interaction, creating the same observational effects without requiring infinite density or mass.
            </p>
            <p className="mt-2">
              This is analogous to how materials like vantablack create the appearance of perfect blackness through structural properties rather than extreme density. The perfect absorption comes from the arrangement of carbon nanotubes, not from infinite density of material.
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="font-bold text-green-700 mb-2">Thought Experiment: The Vantablack Planet</h3>
            <p className="mb-2">
              Imagine a planet whose surface was composed of perfect light-absorbing material similar to vantablack. From an observational standpoint:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>No light would return from the planet's surface</li>
              <li>The planet would appear as a perfect black sphere</li>
              <li>The boundary of this sphere would function as an "event horizon" for light</li>
              <li>We could not distinguish this object from a black hole through direct observation</li>
            </ul>
            <p className="mt-2">
              This demonstrates how the same observational phenomenon (no light return) could be caused by different mechanisms - suggesting black holes could similarly achieve their effects through interaction properties rather than infinite density.
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="font-bold text-green-700 mb-2">Implications & Predictions</h3>
            <ul className="list-disc pl-5 space-y-2">
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
      
      <div className="mt-8 text-sm text-gray-500 text-right">
        <p>Vivolere Theory - Dr. Andrew Makohon-George</p>
      </div>
    </div>
  );
};

export default ToggleView;
