import React from 'react';
import { motion } from 'framer-motion';

const ResultsComponent = ({ result }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="p-4 bg-gray-200 rounded-md"
    >
      <h2 className="text-xl font-bold">Result:</h2>
      <p>{result}</p>
    </motion.div>
  );
};

export default ResultsComponent;
