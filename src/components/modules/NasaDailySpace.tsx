import YouTube from "react-youtube";
import { NasaDailySpaceSchemaType } from "../../server/externalApis/nasaDailySpaceEndpoint";
import { useState } from "react";

export function NasaDailySpace ({ data }: { data: NasaDailySpaceSchemaType }) {
  const { url, media_type, title, explanation } = data;
  const explanationParts = explanation.split('.');
  const showShowMoreButton = explanationParts.length > 1;

  const [showFullDescription, setShowFullDescription] = useState<boolean>(false);

  return (
    <>
      {media_type === 'image' && (
        <img src={url} alt={title} />
      )}

      {media_type === 'video' && (
        <YouTube videoId={url.split('embed/')[1].split('?')[0]} />
      )}

      <div><strong>{title}</strong></div>

      {!showFullDescription && (
        <div>{explanationParts[0]}.
          {showShowMoreButton && (
            <a href="#" onClick={() => setShowFullDescription(true)}>More</a> 
          )}  
        </div> 
      )}

      {showFullDescription && <div>{explanation}</div>}
    </>
  );
}
