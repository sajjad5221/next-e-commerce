import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import styles from "./product.module.scss";
import HeartIcon from "@/icons/heart";
import Link from "next/link";
import HeartFilled from "@/icons/heart-filled";
import { addFavorite, removeFavorite } from "@/firebase/product";
import { useRouter } from "next/router";
import { useAuth } from "@/firebase/context";
// import Image from "next/image";
import "firebase/storage";
export default function ProductCard({
  bgColor,
  id,
  brand,
  name,
  price,
  sale_price,
  image,
  favorite,
  ...props
}) {
  const [isFavorite, setFavorite] = useState(favorite);

  const { user, loading } = useAuth();

  const router = useRouter();

  // const imageUrl = firebase.storage().ref(image).toString();
  const [imageUrl, setImageUrl] = useState(null)
  useEffect(() => {
    const storageRef = firebase.storage().ref()
    const imageRef = storageRef.child(image)

    imageRef.getDownloadURL().then((url) => {
      setImageUrl(url)
    })
  }, [])
  const removeEvent = (id) => {
    removeFavorite(id);
    setFavorite(false);
  };
  const addEvent = (id) => {
    addFavorite(id);
    setFavorite(true);
  };

  const favoriteEvent = () => {
    if (user && !loading) isFavorite ? removeEvent(id) : addEvent(id);
    else typeof window !== "undefined" && router.push("/login");
  };

  const goToProduct = (target) => {
    console.log(target);
    target?.localName !== "button" &&
      typeof window !== "undefined" &&
      router.push(`/${id}`);
  };

  return (
    <div
      className={styles.container}
      style={{
        backgroundColor: bgColor || "",
      }}
      onClick={(e) => goToProduct(e.target)}
      {...props}
    >

      <button className={styles.favContainer} onClick={favoriteEvent}>
        {isFavorite ? (
          <HeartFilled width={16} height={16} />
        ) : (
          <HeartIcon width={16} height={16} />
        )}
      </button>
      <div className={styles.imageContainer}>
        <img src={imageUrl} className={styles.image} />
        {/* <Image src={imageUrl} /> */}
        {/* {image && <img className={styles.image} src={image} loading="lazy" />} */}
      </div>
      <div className={styles.textContainer}>
        <Link href={`/brand/${brand}`}>
          <h4 className={styles.brandText}>{brand}</h4>
        </Link>
        <h4>{name}</h4>
        {sale_price ? (
          <div className={styles.priceContainer}>
            <div className={styles.discount}>
              {(((price - sale_price) / price) * 100) | 0}%
            </div>
            <div className={styles.prices}>
              <span className={styles.priceText}>{price}$</span>
              <span className={styles.salePriceText}>{sale_price}$</span>
            </div>
          </div>
        ) : (
          <span className={styles.price}>{price || 0}$</span>
        )}
      </div>
    </div>
  );
}
