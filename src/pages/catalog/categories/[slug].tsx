import { client } from "@/lib/prismic";
import { GetStaticPaths, GetStaticProps } from "next";
import Document from "next/document";
import { useRouter } from "next/router";
import Prismic from "prismic-javascript";
import PrismicDOM from "prismic-dom";
import Link from "next/link";

interface CategoryProps {
  category: Document;
  products: Document[];
}

export default function Category({ category, products }: CategoryProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <p>Loading</p>;
  }

  return (
    <div>
      <h1>{PrismicDOM.RichText.asText(category.title)}</h1>
      <ul>
        {products.map((product) => {
          return (
            <li key={product.id}>
              <Link href={`/products/${product.uid}`}>
                <a>{PrismicDOM.RichText.asText(product.data.title)}</a>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// first step to fill slug
export const getStaticPaths: GetStaticPaths = async () => {
  const categories = await client().query([
    Prismic.Predicates.at("documents.type", "category"),
  ]);

  const paths = categories.results.map((cat) => {
    return {
      params: { slug: cat.uid },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<CategoryProps> = async (
  context
) => {
  const { slug } = context.params;

  const category = await client().getByUID("category", String(slug), {});
  const products = await client().query([
    Prismic.Predicates.at("documents.type", "product"),
    Prismic.Predicates.at("my.product.category", category.id),
  ]);

  return {
    props: {
      category,
      products: products.results,
    },
    revalidate: 5,
  };
};
