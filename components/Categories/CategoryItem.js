import React from "react";
import Link from "next/link";
import styles from "./categories.module.scss";
const CategoryItem = ({ name, link, emoji }) => {
    return (
        <li className={styles.categoryItem}>
            <Link href={link || "/"}>
                <a>
                    {/* <span className={styles.emoji}>{emoji}</span> */}
                    <span className={styles.categoryName}>{name}</span>
                </a>
            </Link>
        </li>
    );
};
export default CategoryItem;