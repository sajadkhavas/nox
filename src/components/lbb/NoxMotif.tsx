export function NoxMotif({ dense = false }: { dense?: boolean }) {
  return (
    <svg className={dense ? "nox-motif nox-motif--dense" : "nox-motif"} viewBox="0 0 1000 100" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.5">
        {[0, 200, 400, 600, 800].map((x) => (
          <g key={x} transform={`translate(${x} 0)`}>
            <path d="M0 76 Q48 10 95 81 L72 20 Q97 45 116 5 L112 80 Q152 28 198 65 M25 95 Q42 25 82 48 L38 8 M90 97 L133 16 Q143 55 180 91 M0 41 Q70 63 199 25" />
            {dense && <path d="M5 91 L54 9 L56 86 L104 23 L157 90 L177 7 M12 18 Q98 100 191 48 M73 4 L88 96 M117 99 L144 2" />}
          </g>
        ))}
      </g>
    </svg>
  );
}