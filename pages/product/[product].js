import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

import { db } from "@/config/firebase";
import { useAuth } from "@/firebase/context";
import { useCart } from "hooks/cart.hook";
import { removeFavorite, addFavorite, addToCart } from "@/firebase/product";

import styles from "./product.module.scss";

import Layout from "components/Layout";
import Button from "@/components/Button";
import HeartIcon from "@/icons/heart";
import HeartFilled from "@/icons/heart-filled";
import ErrorPage from "pages/404";
import { useRouter } from "next/router";
import fa from '@/lang/fa.json'
import "firebase/storage";
import firebase from "firebase/app";

export default function Product({ data, query }) {

  if (!data.id) {
    return <ErrorPage />;
  }
  const router = useRouter();
  // const { params } = router.query;
  console.log("params:", router.query);
  console.log("query:", query);
  const [selectedSize, setSelectedSize] = useState();
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [isFavorite, setFavorite] = useState(false);
  const { user, loading } = useAuth();



  const {
    brand,
    cover_photo,
    description,
    photos,
    price,
    product_name,
    sale_price,
    sizes,
  } = data;

  const id = query?.product;

  const storageRef = firebase.storage().ref();

  // Map over the photos array and download each image
  const [photoUrls, setPhotoUrls] = useState([]);

  useEffect(() => {
    const urls = [];
    photos.forEach((image) => {
      const photoRef = storageRef.child(image);
      photoRef
        .getDownloadURL()
        .then((url) => {
          urls.push(url);
          setPhotoUrls(urls);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }, []);

  // ...




  useEffect(() => {
    user && setFavorite(user.favorites.includes(id));
  }, [user]);

  const removeEvent = (id) => {
    removeFavorite(id);
    setFavorite(false);
  };
  const addEvent = (id) => {
    addFavorite(id);
    setFavorite(true);
  };

  const favoriteEvent = () => {
    user
      ? isFavorite
        ? removeEvent(id)
        : addEvent(id)
      : typeof window !== "undefined" && router.push("/login");
  };

  const cart = useCart().data;

  console.log(cart);

  const addCartEvent = () => {
    if (!user && !loading && typeof window !== "undefined")
      router.push("/login");
    else {
      if (selectedSize) {
        const newCart = {
          ...cart,
          [id]: cart.hasOwnProperty(id)
            ? [...cart[id], selectedSize]
            : [selectedSize],
        };
        addToCart(newCart);
      }
      if (sizes?.length === 0) {
        const newCart = {
          ...cart,
          [id]: cart.hasOwnProperty(id) ? [...cart[id], "-"] : ["-"],
        };
        addToCart(newCart);
      }
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>Create Next App</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <div className={styles.photosContainer}>
            <div className={styles.carouselContainer}>
              <img src={photoUrls[selectedPhoto]} loading="lazy" />
            </div>
            <div className={styles.smallPhotos}>
              {photoUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Product photo ${index + 1}`}
                  className={styles.smallPhoto}
                  style={{ borderColor: selectedPhoto === index && "black" }}
                  loading="lazy"
                  onClick={() => setSelectedPhoto(index)}
                />
              ))}
            </div>
            <hr />
          </div>
          <div className={styles.productInfos}>
            <div className={styles.header}>
              <h1 className={styles.productTitle}>{product_name || ""}</h1>
              <Link href={`/brand/${brand}`}>{brand || ""}</Link>
            </div>
            <span className={styles.priceText}>{price || 0}$</span>
            <div className={styles.saleContainer}>
              <span className={styles.saleText}>{sale_price || 0}$</span>
              <span className={styles.savedText}>
                {"(You will be saved " + (price - sale_price) + "$!)"}
              </span>
            </div>
            <hr />
            <hr />
            <div className={styles.buttons}>
              <Button style={{ margin: 0 }} onClick={addCartEvent}>
                {fa.product.addToCart}
              </Button>
              <button className={styles.favButton} onClick={favoriteEvent}>
                {isFavorite ? (
                  <HeartFilled width={24} height={24} />
                ) : (
                  <HeartIcon width={24} height={24} />
                )}
              </button>
            </div>
            <hr />
            <div className={styles.infoContainer}>
              <h4 className={styles.sizesText}>{fa.product.description}</h4>
              <p className={styles.infoText}>{description}</p>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}

export async function getStaticProps({ params }) {
  console.log("prams.product:", params.product)
  let data = {};
  let error = {};
  await db
    .collection("products")
    .where("id", "==", parseInt(params.product))
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        if (doc.exists) {
          console.log("Document data:", doc);
          data = { id: doc.id, ...doc.data() };
        }
      });
    })
    .catch((e) => (error = e));
  console.log("data: ", data)
  return {
    props: {
      data: data || null,
      error,
      query: params,
    },
  };
}
export async function getStaticPaths() {
  let data = [];
  let error = {};
  await db
    .collection("products")
    .get()
    .then(function (querySnapshot) {
      const products = querySnapshot.docs.map(function (doc) {
        return { id: doc.id, ...doc.data() };
      });
      data = products;
    })
    .catch((e) => (error = e));
  const paths = data.map((product) => ({
    params: { product: product.id.toString() },
  }));
  return { paths, fallback: false };
}