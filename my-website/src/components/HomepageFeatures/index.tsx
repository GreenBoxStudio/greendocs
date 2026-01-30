import type {ReactNode} from 'react';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  icon: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Strukturiert wie ein Handbuch',
    icon: '📘',
    description: (
      <>
        Saubere Navigation, klare Kapitel und konsistente Templates – damit Teams
        sofort finden, was sie brauchen.
      </>
    ),
  },
  {
    title: 'Studio Workflows im Fokus',
    icon: '🧩',
    description: (
      <>
        Best Practices für Projekte, Onboarding und interne Prozesse – alles
        abgestimmt auf GreenBox Studio.
      </>
    ),
  },
  {
    title: 'Schnell, ruhig, übersichtlich',
    icon: '⚡',
    description: (
      <>
        Eine GitBook-ähnliche Experience mit klarer Typografie, sanften Farben
        und schnellen Ladezeiten.
      </>
    ),
  },
];

function Feature({title, icon, description}: FeatureItem) {
  return (
    <div className={styles.featureCard}>
      <span className={styles.featureIcon} aria-hidden="true">
        {icon}
      </span>
      <Heading as="h3">{title}</Heading>
      <p>{description}</p>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.featureGrid}>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
