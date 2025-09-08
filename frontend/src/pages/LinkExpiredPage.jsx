import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { PageContainer, PageTitle, PageContent } from '../styles/globalStyles';
const LinkExpiredPage = () => {
  const { uuid } = useParams();

  useEffect(() => {
    if (uuid) {
      console.log("UUID z URL:", uuid);
      // fetch(`/api/check/${uuid}`) ...
    }
  }, [uuid]);

  return (
    <PageContainer>
      <PageTitle>Link wygasł</PageTitle>
      <PageContent>
        
        <p>Upewnij się, że adres jest poprawny lub spróbuj ponownie.</p>
        {uuid && <p>Sprawdzam UUID: {uuid}</p>}
      </PageContent>
    </PageContainer>
  );
};

export default LinkExpiredPage;
