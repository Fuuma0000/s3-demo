import Image from "next/image";
import styles from "./page.module.css";
import S3UploadForm from "./components/S3UploadForm";

export default function Home() {
  return (
    <main className={styles.main}>
      <S3UploadForm />
    </main>
  );
}
