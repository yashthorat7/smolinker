import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getLongUrl } from '@/services/linkService';
import { storeClicks } from '@/services/clickService';

const RedirectLink = () => {
  const { id } = useParams();
  const hasExecuted = useRef(false);

  useEffect(() => {
    if (!id || hasExecuted.current) return;
    hasExecuted.current = true;

    async function handleRedirect() {
      try {
        const link = await getLongUrl(id);

        if (!link || !link.original_url) {
          window.location.replace('/');
          return;
        }

        let destination = link.original_url.trim();
        if (!/^https?:\/\//i.test(destination)) {
          destination = 'https://' + destination;
        }

        try {
          await Promise.race([
            storeClicks({ id: link.id }),
            new Promise((resolve) => setTimeout(resolve, 1400)),
          ]);
        } catch {
          // ignore logging failure
        }

        window.location.replace(destination);
      } catch {
        window.location.replace('/');
      }
    }

    handleRedirect();
  }, [id]);

  return <div className="fixed inset-0 bg-[#030303]" />;
};

export default RedirectLink;
