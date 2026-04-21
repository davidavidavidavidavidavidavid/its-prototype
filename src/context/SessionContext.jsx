import { createContext, useContext, useReducer } from 'react';

export const PROBLEMS = [
  { dividend: 48, divisor: 3, answer: 16 },
  { dividend: 85, divisor: 5, answer: 17 },
  { dividend: 72, divisor: 4, answer: 18 },
  { dividend: 96, divisor: 6, answer: 16 },
  { dividend: 78, divisor: 3, answer: 26 },
];

export const SCAFFOLD_PROBLEMS = [
  { dividend: 30, divisor: 3, answer: 10 },
  { dividend: 33, divisor: 3, answer: 11 },
];

const initialState = {
  currentProblem: 0,
  results: [],
  rollingWindow: [],
  errorCounts: {},
  scaffoldActive: false,
  scaffoldPosition: 0,
  sessionCeiling: 12,
  totalAttempted: 0,
};

function sessionReducer(state, action) {
  switch (action.type) {
    case 'RECORD_CORRECT': {
      const newResults = [...state.results, { correct: true, errorType: null }];
      const newWindow = [...state.rollingWindow, true].slice(-5);
      return {
        ...state,
        results: newResults,
        rollingWindow: newWindow,
        currentProblem: state.scaffoldActive
          ? state.currentProblem
          : state.currentProblem + 1,
        scaffoldActive: false,
        scaffoldPosition: 0,
        totalAttempted: state.totalAttempted + 1,
      };
    }
    case 'RECORD_INCORRECT': {
      const { errorType } = action;
      const newResults = [...state.results, { correct: false, errorType }];
      const newWindow = [...state.rollingWindow, false].slice(-5);
      const newErrorCounts = {
        ...state.errorCounts,
        [errorType]: (state.errorCounts[errorType] || 0) + 1,
      };
      const shouldScaffold =
        !state.scaffoldActive &&
        Object.values(newErrorCounts).some((c) => c >= 3);
      return {
        ...state,
        results: newResults,
        rollingWindow: newWindow,
        errorCounts: newErrorCounts,
        scaffoldActive: shouldScaffold || state.scaffoldActive,
        totalAttempted: state.totalAttempted + 1,
      };
    }
    case 'ADVANCE_SCAFFOLD': {
      const nextPos = state.scaffoldPosition + 1;
      if (nextPos >= SCAFFOLD_PROBLEMS.length) {
        return { ...state, scaffoldActive: false, scaffoldPosition: 0 };
      }
      return { ...state, scaffoldPosition: nextPos };
    }
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function getMasteryStatus(state) {
  if (state.rollingWindow.length >= 5) {
    const correct = state.rollingWindow.filter(Boolean).length;
    if (correct >= 4) return 'mastery';
  }
  if (state.totalAttempted >= state.sessionCeiling) return 'needs-help';
  if (state.currentProblem >= PROBLEMS.length) {
    const correct = state.results.filter((r) => r.correct).length;
    return correct >= 4 ? 'mastery' : 'needs-help';
  }
  return null;
}

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [state, dispatch] = useReducer(sessionReducer, initialState);
  return (
    <SessionContext.Provider value={{ state, dispatch }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
