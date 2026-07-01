// Type-only imports: these are erased at compile time, so referencing them here
// does NOT pull the slice reducers or their data into the bundle. This file
// describes the compile-time shape of every injectable feature slice so that
// selectors like `(s) => s.javascript` stay type-safe, while the actual
// reducers are still injected at runtime via useInjectReducer.
import type { JavaScriptState } from './slices/javascript';
import type { ReactState } from './slices/react';
import type { ReduxState } from './slices/redux';
import type { NextjsState } from './slices/nextjs';
import type { HtmlCssState } from './slices/htmlcss';
import type { EngineeringState } from './slices/engineering';

// ==============================|| INJECTABLE SLICE STATE SHAPE ||============================== //

export interface InjectableState {
  javascript: JavaScriptState;
  react: ReactState;
  redux: ReduxState;
  nextjs: NextjsState;
  htmlcss: HtmlCssState;
  engineering: EngineeringState;
}
