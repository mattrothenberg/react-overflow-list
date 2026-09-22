import type { Preview } from '@storybook/react-vite';
import '../stories/style.css';

const preview: Preview = {
  parameters: {
    controls: { expanded: false },
  },
};

export default preview;
