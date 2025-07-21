import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface LiquidTubeProgressProps {
    fillPercentage: number;
    currentPrayerIndex: number;
}

const PRAYER_NAMES = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

const describeEllipseArc = (cx: number, cy: number, rx: number, ry: number, startAngle: number, endAngle: number): string => {
    const start = {
        x: cx + rx * Math.cos(startAngle * Math.PI / 180),
        y: cy + ry * Math.sin(startAngle * Math.PI / 180)
    };
    const end = {
        x: cx + rx * Math.cos(endAngle * Math.PI / 180),
        y: cy + ry * Math.sin(endAngle * Math.PI / 180)
    };
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${start.x} ${start.y} A ${rx} ${ry} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
};

interface SegmentProps {
    index: number;
    isCurrent: boolean;
    isCompleted: boolean;
    fillPercentage: number;
}

const Segment: React.FC<SegmentProps> = ({ index, isCurrent, isCompleted, fillPercentage }) => {
    const pathRef = useRef<SVGPathElement>(null);
    const [length, setLength] = useState(0);
    const controls = useAnimation();

    // Arc configuration
    const totalAngle = 180;
    const numSegments = 5;
    const gapAngle = 8;
    const segmentAngle = (totalAngle - (numSegments - 1) * gapAngle) / numSegments;
    const startAngle = -180 + index * (segmentAngle + gapAngle);
    const endAngle = startAngle + segmentAngle;

    const rx = 180; // Horizontal radius
    const ry = 180; // Vertical radius 
    const cx = 200;
    const cy = 180;
    const strokeWidth = 18;

    const arcPath = describeEllipseArc(cx, cy, rx, ry, startAngle, endAngle);

    useEffect(() => {
        if (pathRef.current) {
            setLength(pathRef.current.getTotalLength());
        }
    }, [arcPath]);

    useEffect(() => {
        let toValue = length;
        if (isCompleted) {
            toValue = 0;
        } else if (isCurrent) {
            toValue = length * (1 - fillPercentage / 100);
        }

        controls.start({
            strokeDashoffset: toValue,
            transition: { duration: 1.5, ease: [0.25, 0.1, 0.25, 1], delay: isCurrent ? 2 : (4 - index) * 0.5 }
        });
    }, [isCompleted, isCurrent, fillPercentage, length, controls]);

    return (
        <g>
            {/* Background */}
            <path
                d={arcPath}
                fill="none"
                stroke="#ffffff"
                strokeOpacity={0.15}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
            />
            {/* Fill */}
            <motion.path
                ref={pathRef}
                d={arcPath}
                fill="none"
                stroke="white"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={length}
                strokeDashoffset={length}
                animate={controls}
            />
        </g>
    );
};

const LiquidTubeProgress: React.FC<LiquidTubeProgressProps> = ({
    fillPercentage,
    currentPrayerIndex,
}) => {
    return (
        <div className="relative w-full flex justify-center items-center mt-2">
            <svg width="400" height="180" viewBox="0 0 400 180">
                <defs>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#ffffff" floodOpacity="0.3" />
                    </filter>
                </defs>

                <g filter="url(#glow)">
                    {PRAYER_NAMES.map((_, index) => (
                        <Segment
                            key={index}
                            index={index}
                            isCurrent={index === currentPrayerIndex}
                            isCompleted={index < currentPrayerIndex}
                            fillPercentage={fillPercentage}
                        />
                    ))}
                </g>


                {PRAYER_NAMES.map((prayerName, index) => {
                    const totalAngle = 180;
                    const numSegments = 5;
                    const gapAngle = 8;
                    const segmentAngle = (totalAngle - (numSegments - 1) * gapAngle) / numSegments;
                    const angle = -180 + index * (segmentAngle + gapAngle) + segmentAngle / 2;
                    const rx = 150; // Horizontal radius
                    const ry = 150; // Vertical radius
                    const labelRadiusOffset = 25; // How far below the arc to place labels
                    const cx = 200; // center X position
                    const cy = 160; // center Y position
                    const x = cx + rx * Math.cos(angle * Math.PI / 180);
                    const y = cy + ry * Math.sin(angle * Math.PI / 180) + labelRadiusOffset;

                    return (
                        <motion.text
                            key={index}
                            x={x}
                            y={y}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className={`text-xs font-medium ${index === currentPrayerIndex ? 'fill-white' : 'fill-white/60'
                                }`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 1 + (index * 0.1) }}
                        >
                            {prayerName}
                        </motion.text>
                    );
                })}
            </svg>
        </div>
    );
};

export default LiquidTubeProgress;