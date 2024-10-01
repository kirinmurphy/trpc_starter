import './App.css'
import { trpcService } from './utils/trpc'

function App() {

  const { 
    data: issData, 
    isLoading: issIsLoading, 
    error: issError, 
  } = trpcService.getAstronautsOnISS.useQuery();

  const people = issData?.people;

  return (
    <>
      <div>
        {issIsLoading && <div>Loading...</div>}
        {issError && !issIsLoading && <div>{issError.message}</div>}
        {people && (
          <div>
            <header>ISS Astros</header>
            <ul>
              {people.map(({ name }) => <li key={name}>{name}</li>)}
            </ul>
          </div>
        )}
      </div>      
    </>
  )
}

export default App
