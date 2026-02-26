import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { PageContainer, PageTitle, PageContent } from '../styles/LinkNotFound.styles';
import FadeIn from "react-fade-in";

const LinkNotFoundPage = () => {
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
      <PageTitle>Link nie został znaleziony</PageTitle>
      <PageContent>
        
        <p>Upewnij się, że adres jest poprawny lub spróbuj ponownie.</p>
      </PageContent>
    </PageContainer>
    </FadeIn>
  );
};

export default LinkNotFoundPage;
