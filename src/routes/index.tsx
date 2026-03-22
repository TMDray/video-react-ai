import {Editor} from '../editor/editor';
import {Route} from './+types';

export const meta: Route.MetaFunction = () => {
	return [
		{
			title: 'Remotion Editor Starter',
		},
	];
};

export default function Index() {
	return <Editor />;
}
