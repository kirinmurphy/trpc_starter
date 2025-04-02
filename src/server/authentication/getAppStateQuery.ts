import { APP_STATE, isAppReady } from '../appState/appState';
import { ContextType } from './types';

interface Props {
  ctx: ContextType;
}

interface ReturnProps {
  isAuthenticated: boolean;
  appState: APP_STATE;
}

export async function getAppStateQuery(props: Props): Promise<ReturnProps> {
  const { ctx } = props;
  const { userId } = ctx;

  const appState = isAppReady() ? APP_STATE.READY : APP_STATE.IN_PROGRESS;

  return {
    isAuthenticated: !!userId,
    appState,
  };
}
