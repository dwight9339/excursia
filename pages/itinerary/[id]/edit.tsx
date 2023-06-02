import React from 'react';
import { ParsedUrlQuery } from 'querystring';
import { fetchItinerary } from '../../../lib/dbFetch';
import EditPage from '../../../components/EditPage';

interface EditItineraryProps {
  itinerary: Itinerary;
}

const EditItinerary: React.FC<EditItineraryProps> = ({ itinerary }) => {
  if (!itinerary) return <div>Itinerary not found</div>;
  
  return (
    <EditPage
      itinerary={itinerary}
    />
  );
};

export async function getServerSideProps(context: ParsedUrlQuery) {
  try {
    const params: any = context.params;
    const { id } = params;
    const res = await fetchItinerary(id);

    if (res) {
      return { props: {
        itinerary: res
      }};
    } else {
      console.log(`Unable to retrieve itinerary with id: ${id}`);
      return { props: {
        itineraryId: null,
        itinerary: {}
      }}; 
    }
  } catch(err) {
    console.log(`Error: ${err}`);
    return { props: { itinerary: {}}};
  }
};

export default EditItinerary;