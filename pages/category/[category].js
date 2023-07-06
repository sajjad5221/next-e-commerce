import Head from "next/head";

import styles from "./category.module.scss";

import Layout from "components/Layout";
import { useAuth } from "@/firebase/context";
import { db } from "@/config/firebase";
import Button from "@/components/FilterButton";
import ProductCard from "@/components/ProductCard/product-card";
import Link from "next/link";
const getEmoji = {
  clothing: "👚",
  shoes: "👠",
  accessories: "👜",
  activewear: "🤸",
  gifts_and_living: "🎁",
  inspiration: "💎",
};

export default function Category({ data, query }) {
  const { user, loading } = useAuth();
  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>Create Next App</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <div className={styles.header}>
            <div className={styles.headerButtons}>
              <Button type="sort" style={{ marginRight: 20 }} />
              <Button count={0} />
            </div>
          </div>
          <div className={styles.products}>
            {!loading &&
              data.map((product) => {
                return (
                  <Link href={`/product/${product.id}`}>
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      brand={product.brand}
                      name={product.name}
                      image={product.cover_photo}
                      price={product.price}
                      sale_price={product.sale_price}
                    // favorite={user?.favorites?.includes(product.id)}
                    />
                  </Link>
                );
              })}
          </div>
        </main>
      </div>
    </Layout>
  );
}

export async function getStaticProps({ params }) {
  let data = {};
  let error = {};
  console.log("params is :", params)
  await db
    .collection("products")
    .where("category_id", "==", parseInt(params.category))
    .get()
    .then(function (querySnapshot) {
      const products = querySnapshot.docs.map(function (doc) {
        return { id: doc.id, ...doc.data(), category_id: params.category };
      });
      data = products;
    })
    .catch((e) => (error = e));
  return {
    props: {
      data,
      error,
    },
  };
}
export async function getStaticPaths() {
  const categories = await db.collection('categories').get();
  const paths = categories.docs.map((doc) => ({
    params: { category: doc.id },
  }));

  return { paths, fallback: false };
}