import React from 'react';
import styles from './Spinner.module.css'; // Optional: Styles for the spinner

const Spinner = () => {
  return (
    <div className={styles.spinner}>
      <div className={styles.loader}></div> {/* Example spinner animation */}
    </div>
  );
};

export default Spinner;