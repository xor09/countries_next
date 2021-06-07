import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import EnhancedTable from './Home';

export default function Home() {
  return (
    <body className={styles.body}>
      <div className="App">
        <EnhancedTable/>
      </div>
    </body>
  )
}
