import { Avatar, Card, CardContent, Typography } from "@mui/material";
import { motion } from "framer-motion";

const ScoreboardComponent = ({ players }) => {
  const variants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.2 }}
      className="w-1/4"
    >
      {players.map((player, index) => (
        <motion.div
          key={index}
          variants={variants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mb-4"
        >
          <Card>
            <CardContent className="flex items-center">
              <Avatar src={player.avatar} className="mr-4" />
              <div>
                <Typography variant="h6">{player.name}</Typography>
                <Typography variant="body2">Score: {player.score}</Typography>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ScoreboardComponent;
