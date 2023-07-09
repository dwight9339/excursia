import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { CircularProgress } from '@mui/material';
import axios from 'axios';
import EditPage from '../../../components/EditPage';

const EditItinerary: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchItineraryData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/fetch-itinerary?id=${id}`);

        if (res.status !== 200) {
          console.error(`Error fetching itinerary: ${res.statusText}`);
          setItinerary(null);
        } else {
          setItinerary(res.data);
        }
      } catch (err) {
        console.error(`Error fetching itinerary: ${err}`);
        setItinerary(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchItineraryData();
    }
  }, [id]);

  const pageContent = useMemo(() => {
    if (loading) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100vw',
        }}>
          <CircularProgress
            size={300}
            style={{
              color: "#0A89A6"
            }}
          />
        </div>
      );
    }

    if (!loading && !itinerary) {
      return <div>Itinerary not found</div>;
    }

    if (itinerary) {
      return (
        <EditPage
          itinerary={itinerary}
        />
      );
    }
  }, [loading, itinerary]);

  return (
    <div style={{
      width: '100vw'
    }}>
      {pageContent}
    </div>
  );
};

export default EditItinerary;