import type { Config } from '@react-router/dev/config';
import { vercelPreset } from '@react-router/vercel';

export default {
	appDirectory: './src/app',
	ssr: true,
	presets: [vercelPreset()],
} satisfies Config;
