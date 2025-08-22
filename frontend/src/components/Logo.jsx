import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export default function Logo() {
    return (
        <motion.div
            className="w-14 h-14 mr-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg shadow-blue-500/25"
            whileHover={{
                rotate: [0, -5, 5, 0],
                scale: 1.05,
                boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.4)",
            }}
            transition={{ duration: 0.6 }}
        >
            <div className="flex items-center justify-center w-full h-full">
                <Zap className="w-7 h-7 text-white" />
            </div>
        </motion.div>
    );
}
