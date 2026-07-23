import styles from "./InfoPage.module.css";

export default function InfoBio({ info }) {
  if (!info?.bio && !info?.email) {
    return null;
  }

  return (
    <div className={styles.bio}>
      {info.bio ? <p className={styles.bioText}>{info.bio}</p> : null}
      {info.email ? (
        <a className={styles.email} href={`mailto:${info.email}`}>
          {info.email}
        </a>
      ) : null}
      <a className={styles.email} target="_blank" href={"https://www.instagram.com/dheeeep"}>@dheeeep</a>
    </div>
  );
}
