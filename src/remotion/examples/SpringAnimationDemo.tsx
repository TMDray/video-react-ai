import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	Sequence,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

const BouncingBox: React.FC<{
	delay: number;
	color: string;
	label: string;
}> = ({delay, color, label}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const enter = spring({
		frame: frame - delay,
		fps,
		config: {damping: 8, stiffness: 100},
	});

	const y = interpolate(enter, [0, 1], [600, 0]);
	const rotate = interpolate(enter, [0, 1], [-45, 0]);

	return (
		<div
			style={{
				width: 160,
				height: 160,
				backgroundColor: color,
				borderRadius: 20,
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				transform: `translateY(${y}px) rotate(${rotate}deg)`,
				boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
			}}
		>
			<span
				style={{
					fontSize: 20,
					fontWeight: 'bold',
					color: 'white',
					fontFamily: 'system-ui',
				}}
			>
				{label}
			</span>
		</div>
	);
};

const Title: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const scale = spring({frame, fps, config: {damping: 10}});
	const opacity = interpolate(frame, [0, 20], [0, 1], {
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				fontSize: 56,
				fontWeight: 'bold',
				color: 'white',
				fontFamily: 'system-ui',
				textAlign: 'center',
				transform: `scale(${scale})`,
				opacity,
				textShadow: '0 4px 12px rgba(0,0,0,0.3)',
			}}
		>
			Spring Animations
		</div>
	);
};

export const SpringAnimationDemo: React.FC = () => {
	return (
		<AbsoluteFill
			style={{
				background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<Sequence from={0} durationInFrames={120}>
				<AbsoluteFill
					style={{
						justifyContent: 'center',
						alignItems: 'center',
						gap: 40,
					}}
				>
					<Title />
					<div style={{display: 'flex', gap: 24, marginTop: 40}}>
						<BouncingBox delay={10} color="#e74c3c" label="Spring" />
						<BouncingBox delay={18} color="#3498db" label="Damping" />
						<BouncingBox delay={26} color="#2ecc71" label="Stiffness" />
						<BouncingBox delay={34} color="#f39c12" label="Mass" />
					</div>
				</AbsoluteFill>
			</Sequence>
		</AbsoluteFill>
	);
};
