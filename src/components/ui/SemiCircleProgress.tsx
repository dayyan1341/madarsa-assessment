// Not used (A relatively simple semi-circle progress component)
const SemiCircleProgress: React.FC<{ fillPercentage: number }> = ({ fillPercentage }) => {
    const totalSegments = 5;
    const filledSegments = Math.round((fillPercentage / 100) * totalSegments);

    return (
        <div className="relative w-full flex justify-center mt-8">
            <div className="relative">
                <svg width="280" height="140" viewBox="0 0 280 140" className="transform">
                    {Array.from({ length: totalSegments }, (_, index) => {
                        const startAngle = (index * 180) / totalSegments;
                        const endAngle = ((index + 1) * 180) / totalSegments;
                        const startRadian = (startAngle * Math.PI) / 180;
                        const endRadian = (endAngle * Math.PI) / 180;
                        const radius = 120;
                        const centerX = 140;
                        const centerY = 130;

                        const x1 = centerX + radius * Math.cos(Math.PI - startRadian);
                        const y1 = centerY - radius * Math.sin(Math.PI - startRadian);
                        const x2 = centerX + radius * Math.cos(Math.PI - endRadian);
                        const y2 = centerY - radius * Math.sin(Math.PI - endRadian);

                        const isFilled = index < filledSegments;

                        return (
                            <path
                                key={index}
                                d={`M ${x1} ${y1} A ${radius} ${radius} 0 0 0 ${x2} ${y2}`}
                                stroke={isFilled ? "#fff" : "rgba(255, 255, 255, 0.1)"}
                                strokeWidth="4"
                                fill="none"
                                strokeLinecap="round"
                                className="transition-all duration-300"
                            />
                        );
                    })}
                </svg>
            </div>
        </div>
    );
};

export default SemiCircleProgress;