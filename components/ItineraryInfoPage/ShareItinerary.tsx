import React, { useState } from 'react';
import { Button } from '@mui/material';
import { Facebook, Twitter } from '@mui/icons-material';
import styles from '../../styles/ShareItinerary.module.scss';

interface ShareItineraryProps {
  itinerary: Itinerary;
}

const ShareItinerary: React.FC<ShareItineraryProps> = ({ itinerary }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/itinerary/${itinerary.id}`;

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(url);
  };

  const handleShareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
  };

  const handleShareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank');
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.shareButton}
        onClick={handleShareOnTwitter}
      >
        <Twitter />
        Share on Twitter
      </div>
      <div
        className={styles.shareButton}
        onClick={handleShareOnFacebook}
      >
        <Facebook />
        Share on Facebook
      </div>
      <div
        className={styles.shareButton}
        onClick={() => {
          handleCopyToClipboard();
          setCopied(true);
          setTimeout(() => {
            setCopied(false);
          }, 1000);
        }}
      >
        {copied ? "Copied!" : "Copy to clipboard"}
      </div>
    </div>
  );
};

export default ShareItinerary;