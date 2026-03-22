import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {
	linearTiming,
	TransitionSeries,
} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {wipe} from '@remotion/transitions/wipe';

const Scene: React.FC<{
	color: string;
	title: string;
	emoji: string;
}> = ({color, title, emoji}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const scale = spring({frame, fps, config: {damping: 12}});
	const opacity = interpolate(frame, [0, 15], [0, 1], {
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill
			style={{
				backgroundColor: color,
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<div
				style={{
					textAlign: 'center',
					transform: `scale(${scale})`,
					opacity,
				}}
			>
				<div style={{fontSize: 80}}>{emoji}</div>
				<div
					style={{
						fontSize: 48,
						fontWeight: 'bold',
						color: 'white',
						fontFamily: 'system-ui',
						marginTop: 16,
						textShadow: '0 2px 8px rgba(0,0,0,0.3)',
					}}
				>
					{title}
				</div>
			</div>
		</AbsoluteFill>
	);
};

export const TransitionsDemo: React.FC = () => {
	return (
		<TransitionSeries>
			<TransitionSeries.Sequence durationInFrames={50}>
				<Scene color="#e74c3c" title="Fade Transition" emoji="🎬" />
			</TransitionSeries.Sequence>

			<TransitionSeries.Transition
				presentation={fade()}
				timing={linearTiming({durationInFrames: 20})}
			/>

			<TransitionSeries.Sequence durationInFrames={50}>
				<Scene color="#3498db" title="Slide Transition" emoji="🎞️" />
			</TransitionSeries.Sequence>

			<TransitionSeries.Transition
				presentation={slide({direction: 'from-left'})}
				timing={linearTiming({durationInFrames: 20})}
			/>

			<TransitionSeries.Sequence durationInFrames={50}>
				<Scene color="#2ecc71" title="Wipe Transition" emoji="✨" />
			</TransitionSeries.Sequence>

			<TransitionSeries.Transition
				presentation={wipe({direction: 'from-top-left'})}
				timing={linearTiming({durationInFrames: 20})}
			/>

			<TransitionSeries.Sequence durationInFrames={60}>
				<Scene color="#9b59b6" title="Remotion Rocks!" emoji="🚀" />
			</TransitionSeries.Sequence>
		</TransitionSeries>
	);
};
