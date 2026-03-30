import { motion } from "framer-motion";

interface MoodOrbProps {
  emoji: string;
  label: string;
  value: number;
  isSelected: boolean;
  onClick: () => void;
  color: string;
}

const orbColors: Record<number, { bg: string; glow: string; ring: string }> = {
  5: { bg: "from-emerald-400 to-teal-500", glow: "shadow-emerald-400/50", ring: "ring-emerald-400" },
  4: { bg: "from-sky-400 to-cyan-500", glow: "shadow-sky-400/50", ring: "ring-sky-400" },
  3: { bg: "from-amber-400 to-yellow-500", glow: "shadow-amber-400/50", ring: "ring-amber-400" },
  2: { bg: "from-purple-400 to-violet-500", glow: "shadow-purple-400/50", ring: "ring-purple-400" },
  1: { bg: "from-rose-400 to-red-500", glow: "shadow-rose-400/50", ring: "ring-rose-400" },
};

const MoodOrb = ({ emoji, label, value, isSelected, onClick }: MoodOrbProps) => {
  const colors = orbColors[value];

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1, y: -5 }}
      whileTap={{ scale: 0.95 }}
      animate={isSelected ? {
        scale: [1, 1.15, 1.1],
        boxShadow: ["0 0 0px rgba(0,0,0,0)", `0 0 40px rgba(0,0,0,0.3)`, `0 0 30px rgba(0,0,0,0.2)`],
      } : { scale: 1 }}
      className={`relative flex flex-col items-center gap-3 p-2 rounded-full transition-all duration-300 ${
        isSelected ? "z-10" : "z-0"
      }`}
    >
      <motion.div
        animate={isSelected ? { y: [0, -8, -4] } : { y: [0, -6, 0] }}
        transition={isSelected ? { duration: 0.5 } : { duration: 3, repeat: Infinity, ease: "easeInOut", delay: value * 0.3 }}
        className={`w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br ${colors.bg} flex items-center justify-center ${
          isSelected ? `ring-4 ${colors.ring} shadow-2xl ${colors.glow}` : "shadow-lg"
        }`}
      >
        <span className="text-4xl md:text-5xl">{emoji}</span>
      </motion.div>
      <span className={`text-xs font-medium ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
        {label}
      </span>
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -bottom-1 w-2 h-2 rounded-full bg-primary"
        />
      )}
    </motion.button>
  );
};

export default MoodOrb;
