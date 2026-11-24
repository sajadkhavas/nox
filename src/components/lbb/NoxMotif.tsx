/** Original vector ornament inspired by the boutique's glass lettering. */
export function NoxMotif({ dense = false }: { dense?: boolean }) {
  return <svg className={dense ? "nox-motif nox-motif--dense" : "nox-motif"} viewBox="0 0 1000 100" fill="none" aria-hidden="true">
    {[0,250,500,750].map(x => <g key={x} transform={`translate(${x} 0)`} stroke="currentColor" strokeLinejoin="miter">
      <path d="M-15 86C35 90 40 8 91 13C55 29 85 71 51 88L115 17L93 81L145 9L127 83C159 50 188 19 244 8C191 37 210 66 250 75" strokeWidth="2.3"/>
      <path d="M8 98C87 76 93 30 76 0M24 78L69 20L45 69L102 8M102 96L158 28L150 78L195 18L176 72L227 32M-5 48C50 8 154 106 255 45M28 5C42 84 167 97 235 7" strokeWidth=".9"/>
      <path d="M42 62L87 29L75 58L119 24L102 66L160 22L145 71L201 29" strokeWidth="4"/>
      {dense && <path d="M0 69C63 29 148 87 250 22M19 94L54 40M162 98L220 14M112 4C125 48 94 76 67 100" strokeWidth="1.2"/>}
    </g>)}
  </svg>;
}
