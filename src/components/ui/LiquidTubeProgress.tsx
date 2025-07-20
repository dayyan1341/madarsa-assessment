import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface PrayerSegment {
    name: string;
    startTime: string;
    endTime: string;
}

interface LiquidTubeProgressProps {
    fillPercentage: number;
    currentPrayer: string;
    prayerSegments: PrayerSegment[];
    primaryColor?: string;
}

// Helper function to describe an SVG elliptical arc
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

// --- Individual Segment Component ---
interface SegmentProps {
    index: number;
    isCurrent: boolean;
    isCompleted: boolean;
    fillPercentage: number;
    primaryColor: string;
}

const Segment: React.FC<SegmentProps> = ({ index, isCurrent, isCompleted, fillPercentage, primaryColor }) => {
    const pathRef = useRef<SVGPathElement>(null);
    const [length, setLength] = useState(0);
    const controls = useAnimation();

    const totalAngle = 180;
    const numSegments = 5;
    const gapAngle = 8; // Angle for the gap between segments
    const segmentAngle = (totalAngle - (numSegments - 1) * gapAngle) / numSegments;

    const startAngle = -180 + index * (segmentAngle + gapAngle);
    const endAngle = startAngle + segmentAngle;

    const rx = 180; // Horizontal radius
    const ry = 180; // Vertical radius (smaller for oval shape)
    const cx = 200;
    const cy = 180;
    const strokeWidth = 18;

    const arcPath = describeEllipseArc(cx, cy, rx, ry, startAngle, endAngle);

    useEffect(() => {
        if (pathRef.current) {
            const pathLength = pathRef.current.getTotalLength();
            setLength(pathLength);
        }
    }, [arcPath]);

    useEffect(() => {
        let toValue = length;
        if (isCompleted) {
            toValue = 0; // Fully filled
        } else if (isCurrent) {
            toValue = length * (1 - fillPercentage / 100);
        }

        controls.start({
            strokeDashoffset: toValue,
            transition: { duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }
        });
    }, [isCompleted, isCurrent, fillPercentage, length, controls]);

    return (
        <g>
            {/* Background Tube */}
            <path
                d={arcPath}
                fill="none"
                stroke={primaryColor}
                strokeOpacity={0.15}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
            />
            {/* Liquid Fill */}
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


// --- Main Progress Bar Component ---
const LiquidTubeProgress: React.FC<LiquidTubeProgressProps> = ({
    fillPercentage,
    currentPrayer,
    prayerSegments,
    primaryColor = "#8B5CF6",
}) => {
    const currentPrayerIndex = prayerSegments.findIndex(p => p.name === currentPrayer);

    return (
        <div className="relative w-full flex justify-center items-center mt-2">
            <svg width="400" height="180" viewBox="0 0 400 180">
                <defs>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={primaryColor} floodOpacity="0.3" />
                    </filter>
                </defs>
                <g filter="url(#glow)">
                    {prayerSegments.map((_, index) => (
                        <Segment
                            key={index}
                            index={index}
                            isCurrent={index === currentPrayerIndex}
                            isCompleted={index < currentPrayerIndex}
                            fillPercentage={fillPercentage}
                            primaryColor={primaryColor}
                        />
                    ))}
                </g>
                {/* Prayer labels below the tube */}
                {prayerSegments.map((prayer, index) => {
                    const totalAngle = 180;
                    const numSegments = 5;
                    const gapAngle = 4;
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
                            key={`label-${index}`}
                            x={x}
                            y={y}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className={`text-xs font-medium ${index === currentPrayerIndex ? 'fill-white' : 'fill-gray-400'}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 1 + (index * 0.1) }}
                        >
                            {prayer.name}
                        </motion.text>
                    )
                })}
            </svg>
        </div>
    );
};

export default LiquidTubeProgress;