import './App.css'
import { NasaDailySpace } from './components/modules/NasaDailySpace';
import { TRPCLoader } from './components/TRPCLoader';
import { trpcService } from './utils/trpc'

const {
  getNasaDailySpace,
  getMarsRoverPics,
  getAstronautsOnISS,
  getISSLocation
} = trpcService;

function App() {
  const issLocationQuery = getISSLocation.useQuery(undefined, {
    refetchInterval: 30 * 60 * 1000,
    refetchIntervalInBackground: false,
  });

  return (
    <>
      <div className="container">
        <SpaceWidget>
          <TRPCLoader query={getNasaDailySpace.useQuery()}>
            {(data) => <NasaDailySpace data={data} />}
          </TRPCLoader>
        </SpaceWidget>

        <SpaceWidget>
          <TRPCLoader query={getMarsRoverPics.useQuery()}>
            {({ photos }) => <>
              <div><img src={photos[0].img_src} /></div>
            </>}
          </TRPCLoader>
        </SpaceWidget>

        <SpaceWidget>
          <TRPCLoader query={issLocationQuery}>
            {({ iss_position }) => <>
              <div> 
                <strong>
                  <a href="https://www.nasa.gov/international-space-station/" target="_blank">ISS</a>
                </strong>{" "}
              </div>
              <div>
                {iss_position.latitude} / {iss_position.longitude}
              </div>
            </>}
          </TRPCLoader>          

          <TRPCLoader query={getAstronautsOnISS.useQuery()}>
            {({ people }) => <>
              {people.map(({ name, craft }) => <li key={name}>{name} ({craft})</li>)}
            </>}
          </TRPCLoader>          
        </SpaceWidget>
      </div>
    </>
  )
}

export default App;

function SpaceWidget ({ children }: { children: React.ReactNode }) {
  return (
    <div className="widget-wrapper">{children}</div>
  );  
}
