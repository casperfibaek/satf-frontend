import React from 'react';
import {
  Text, Stack, Separator, Link,
} from '@fluentui/react';

function Home(): any {
  document.title = 'SatF Tool - Home';

  return (
    <Stack id="home_body">
      <Text variant="xLarge" block className="home_text">
        Installing the SatF Tool
      </Text>
      <Separator />
      <Text variant="mediumPlus" block className="home_text_base">
          Download the SatF tool here: {<Link download href="https://satf.azurewebsites.net/interface/satf_production.xml">Production</Link>}
      </Text>
      <Text variant="mediumPlus" block className="home_text_base">
        Download the SatF tool here: {<Link download href="https://satf-test.azurewebsites.net/interface/satf_development.xml">Development</Link>}
      </Text>
      <div className="guide">
        <Text variant="mediumPlus" block className="guide_text">Installation Guide:</Text>
        <Text variant="medium" block className="guide_text_body">
            1. Go to <Link href="https://excel.office.com/">excel.office.com</Link> and log into your Microsoft account.
        </Text>
        <Text variant="medium" block className="guide_text_body">
            2. Open a workbook or createa new empty one.
        </Text>
        <Text variant="medium" block className="guide_text_body">
            3. In excel, go to Insert, go to "Get Add Ins", at the top go to “Upload my add in”, upload the downloaded xml file from the downloads folder.
        </Text>
        <Text variant="medium" block className="guide_text_body">
        4. Now you have the SATF ribbon to test out and play around with
        </Text>
      </div>
    </Stack>
  );
}

export default Home;
