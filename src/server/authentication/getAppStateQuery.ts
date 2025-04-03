import { SYSTEM_STATUS, isSystemReady } from '../systemStatus/systemStatus';
import { ContextType } from './types';

interface Props {
  ctx: ContextType;
}

// TOOD PR: this could be consolidated with the client interface
interface ReturnProps {
  isAuthenticated: boolean;
  systemStatus: SYSTEM_STATUS;
}

export async function getAppStateQuery(props: Props): Promise<ReturnProps> {
  const { ctx } = props;
  const { userId } = ctx;

  // TODO PR: is this redundant with just reading the systemStatus
  const systemStatus = isSystemReady()
    ? SYSTEM_STATUS.READY
    : SYSTEM_STATUS.IN_PROGRESS;

  return {
    isAuthenticated: !!userId,
    systemStatus,
  };
}
