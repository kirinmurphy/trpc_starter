import { isSystemReady } from '../systemStatus/systemStatus';
import { SYSTEM_STATUS } from '../systemStatus/types';
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

  const systemStatus = isSystemReady()
    ? SYSTEM_STATUS.READY
    : SYSTEM_STATUS.IN_PROGRESS;

  return {
    isAuthenticated: !!userId,
    systemStatus,
  };
}
