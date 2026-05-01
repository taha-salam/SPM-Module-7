'use client';

import { useEffect, useMemo, useState } from 'react';
import { getSession, setSession } from './session';

export function useSession() {
  const [session, setSessionState] = useState(() => getSession());

  useEffect(() => {
    setSessionState(getSession());
  }, []);

  const actions = useMemo(
    () => ({
      update(next) {
        setSession(next);
        setSessionState(getSession());
      },
    }),
    [],
  );

  return { ...session, ...actions };
}

