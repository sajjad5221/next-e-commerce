import React, { useState, useEffect } from "react";
import styles from "./categories.module.scss";
import { db } from "@/config/firebase";
import HelpIcon from "@/icons/help";
import fa from '@/lang/fa.json'
import CategoryItem from "./CategoryItem";

export default function CategoriesBar() {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    db.collection("categories").get().then((data) => {
      const newCategories = [];
      data.forEach((doc) => {
        newCategories.push({ id: doc.id, ...doc.data() });
      });
      setCategories(newCategories);
    });
  }, []);
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{fa.categories.title}</h2>
      <ul className={styles.categories}>
        {categories.map((category) => {
          return <CategoryItem key={category.id} name={category.name} emoji={category.emoji} link={`/category/${category.id}`} />
        })}
      </ul>
      <div className={styles.helpContainer}>
        <div className={styles.helpIcon}>
          <HelpIcon width={18} height={18} />
        </div>
        <span>Help Center</span>
      </div>
    </div>
  );
}
