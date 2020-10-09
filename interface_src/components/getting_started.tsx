import React from 'react';
import { Text, Stack } from '@fluentui/react';

function GettingStarted(): any {
  document.title = 'Getting Started';

  return (
    <Stack id="root_getting_started">
      <Text variant="xLarge" block id="support_text">
        Getting Started.
      </Text>
    </Stack>
  );
}

export default GettingStarted;
