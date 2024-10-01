import './App.css'
import { TRPCLoader } from './components/TRPCLoader';
import { trpcService } from './utils/trpc'

function App() {
  
  const issAstrosResponse = trpcService.getAstronautsOnISS.useQuery();

  return (
    <>
      <TRPCLoader query={issAstrosResponse}>
        {(issAstrosData) => <>
          <header><h2>Current ISS Astros</h2></header>
          {issAstrosData.people.map(({ name }) => <li key={name}>{name}</li>)}
        </>}
      </TRPCLoader>
    </>
  )
}

export default App
