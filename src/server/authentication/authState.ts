// import { AsyncLocalStorage } from 'async_hooks';

// interface AuthState {
//   isLoggingOut: boolean;
// }

// const authStorage = new AsyncLocalStorage<AuthState>();

// export function initAuthState() {
//   authStorage.enterWith({ isLoggingOut: false });
// }

// export function setLoggingOut (value: boolean) {
//   const state = authStorage.getStore();
//   if ( state ) { state.isLoggingOut = value; }
// }

// export function isLoggingOut (): boolean {
//   return authStorage.getStore()?.isLoggingOut ?? false;
// }