import styles from './styles.module.scss';
import Image from 'next/image';
import logo from '../../../public/images/logo.svg';

import { ActiveLink } from '../ActiveLink';

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <a>
          <Image src={logo} alt='Sujeito Programador Logo' />
        </a>

        <nav>
          <ActiveLink href='/' texto='Home' />
          <ActiveLink href='/posts' texto='Conteúdos' />
          <ActiveLink href='/sobre' texto='Quem somos?' />
        </nav>

        <a
          className={styles.readyButton}
          type='button'
          href='https://sujeitoprogramador.com'
        >
          COMEÇAR
        </a>
      </div>
    </header>
  );
}
