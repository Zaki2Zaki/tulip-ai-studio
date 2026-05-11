import { createContext, useContext, useState } from 'react'

export interface DiagnosisState {
  outputType: string[]
  teamSize: string
  bottlenecks: string[]
  slipWks: number
  reworkPct: number
  roundsLabel: string
  currency: 'CAD' | 'USD' | 'EUR'
}

interface DiagnosisContextValue {
  state: DiagnosisState
  update: (partial: Partial<DiagnosisState>) => void
}

const DEFAULT_STATE: DiagnosisState = {
  outputType: [],
  teamSize: '11 to 50',
  bottlenecks: [],
  slipWks: 8,
  reworkPct: 25,
  roundsLabel: '3 to 5 rounds',
  currency: 'CAD',
}

const DiagnosisContext = createContext<DiagnosisContextValue>({
  state: DEFAULT_STATE,
  update: () => {},
})

export function DiagnosisProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DiagnosisState>(DEFAULT_STATE)
  const update = (partial: Partial<DiagnosisState>) =>
    setState(s => ({ ...s, ...partial }))
  return (
    <DiagnosisContext.Provider value={{ state, update }}>
      {children}
    </DiagnosisContext.Provider>
  )
}

export function useDiagnosis() {
  return useContext(DiagnosisContext)
}
