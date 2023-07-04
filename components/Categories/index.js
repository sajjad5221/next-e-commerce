import React from "react";

import styles from "./categories.module.scss";
import Link from "next/link";
import HelpIcon from "@/icons/help";
import fa from '@/lang/fa.json'
import CategoryItem from "./CategoryItem";

export default function CategoriesBar() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{fa.categories.title}</h2>
      <ul className={styles.categories}>
        <CategoryItem name={fa.categories.accessories} emoji="💎" link="/category/clothing" />
        <CategoryItem name={fa.categories.shoes} emoji="👠" link="/category/shoes" />
        {/* <CategoryItem
          name="Accessories"
          emoji="👜"
          link="/category/accessories"
        />
        <CategoryItem
          name="Activewear"
          emoji="🤸"
          link="/category/activewear"
        />
        <CategoryItem
          name="Gifts & Living"
          emoji="🎁"
          link="/category/gifts_and_living"
        />
        <CategoryItem
          name="Inspiration"
          emoji="💎"
          link="/category/inspiration"
        /> */}
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
