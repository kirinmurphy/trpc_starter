import { Outlet } from '@tanstack/react-router';
import './App.css'
// import { trpcService } from '../utils/trpc'

// const {
//   auth
// } = trpcService;

function App() {
  return (
    <>
      <div className="container">
        Hey
      </div>
      <Outlet />
    </>
  )
}

export default App;
