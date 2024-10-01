import './App.css'
import { TRPCLoader } from './components/TRPCLoader';
import { trpcService } from './utils/trpc'

function App() {
  const nasaPicOfTheDay = trpcService.getNasaPicOfTheDay.useQuery();
  const marsRoverPics = trpcService.getMarsRoverPics.useQuery();
  const issAstrosQuery = trpcService.getAstronautsOnISS.useQuery();
  const issLocationQuery = trpcService.getISSLocation.useQuery(undefined, {
    refetchInterval: 30 * 60 * 1000,
    refetchIntervalInBackground: false,
  });

  console.log('======= nasaPicOfTheDay', nasaPicOfTheDay?.data);

  return (
    <>
      <div>
        <TRPCLoader query={marsRoverPics}>
          {({ photos }) => <>
            <div><img src={photos[0].img_src} /></div>
          </>}
        </TRPCLoader>
        <TRPCLoader query={issLocationQuery}>
          {({ iss_position }) => <>
            <div> 
              <strong>
                <a href="https://www.nasa.gov/international-space-station/" target="_blank">ISS</a>
                </strong>{" "}
               {iss_position.latitude} / {iss_position.longitude}
            </div>
          </>}
        </TRPCLoader>
        <TRPCLoader query={issAstrosQuery}>
          {({ people }) => <>
            {people.map(({ name, craft }) => <li key={name}>{name} ({craft})</li>)}
          </>}
        </TRPCLoader>

      </div>
    </>
  )
}

export default App
