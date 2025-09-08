import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { PageContainer, PageTitle, PageContent } from '../styles/globalStyles';
import FadeIn from "react-fade-in";

const LinkExpiredPage = () => {
  const { uuid } = useParams();

  useEffect(() => {
    if (uuid) {
      console.log("UUID z URL:", uuid);
      // fetch(`/api/check/${uuid}`) ...
    }
  }, [uuid]);

  return (
    <FadeIn>
    <PageContainer>
      <PageTitle>Link wygasł</PageTitle>
      <PageContent>
        
        <p>Upewnij się, że adres jest poprawny lub spróbuj ponownie.</p>
      </PageContent>
    </PageContainer>
    </FadeIn>
  );
};

export default LinkExpiredPage;
