import SEO from "@/components/SEO";
import { client } from "@/lib/prismic";
import { GetServerSideProps } from "next";
import { Title } from "../styles/pages/Home";
import Primisc from "prismic-javascript";
import Document from "next/document";
import Link from "next/link";
import PrismicDOM from "prismic-dom";

interface HomeProps {
  recommendedProducts: Document[];
}

export default function Home({ recommendedProducts }: HomeProps) {
  return (
    <div>
      <section>
        <SEO
          title="DevCommerce, o seu e-commerce"
          shouldExcludeTitleSuffix
          description="teste"
          image="boost.png"
        />
        <Title>Products</Title>

        <ul>
          {recommendedProducts.map((recommendedProduct) => {
            return (
              <li key={recommendedProduct.id}>
                <Link href={`/products/${recommendedProduct.slug}`}>
                  <a>
                    {PrismicDOM.RichText.asText(recommendedProduct.data.title)}
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const recommendedProducts = await client().query([
    Primisc.Predicates.at("document.type", "product"),
  ]);

  return {
    props: {
      recommendedProducts: recommendedProducts.results,
    },
  };
};
