'use client';

import { Provider } from 'react-redux';
import store from '@/store/store';

/**
 * ReduxProvider — wraps the entire app in the Redux store.
 * Must be a Client Component because it uses React context.
 */
export default function ReduxProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
