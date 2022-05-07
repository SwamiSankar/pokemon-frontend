import React from 'react';
import 'react-step-progress-bar/styles.css';
import { ProgressBar } from 'react-step-progress-bar';

const StatBar = ({ percent }) => {
  return <ProgressBar percent={percent < 100 ? percent : 100} />;
};

export default StatBar;
