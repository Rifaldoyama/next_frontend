'use client';

import { ConfirmCompleteProfile } from '../molecules/ConfirmCompleteProfile';
import { useProfileGate } from '@/hooks/useProfileGate';

export function CompleteProfileGate() {
  const { open, goComplete, goSkip } = useProfileGate();

  return (
    <ConfirmCompleteProfile
      open={open}
      onComplete={goComplete}
      onSkip={goSkip}
    />
  );
}
