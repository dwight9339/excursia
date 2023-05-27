import React from 'react';
import { useSession } from 'next-auth/react';
import { ParsedUrlQuery } from 'querystring';
import { fetchItinerary } from '../../../lib/dbFetch';
import ItineraryInfoPage from '../../../components/ItineraryInfoPage';
import styles from "../../../styles/ItineraryPage.module.scss";

interface ItineraryPageProps {
  itinerary: Itinerary;
}

const ItineraryPage: React.FC<ItineraryPageProps> = ({ itinerary }) => {
  if (!itinerary) return <div>Itinerary not found</div>;
  const { data, status } = useSession();
  const userData: any = { ...data?.user };

  return (
    <ItineraryInfoPage itinerary={itinerary} />
  );
};

export async function getServerSideProps(context: ParsedUrlQuery) {
  try {
    const params: any = context.params;
    const { id } = params;
    const res = await fetchItinerary(id);

    if (res) {
      const {_id, ...itinerary} = res;
      console.log("Itinerary retrieved");
      return { props: { itinerary }};
    } else {
      console.log(`Unable to retrieve itinerary with id ${id}`);
      return { props: { itinerary: {}}}; 
    }
  } catch(err) {
    console.log(`Error: ${err}`);
    return { props: { itinerary: {}}};
  }
};

export default ItineraryPage;