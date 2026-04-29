import React from 'react';
import Link from 'next/link';
import styles from './PageHeader.module.css';

interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface PageHeaderProps {
  breadcrumbs: BreadcrumbItem[];
  heading?: string;
  description?: string;
}

export default function PageHeader({ breadcrumbs, heading, description }: PageHeaderProps) {
  return (
    <div className="container">
      <div className={styles.breadcrumbs}>
        {breadcrumbs.map((item, index) => (
          <React.Fragment key={index}>
            {item.isActive ? (
              <span className={styles.active}>{item.label}</span>
            ) : (
              <>
                <Link href={item.href || '/'} className={styles.link}>
                  {item.label}
                </Link>
                <span className={styles.separator}> | </span>
              </>
            )}
          </React.Fragment>
        ))}
      </div>
      {heading && <h1 className={styles.heading}>{heading}</h1>}
      {description && <p dangerouslySetInnerHTML={{ __html: description }} />}
    </div>
  );
}
