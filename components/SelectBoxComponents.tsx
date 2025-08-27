import React from 'react';
import { SelectBox as BaseSelectBox } from './SelectBoxComponents_new';

interface ExtendedSelectBoxProps extends React.ComponentProps<typeof BaseSelectBox> {
	belowContent?: React.ReactNode;
}

export const SelectBox: React.FC<ExtendedSelectBoxProps> = ({ belowContent, ...rest }) => {
	return (
		<div className="space-y-2">
			<BaseSelectBox {...rest} />
			{belowContent}
		</div>
	);
};

export default SelectBox;
