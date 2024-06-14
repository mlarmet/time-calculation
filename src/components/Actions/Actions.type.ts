import React from "react";

import { ColorPaletteProp } from "@mui/joy";

export interface DisplayAlert {
	open: boolean;
	color: ColorPaletteProp;
	content: string;
	startDecorator?: React.ReactNode;
}
